"""
G3 CrossFit WODIFY Automation - Admin Dashboard API

This module provides admin endpoints for monitoring and testing.
"""

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import HTMLResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from loguru import logger
from datetime import datetime
from sqlalchemy import func

from config.settings import settings
from src.models.database import Member, Lead, EmailLog, WebhookLog
from src.services.database_service import database_service
from src.services.wodify_api_service import wodify_api_service
from src.services.sync_service import sync_service
from src.services.scheduler_service import scheduler_service


router = APIRouter(prefix="/admin", tags=["admin"])
limiter = Limiter(key_func=get_remote_address)


@router.get("/", response_class=HTMLResponse)
@limiter.limit("30/minute")
async def admin_dashboard(request: Request):
    """
    Admin dashboard with statistics and monitoring
    """
    session = database_service.get_session()
    
    try:
        # Get statistics
        total_members = session.query(func.count(Member.client_id)).scalar() or 0
        total_leads = session.query(func.count(Lead.lead_id)).scalar() or 0
        total_emails = session.query(func.count(EmailLog.id)).scalar() or 0
        total_webhooks = session.query(func.count(WebhookLog.id)).scalar() or 0
        
        # Get recent members
        recent_members = session.query(Member).order_by(Member.created_at.desc()).limit(5).all()
        
        # Get recent leads
        recent_leads = session.query(Lead).order_by(Lead.created_at.desc()).limit(5).all()
        
        # Get recent emails
        recent_emails = session.query(EmailLog).order_by(EmailLog.created_at.desc()).limit(10).all()
        
        # Get WODIFY status
        try:
            wodify_health = await wodify_api_service.check_api_health()
            sync_status = sync_service.get_sync_status()
        except Exception as e:
            logger.warning(f"Failed to get WODIFY status: {str(e)}")
            wodify_health = {"status": "error", "error": str(e)}
            sync_status = {"wodify_configured": False}
        
        html_content = f"""
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>G3 CrossFit - Admin Dashboard</title>
            <style>
                * {{
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }}
                
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    padding: 20px;
                }}
                
                .container {{
                    max-width: 1400px;
                    margin: 0 auto;
                }}
                
                .header {{
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    margin-bottom: 30px;
                }}
                
                .header h1 {{
                    color: #2A5D3C;
                    font-size: 32px;
                    margin-bottom: 10px;
                }}
                
                .header p {{
                    color: #666;
                    font-size: 16px;
                }}
                
                .stats-grid {{
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }}
                
                .stat-card {{
                    background: white;
                    padding: 25px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    transition: transform 0.3s ease;
                }}
                
                .stat-card:hover {{
                    transform: translateY(-5px);
                }}
                
                .stat-card h3 {{
                    color: #666;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 10px;
                }}
                
                .stat-card .number {{
                    color: #2A5D3C;
                    font-size: 48px;
                    font-weight: bold;
                }}
                
                .section {{
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    margin-bottom: 30px;
                }}
                
                .section h2 {{
                    color: #2A5D3C;
                    font-size: 24px;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #6BAF7E;
                }}
                
                table {{
                    width: 100%;
                    border-collapse: collapse;
                }}
                
                th {{
                    background: #f8f9fa;
                    padding: 12px;
                    text-align: left;
                    font-weight: 600;
                    color: #2A5D3C;
                    border-bottom: 2px solid #6BAF7E;
                }}
                
                td {{
                    padding: 12px;
                    border-bottom: 1px solid #eee;
                }}
                
                tr:hover {{
                    background: #f8f9fa;
                }}
                
                .badge {{
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }}
                
                .badge-success {{
                    background: #d4edda;
                    color: #155724;
                }}
                
                .badge-info {{
                    background: #d1ecf1;
                    color: #0c5460;
                }}
                
                .badge-warning {{
                    background: #fff3cd;
                    color: #856404;
                }}
                
                .test-section {{
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    margin-top: 20px;
                }}
                
                .test-button {{
                    background: #2A5D3C;
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }}
                
                .test-button:hover {{
                    background: #1f4429;
                }}
                
                .footer {{
                    text-align: center;
                    color: white;
                    margin-top: 30px;
                    padding: 20px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🐻 G3 CrossFit - Admin Dashboard</h1>
                    <p>WODIFY Automation System - Live Monitoring</p>
                    <p style="margin-top: 10px; font-size: 14px;">
                        <strong>Environment:</strong> {settings.app_env} | 
                        <strong>Time:</strong> {datetime.now().strftime("%d.%m.%Y %H:%M:%S")}
                    </p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Total Members</h3>
                        <div class="number">{total_members}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Total Leads</h3>
                        <div class="number">{total_leads}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Emails Sent</h3>
                        <div class="number">{total_emails}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Webhooks Received</h3>
                        <div class="number">{total_webhooks}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>🔗 WODIFY Integration Status</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
                        <div style="background: {'#d4edda' if wodify_health.get('status') == 'healthy' else '#f8d7da'}; padding: 20px; border-radius: 10px; border: 2px solid {'#28a745' if wodify_health.get('status') == 'healthy' else '#dc3545'};">
                            <h3 style="margin-bottom: 10px; color: {'#155724' if wodify_health.get('status') == 'healthy' else '#721c24'};">
                                {'✓' if wodify_health.get('status') == 'healthy' else '✗'} WODIFY API Status
                            </h3>
                            <p style="margin: 5px 0; color: {'#155724' if wodify_health.get('status') == 'healthy' else '#721c24'};">
                                <strong>Status:</strong> {wodify_health.get('status', 'unknown').upper()}
                            </p>
                            {f"<p style='margin: 5px 0; color: #721c24;'><strong>Error:</strong> {wodify_health.get('error', 'Unknown error')}</p>" if wodify_health.get('status') != 'healthy' else ""}
                            <p style="margin: 5px 0; color: {'#155724' if wodify_health.get('status') == 'healthy' else '#721c24'};">
                                <strong>Configured:</strong> {'Yes' if wodify_health.get('api_configured') else 'No'}
                            </p>
                        </div>
                        <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; border: 2px solid #0066cc;">
                            <h3 style="margin-bottom: 10px; color: #004085;">🔄 Synchronization Status</h3>
                            <p style="margin: 5px 0; color: #004085;">
                                <strong>Last Members Sync:</strong> {sync_status.get('last_sync_members', 'Never') or 'Never'}
                            </p>
                            <p style="margin: 5px 0; color: #004085;">
                                <strong>Last Leads Sync:</strong> {sync_status.get('last_sync_leads', 'Never') or 'Never'}
                            </p>
                            <p style="margin: 5px 0; color: #004085;">
                                <strong>Total Errors:</strong> {sync_status.get('total_errors', 0)}
                            </p>
                            <button class="test-button" onclick="triggerSync()" style="margin-top: 10px; width: 100%;">Trigger Manual Sync</button>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>📧 Recent Emails</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Recipient</th>
                                <th>Status</th>
                                <th>Sent At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {''.join([f'''
                            <tr>
                                <td><span class="badge badge-info">{email.email_type}</span></td>
                                <td>{email.recipient_name} ({email.recipient_email})</td>
                                <td><span class="badge badge-success">✓ Sent</span></td>
                                <td>{email.sent_at.strftime("%d.%m.%Y %H:%M") if email.sent_at else "N/A"}</td>
                            </tr>
                            ''' for email in recent_emails])}
                        </tbody>
                    </table>
                </div>
                
                <div class="section">
                    <h2>👥 Recent Members</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Membership</th>
                                <th>Price</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {''.join([f'''
                            <tr>
                                <td>{member.first_name} {member.last_name}</td>
                                <td>{member.email}</td>
                                <td>{member.membership_type}</td>
                                <td>€{member.monthly_price:.2f}</td>
                                <td>{member.created_at.strftime("%d.%m.%Y") if member.created_at else "N/A"}</td>
                            </tr>
                            ''' for member in recent_members])}
                        </tbody>
                    </table>
                </div>
                
                <div class="section">
                    <h2>🎯 Recent Leads</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {''.join([f'''
                            <tr>
                                <td>{lead.first_name} {lead.last_name}</td>
                                <td>{lead.email}</td>
                                <td><span class="badge badge-warning">{lead.lead_status.value}</span></td>
                                <td>{lead.created_at.strftime("%d.%m.%Y") if lead.created_at else "N/A"}</td>
                            </tr>
                            ''' for lead in recent_leads])}
                        </tbody>
                    </table>
                </div>
                
                <div class="section">
                    <h2>🧪 Test Webhook</h2>
                    <div class="test-section">
                        <p style="margin-bottom: 15px;">Send a test webhook to verify the system is working:</p>
                        <button class="test-button" onclick="sendTestWebhook()">Send Test Membership Webhook</button>
                        <button class="test-button" onclick="sendTestLead()" style="margin-left: 10px;">Send Test Lead Webhook</button>
                        <div id="test-result" style="margin-top: 15px; padding: 10px; border-radius: 5px;"></div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>G3 CrossFit WODIFY Automation v1.0.0</p>
                    <p style="margin-top: 5px; font-size: 14px;">Built with FastAPI, SQLAlchemy & SendGrid</p>
                </div>
            </div>
            
            <script>
                async function sendTestWebhook() {{
                    const resultDiv = document.getElementById('test-result');
                    resultDiv.innerHTML = '<p style="color: #666;">Sending test webhook...</p>';
                    
                    try {{
                        const response = await fetch('/admin/test-webhook/membership', {{
                            method: 'POST'
                        }});
                        const data = await response.json();
                        
                        if (response.ok) {{
                            resultDiv.innerHTML = '<p style="color: #155724; background: #d4edda; padding: 10px; border-radius: 5px;">✓ Test webhook sent successfully!</p>';
                            setTimeout(() => location.reload(), 2000);
                        }} else {{
                            resultDiv.innerHTML = '<p style="color: #721c24; background: #f8d7da; padding: 10px; border-radius: 5px;">✗ Error: ' + data.detail + '</p>';
                        }}
                    }} catch (error) {{
                        resultDiv.innerHTML = '<p style="color: #721c24; background: #f8d7da; padding: 10px; border-radius: 5px;">✗ Error: ' + error.message + '</p>';
                    }}
                }}
                
                async function sendTestLead() {{
                    const resultDiv = document.getElementById('test-result');
                    resultDiv.innerHTML = '<p style="color: #666;">Sending test lead webhook...</p>';
                    
                    try {{
                        const response = await fetch('/admin/test-webhook/lead', {{
                            method: 'POST'
                        }});
                        const data = await response.json();
                        
                        if (response.ok) {{
                            resultDiv.innerHTML = '<p style="color: #155724; background: #d4edda; padding: 10px; border-radius: 5px;">✓ Test lead webhook sent successfully!</p>';
                            setTimeout(() => location.reload(), 2000);
                        }} else {{
                            resultDiv.innerHTML = '<p style="color: #721c24; background: #f8d7da; padding: 10px; border-radius: 5px;">✗ Error: ' + data.detail + '</p>';
                        }}
                    }} catch (error) {{
                        resultDiv.innerHTML = '<p style="color: #721c24; background: #f8d7da; padding: 10px; border-radius: 5px;">✗ Error: ' + error.message + '</p>';
                    }}
                }}
                
                async function triggerSync() {{
                    const resultDiv = document.getElementById('test-result');
                    resultDiv.innerHTML = '<p style="color: #666;">Starting synchronization...</p>';
                    
                    try {{
                        const response = await fetch('/api/sync/all?force=false', {{
                            method: 'POST'
                        }});
                        const data = await response.json();
                        
                        if (response.ok) {{
                            const membersInfo = data.members ? `Members: ${{data.members.synced || 0}} synced` : '';
                            const leadsInfo = data.leads ? `Leads: ${{data.leads.synced || 0}} synced` : '';
                            resultDiv.innerHTML = '<p style="color: #155724; background: #d4edda; padding: 10px; border-radius: 5px;">✓ Sync completed! ' + membersInfo + ' ' + leadsInfo + '</p>';
                            setTimeout(() => location.reload(), 3000);
                        }} else {{
                            resultDiv.innerHTML = '<p style="color: #721c24; background: #f8d7da; padding: 10px; border-radius: 5px;">✗ Error: ' + (data.detail || data.error || 'Unknown error') + '</p>';
                        }}
                    }} catch (error) {{
                        resultDiv.innerHTML = '<p style="color: #721c24; background: #f8d7da; padding: 10px; border-radius: 5px;">✗ Error: ' + error.message + '</p>';
                    }}
                }}
            </script>
        </body>
        </html>
        """
        
        return HTMLResponse(content=html_content)
        
    finally:
        session.close()


@router.get("/stats")
@limiter.limit("60/minute")
async def get_stats(request: Request):
    """
    Get system statistics as JSON including WODIFY status
    """
    session = database_service.get_session()
    
    try:
        # Get sync status
        sync_status = sync_service.get_sync_status()
        
        # Get WODIFY API health (async, but we'll handle errors gracefully)
        wodify_health = None
        try:
            wodify_health = await wodify_api_service.check_api_health()
        except Exception as e:
            logger.warning(f"Failed to check WODIFY API health: {str(e)}")
            wodify_health = {"status": "check_failed", "error": str(e)}
        
        stats = {
            "total_members": session.query(func.count(Member.client_id)).scalar() or 0,
            "total_leads": session.query(func.count(Lead.lead_id)).scalar() or 0,
            "total_emails": session.query(func.count(EmailLog.id)).scalar() or 0,
            "total_webhooks": session.query(func.count(WebhookLog.id)).scalar() or 0,
            "active_members": session.query(func.count(Member.client_id)).filter(
                Member.membership_status == "Active"
            ).scalar() or 0,
            "sync_status": sync_status,
            "wodify_api_health": wodify_health,
            "scheduler_status": scheduler_service.get_scheduler_status(),
            "timestamp": datetime.now().isoformat()
        }
        
        return stats
        
    finally:
        session.close()


@router.get("/wodify-status")
@limiter.limit("60/minute")
async def get_wodify_status(request: Request):
    """
    Get detailed WODIFY API status and configuration
    
    Returns:
        WODIFY API health status, configuration, and sync status
    """
    try:
        # Get WODIFY API health
        wodify_health = await wodify_api_service.check_api_health()
        
        # Get sync status
        sync_status = sync_service.get_sync_status()
        
        # Get configuration (without exposing secrets)
        config = {
            "api_url": settings.wodify_api_url,
            "location_id": settings.wodify_location_id,
            "api_key_configured": bool(settings.wodify_api_key),
            "webhook_secret_configured": bool(settings.wodify_webhook_secret),
            "sales_portal_configured": bool(settings.wodify_sales_portal_url),
            "tenant": settings.wodify_tenant
        }
        
        return {
            "wodify_api_health": wodify_health,
            "sync_status": sync_status,
            "configuration": config,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting WODIFY status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get WODIFY status: {str(e)}")


@router.post("/test-webhook/membership")
@limiter.limit("10/minute")
async def send_test_membership_webhook(request: Request):
    """
    Send a test membership webhook
    """
    from src.services.automation_service import automation_service
    from src.models.wodify import WodifyMembershipCreated, MembershipStatus
    import uuid
    
    # Create test membership data
    test_data = WodifyMembershipCreated(
        client_id=f"test_{uuid.uuid4().hex[:8]}",
        first_name="Max",
        last_name="Mustermann",
        email=f"test.{uuid.uuid4().hex[:8]}@example.com",
        phone="+49 123 456789",
        membership_id=f"mem_{uuid.uuid4().hex[:8]}",
        membership_type="Regular Unlimited",
        membership_status=MembershipStatus.ACTIVE,
        monthly_price=129.00,
        start_date=datetime.now(),
        is_first_membership=True
    )
    
    # Process the test webhook
    await automation_service.process_new_membership(test_data)
    
    return {
        "status": "success",
        "message": "Test membership webhook processed",
        "client_id": test_data.client_id
    }


@router.get("/scheduler-status")
@limiter.limit("60/minute")
async def get_scheduler_status(request: Request):
    """
    Get scheduler status and all scheduled jobs
    
    Returns:
        Scheduler status with all jobs
    """
    try:
        status = scheduler_service.get_scheduler_status()
        return status
    except Exception as e:
        logger.error(f"Error getting scheduler status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get scheduler status: {str(e)}")


@router.get("/scheduler/jobs")
@limiter.limit("60/minute")
async def get_all_jobs(request: Request):
    """
    Get all scheduled jobs
    
    Returns:
        List of all scheduled jobs
    """
    try:
        jobs = scheduler_service.get_all_jobs()
        return {"jobs": jobs, "total": len(jobs)}
    except Exception as e:
        logger.error(f"Error getting jobs: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get jobs: {str(e)}")


@router.get("/scheduler/jobs/{job_id}")
@limiter.limit("60/minute")
async def get_job_status(request: Request, job_id: str):
    """
    Get status of a specific job
    
    Args:
        job_id: Job ID
    
    Returns:
        Job status information
    """
    try:
        job_status = scheduler_service.get_job_status(job_id)
        if job_status:
            return job_status
        else:
            raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting job status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get job status: {str(e)}")


@router.delete("/scheduler/jobs/{job_id}")
@limiter.limit("10/minute")
async def delete_job(request: Request, job_id: str):
    """
    Remove a scheduled job
    
    Args:
        job_id: Job ID to remove
    
    Returns:
        Success status
    """
    try:
        success = scheduler_service.remove_job(job_id)
        if success:
            return {"status": "success", "message": f"Job {job_id} removed"}
        else:
            raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error removing job: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to remove job: {str(e)}")


@router.post("/test-webhook/lead")
@limiter.limit("10/minute")
async def send_test_lead_webhook(request: Request):
    """
    Send a test lead webhook
    """
    from src.services.automation_service import automation_service
    from src.models.wodify import WodifyLeadCreated, LeadStatus
    import uuid
    
    # Create test lead data
    test_data = WodifyLeadCreated(
        lead_id=f"lead_{uuid.uuid4().hex[:8]}",
        first_name="Anna",
        last_name="Schmidt",
        email=f"lead.{uuid.uuid4().hex[:8]}@example.com",
        phone="+49 987 654321",
        lead_status=LeadStatus.NEW,
        interested_in="CrossFit Fundamentals"
    )
    
    # Process the test webhook
    await automation_service.process_new_lead(test_data)
    
    return {
        "status": "success",
        "message": "Test lead webhook processed",
        "lead_id": test_data.lead_id
    }

