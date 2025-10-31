#!/usr/bin/env python3
"""
G3 CrossFit WODIFY Automation - Demo Script

This script demonstrates the system functionality for client presentations.
"""

import asyncio
import httpx
import json
from datetime import datetime
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
import time

console = Console()

BASE_URL = "http://localhost:8000"


def print_header():
    """Print demo header"""
    console.print("\n")
    console.print(Panel.fit(
        "[bold green]🐻 G3 CrossFit WODIFY Automation[/bold green]\n"
        "[cyan]Live Demo - Automated Workflow System[/cyan]",
        border_style="green"
    ))
    console.print("\n")


async def check_health():
    """Check if the server is running"""
    console.print("[yellow]Checking server health...[/yellow]")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BASE_URL}/webhooks/health")
            if response.status_code == 200:
                console.print("[green]✓ Server is healthy and running![/green]\n")
                return True
            else:
                console.print("[red]✗ Server returned error status[/red]\n")
                return False
    except Exception as e:
        console.print(f"[red]✗ Server is not running: {e}[/red]")
        console.print("[yellow]Please start the server with: python main.py[/yellow]\n")
        return False


async def show_current_stats():
    """Show current system statistics"""
    console.print("[bold cyan]📊 Current System Statistics[/bold cyan]")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BASE_URL}/admin/stats")
            if response.status_code == 200:
                stats = response.json()
                
                table = Table(show_header=True, header_style="bold magenta")
                table.add_column("Metric", style="cyan")
                table.add_column("Value", style="green", justify="right")
                
                table.add_row("Total Members", str(stats["total_members"]))
                table.add_row("Total Leads", str(stats["total_leads"]))
                table.add_row("Emails Sent", str(stats["total_emails"]))
                table.add_row("Webhooks Received", str(stats["total_webhooks"]))
                table.add_row("Active Members", str(stats["active_members"]))
                
                console.print(table)
                console.print("\n")
    except Exception as e:
        console.print(f"[red]Error fetching stats: {e}[/red]\n")


async def send_test_membership():
    """Send a test membership webhook"""
    console.print("[bold cyan]🎯 Sending Test Membership Webhook[/bold cyan]")
    
    payload = {
        "client_id": f"demo_{int(time.time())}",
        "first_name": "Max",
        "last_name": "Mustermann",
        "email": f"max.demo.{int(time.time())}@example.com",
        "phone": "+49 30 12345678",
        "membership_id": f"mem_{int(time.time())}",
        "membership_type": "Regular Unlimited",
        "membership_status": "Active",
        "monthly_price": 129.00,
        "start_date": datetime.now().isoformat(),
        "is_first_membership": True
    }
    
    console.print(f"\n[yellow]Member Details:[/yellow]")
    console.print(f"  Name: {payload['first_name']} {payload['last_name']}")
    console.print(f"  Email: {payload['email']}")
    console.print(f"  Membership: {payload['membership_type']}")
    console.print(f"  Price: €{payload['monthly_price']}/month\n")
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        task = progress.add_task("Processing webhook...", total=None)
        
        try:
            async with httpx.AsyncClient() as client:
                # Create HMAC signature
                import hmac
                import hashlib
                payload_str = json.dumps(payload)
                signature = hmac.new(
                    b"demo_secret_key_12345",
                    payload_str.encode(),
                    hashlib.sha256
                ).hexdigest()
                
                response = await client.post(
                    f"{BASE_URL}/webhooks/wodify/membership-created",
                    json=payload,
                    headers={"X-Wodify-Signature": signature}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    progress.update(task, completed=True)
                    console.print(f"[green]✓ Webhook processed successfully![/green]")
                    console.print(f"[green]  Client ID: {data['client_id']}[/green]\n")
                    
                    console.print("[yellow]Automated Actions:[/yellow]")
                    console.print("  ✓ Member saved to database")
                    console.print("  ✓ Welcome email scheduled")
                    console.print("  ✓ Team notification scheduled\n")
                else:
                    console.print(f"[red]✗ Error: {response.status_code}[/red]\n")
        except Exception as e:
            console.print(f"[red]✗ Error: {e}[/red]\n")


async def send_test_lead():
    """Send a test lead webhook"""
    console.print("[bold cyan]🎯 Sending Test Lead Webhook[/bold cyan]")
    
    payload = {
        "lead_id": f"lead_{int(time.time())}",
        "first_name": "Anna",
        "last_name": "Schmidt",
        "email": f"anna.demo.{int(time.time())}@example.com",
        "phone": "+49 30 98765432",
        "lead_status": "New",
        "interested_in": "CrossFit Fundamentals"
    }
    
    console.print(f"\n[yellow]Lead Details:[/yellow]")
    console.print(f"  Name: {payload['first_name']} {payload['last_name']}")
    console.print(f"  Email: {payload['email']}")
    console.print(f"  Interested in: {payload['interested_in']}\n")
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        task = progress.add_task("Processing webhook...", total=None)
        
        try:
            async with httpx.AsyncClient() as client:
                # Create HMAC signature
                import hmac
                import hashlib
                payload_str = json.dumps(payload)
                signature = hmac.new(
                    b"demo_secret_key_12345",
                    payload_str.encode(),
                    hashlib.sha256
                ).hexdigest()
                
                response = await client.post(
                    f"{BASE_URL}/webhooks/wodify/lead-created",
                    json=payload,
                    headers={"X-Wodify-Signature": signature}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    progress.update(task, completed=True)
                    console.print(f"[green]✓ Webhook processed successfully![/green]")
                    console.print(f"[green]  Lead ID: {data['lead_id']}[/green]\n")
                    
                    console.print("[yellow]Automated Actions:[/yellow]")
                    console.print("  ✓ Lead saved to database")
                    console.print("  ✓ Nurturing email scheduled\n")
                else:
                    console.print(f"[red]✗ Error: {response.status_code}[/red]\n")
        except Exception as e:
            console.print(f"[red]✗ Error: {e}[/red]\n")


async def run_demo():
    """Run the complete demo"""
    print_header()
    
    # Check health
    if not await check_health():
        return
    
    # Show initial stats
    await show_current_stats()
    
    # Demo menu
    while True:
        console.print("[bold]Demo Options:[/bold]")
        console.print("  [cyan]1[/cyan] - Send Test Membership Webhook")
        console.print("  [cyan]2[/cyan] - Send Test Lead Webhook")
        console.print("  [cyan]3[/cyan] - Show Current Statistics")
        console.print("  [cyan]4[/cyan] - Open Admin Dashboard (in browser)")
        console.print("  [cyan]5[/cyan] - Exit Demo\n")
        
        choice = console.input("[bold yellow]Select option (1-5): [/bold yellow]")
        console.print("\n")
        
        if choice == "1":
            await send_test_membership()
        elif choice == "2":
            await send_test_lead()
        elif choice == "3":
            await show_current_stats()
        elif choice == "4":
            import webbrowser
            webbrowser.open(f"{BASE_URL}/admin/")
            console.print("[green]✓ Admin dashboard opened in browser[/green]\n")
        elif choice == "5":
            console.print("[green]Demo completed. Thank you![/green]\n")
            break
        else:
            console.print("[red]Invalid option. Please try again.[/red]\n")


if __name__ == "__main__":
    try:
        asyncio.run(run_demo())
    except KeyboardInterrupt:
        console.print("\n[yellow]Demo interrupted by user[/yellow]\n")

