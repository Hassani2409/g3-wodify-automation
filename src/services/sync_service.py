"""
G3 CrossFit WODIFY Automation - Synchronization Service

Handles automatic synchronization between WODIFY API and local database.
Implements conflict resolution and data integrity checks.
"""

from loguru import logger
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
from sqlalchemy import and_

from config.settings import settings
from src.services.wodify_api_service import wodify_api_service
from src.services.database_service import database_service
from src.models.database import Member, Lead, MembershipStatusDB, LeadStatusDB
from src.models.wodify import WodifyMembershipCreated, WodifyLeadCreated, MembershipStatus, LeadStatus


class SyncService:
    """Service for synchronizing data between WODIFY and local database"""
    
    def __init__(self):
        self.last_sync_members = None
        self.last_sync_leads = None
        self.sync_errors = []
    
    async def sync_members(
        self,
        force: bool = False,
        max_items: int = 1000
    ) -> Dict[str, Any]:
        """
        Synchronize members from WODIFY to local database
        
        Args:
            force: Force sync even if recently synced
            max_items: Maximum number of items to sync in one run
        
        Returns:
            Sync result with statistics
        """
        if not force and self.last_sync_members:
            # Don't sync more than once per hour
            if (datetime.utcnow() - self.last_sync_members).total_seconds() < 3600:
                logger.info("Members sync skipped - recently synced")
                return {
                    "success": True,
                    "skipped": True,
                    "message": "Sync skipped - recently synced"
                }
        
        logger.info("Starting members synchronization from WODIFY")
        sync_result = {
            "success": True,
            "synced": 0,
            "updated": 0,
            "created": 0,
            "errors": 0,
            "started_at": datetime.utcnow().isoformat()
        }
        
        try:
            # Fetch members from WODIFY
            wodify_members = await wodify_api_service.get_all_members(limit=max_items)
            
            if not wodify_members:
                logger.warning("No members returned from WODIFY API")
                sync_result["success"] = False
                sync_result["error"] = "No members returned from WODIFY"
                return sync_result
            
            session = database_service.get_session()
            try:
                for member_data in wodify_members:
                    try:
                        # Convert WODIFY data to our model
                        membership_data = WodifyMembershipCreated(
                            client_id=member_data.get("client_id", ""),
                            first_name=member_data.get("first_name", ""),
                            last_name=member_data.get("last_name", ""),
                            email=member_data.get("email", ""),
                            phone=member_data.get("phone"),
                            membership_id=member_data.get("membership_id", ""),
                            membership_type=member_data.get("membership_type", ""),
                            membership_status=MembershipStatus(member_data.get("membership_status", "Active")),
                            monthly_price=member_data.get("monthly_price", 0.0),
                            start_date=datetime.fromisoformat(member_data.get("start_date", datetime.utcnow().isoformat())),
                            end_date=datetime.fromisoformat(member_data.get("end_date")) if member_data.get("end_date") else None,
                            is_first_membership=member_data.get("is_first_membership", True),
                            referral_source=member_data.get("referral_source")
                        )
                        
                        # Check if member exists
                        existing_member = session.query(Member).filter(
                            Member.client_id == membership_data.client_id
                        ).first()
                        
                        if existing_member:
                            # Resolve conflicts: WODIFY is source of truth
                            existing_member.first_name = membership_data.first_name
                            existing_member.last_name = membership_data.last_name
                            existing_member.email = membership_data.email
                            existing_member.phone = membership_data.phone
                            existing_member.membership_id = membership_data.membership_id
                            existing_member.membership_type = membership_data.membership_type
                            existing_member.membership_status = MembershipStatusDB(membership_data.membership_status.value)
                            existing_member.monthly_price = membership_data.monthly_price
                            existing_member.start_date = membership_data.start_date
                            existing_member.end_date = membership_data.end_date
                            existing_member.updated_at = datetime.utcnow()
                            
                            sync_result["updated"] += 1
                        else:
                            # Create new member
                            await database_service.create_member(membership_data)
                            sync_result["created"] += 1
                        
                        sync_result["synced"] += 1
                        
                    except Exception as e:
                        logger.error(f"Error syncing member {member_data.get('client_id', 'unknown')}: {str(e)}")
                        sync_result["errors"] += 1
                        self.sync_errors.append({
                            "type": "member",
                            "client_id": member_data.get("client_id"),
                            "error": str(e),
                            "timestamp": datetime.utcnow().isoformat()
                        })
                
                session.commit()
                self.last_sync_members = datetime.utcnow()
                
            finally:
                session.close()
            
            sync_result["completed_at"] = datetime.utcnow().isoformat()
            sync_result["duration_seconds"] = (
                datetime.utcnow() - datetime.fromisoformat(sync_result["started_at"])
            ).total_seconds()
            
            logger.info(f"Members sync completed: {sync_result['synced']} synced, {sync_result['created']} created, {sync_result['updated']} updated, {sync_result['errors']} errors")
            
        except Exception as e:
            logger.error(f"Error during members sync: {str(e)}")
            sync_result["success"] = False
            sync_result["error"] = str(e)
        
        return sync_result
    
    async def sync_leads(
        self,
        force: bool = False,
        max_items: int = 1000
    ) -> Dict[str, Any]:
        """
        Synchronize leads from WODIFY to local database
        
        Args:
            force: Force sync even if recently synced
            max_items: Maximum number of items to sync in one run
        
        Returns:
            Sync result with statistics
        """
        if not force and self.last_sync_leads:
            # Don't sync more than once per hour
            if (datetime.utcnow() - self.last_sync_leads).total_seconds() < 3600:
                logger.info("Leads sync skipped - recently synced")
                return {
                    "success": True,
                    "skipped": True,
                    "message": "Sync skipped - recently synced"
                }
        
        logger.info("Starting leads synchronization from WODIFY")
        sync_result = {
            "success": True,
            "synced": 0,
            "updated": 0,
            "created": 0,
            "errors": 0,
            "started_at": datetime.utcnow().isoformat()
        }
        
        try:
            # Fetch leads from WODIFY
            wodify_leads = await wodify_api_service.get_all_leads(limit=max_items)
            
            if not wodify_leads:
                logger.warning("No leads returned from WODIFY API")
                sync_result["success"] = False
                sync_result["error"] = "No leads returned from WODIFY"
                return sync_result
            
            session = database_service.get_session()
            try:
                for lead_data in wodify_leads:
                    try:
                        # Convert WODIFY data to our model
                        lead_model = WodifyLeadCreated(
                            lead_id=lead_data.get("lead_id", ""),
                            first_name=lead_data.get("first_name", ""),
                            last_name=lead_data.get("last_name", ""),
                            email=lead_data.get("email", ""),
                            phone=lead_data.get("phone"),
                            lead_status=LeadStatus(lead_data.get("lead_status", "New")),
                            interested_in=lead_data.get("interested_in"),
                            message=lead_data.get("message"),
                            referral_source=lead_data.get("referral_source")
                        )
                        
                        # Check if lead exists
                        existing_lead = session.query(Lead).filter(
                            Lead.lead_id == lead_model.lead_id
                        ).first()
                        
                        if existing_lead:
                            # Resolve conflicts: WODIFY is source of truth
                            existing_lead.first_name = lead_model.first_name
                            existing_lead.last_name = lead_model.last_name
                            existing_lead.email = lead_model.email
                            existing_lead.phone = lead_model.phone
                            existing_lead.lead_status = LeadStatusDB(lead_model.lead_status.value)
                            existing_lead.interested_in = lead_model.interested_in
                            existing_lead.message = lead_model.message
                            existing_lead.updated_at = datetime.utcnow()
                            
                            sync_result["updated"] += 1
                        else:
                            # Create new lead
                            await database_service.create_lead(lead_model)
                            sync_result["created"] += 1
                        
                        sync_result["synced"] += 1
                        
                    except Exception as e:
                        logger.error(f"Error syncing lead {lead_data.get('lead_id', 'unknown')}: {str(e)}")
                        sync_result["errors"] += 1
                        self.sync_errors.append({
                            "type": "lead",
                            "lead_id": lead_data.get("lead_id"),
                            "error": str(e),
                            "timestamp": datetime.utcnow().isoformat()
                        })
                
                session.commit()
                self.last_sync_leads = datetime.utcnow()
                
            finally:
                session.close()
            
            sync_result["completed_at"] = datetime.utcnow().isoformat()
            sync_result["duration_seconds"] = (
                datetime.utcnow() - datetime.fromisoformat(sync_result["started_at"])
            ).total_seconds()
            
            logger.info(f"Leads sync completed: {sync_result['synced']} synced, {sync_result['created']} created, {sync_result['updated']} updated, {sync_result['errors']} errors")
            
        except Exception as e:
            logger.error(f"Error during leads sync: {str(e)}")
            sync_result["success"] = False
            sync_result["error"] = str(e)
        
        return sync_result
    
    async def sync_all(
        self,
        force: bool = False
    ) -> Dict[str, Any]:
        """
        Synchronize both members and leads
        
        Args:
            force: Force sync even if recently synced
        
        Returns:
            Combined sync results
        """
        logger.info("Starting full synchronization from WODIFY")
        
        members_result = await self.sync_members(force=force)
        leads_result = await self.sync_leads(force=force)
        
        return {
            "success": members_result.get("success", False) and leads_result.get("success", False),
            "members": members_result,
            "leads": leads_result,
            "sync_timestamp": datetime.utcnow().isoformat()
        }
    
    def get_sync_status(self) -> Dict[str, Any]:
        """
        Get current sync status
        
        Returns:
            Sync status information
        """
        return {
            "last_sync_members": self.last_sync_members.isoformat() if self.last_sync_members else None,
            "last_sync_leads": self.last_sync_leads.isoformat() if self.last_sync_leads else None,
            "recent_errors": self.sync_errors[-10:] if self.sync_errors else [],
            "total_errors": len(self.sync_errors),
            "wodify_configured": bool(settings.wodify_api_key and settings.wodify_location_id)
        }
    
    def clear_errors(self):
        """Clear sync error history"""
        self.sync_errors = []
        logger.info("Sync errors cleared")


# Global sync service instance
sync_service = SyncService()

