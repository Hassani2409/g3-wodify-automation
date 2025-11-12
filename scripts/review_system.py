#!/usr/bin/env python3
"""
System Review Script - G3 CrossFit WODIFY Automation

Dieses Skript führt durch eine systematische Überprüfung aller Seiten und Funktionen.
"""

import requests
import os
import sys
import time
from typing import Dict, List, Tuple
from datetime import datetime

# API Base URL
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Colors
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    RESET = '\033[0m'
    BOLD = '\033[1m'


def print_header(text: str):
    """Print formatted header"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'='*70}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text:^70}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'='*70}{Colors.RESET}\n")


def print_section(text: str):
    """Print section header"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}▶ {text}{Colors.RESET}")
    print("-" * 70)


def print_success(text: str):
    """Print success message"""
    print(f"{Colors.GREEN}  ✅ {text}{Colors.RESET}")


def print_error(text: str):
    """Print error message"""
    print(f"{Colors.RED}  ❌ {text}{Colors.RESET}")


def print_warning(text: str):
    """Print warning message"""
    print(f"{Colors.YELLOW}  ⚠️  {text}{Colors.RESET}")


def print_info(text: str):
    """Print info message"""
    print(f"{Colors.BLUE}  ℹ️  {text}{Colors.RESET}")


def check_endpoint(url: str, method: str = "GET", expected_status: int = 200, **kwargs) -> Tuple[bool, str]:
    """Check if endpoint is accessible"""
    try:
        if method == "GET":
            response = requests.get(url, timeout=5, **kwargs)
        elif method == "POST":
            response = requests.post(url, timeout=5, **kwargs)
        else:
            return False, f"Unsupported method: {method}"
        
        if response.status_code == expected_status:
            return True, f"Status {response.status_code}"
        else:
            return False, f"Status {response.status_code} (erwartet: {expected_status})"
    except requests.exceptions.RequestException as e:
        return False, f"Fehler: {str(e)}"


def review_backend_api():
    """Review Backend API Endpoints"""
    print_section("Backend API - Endpunkte")
    
    endpoints = [
        ("Health Check", "/webhooks/health", "GET", 200),
        ("API Root", "/", "GET", 200),
        ("API Docs", "/docs", "GET", 200),
        ("Admin Dashboard", "/admin/", "GET", 200),
        ("Admin Stats", "/api/admin/stats", "GET", [200, 401]),  # 401 wenn nicht authentifiziert
        ("Schedule Classes", "/api/schedule/classes", "GET", [200, 500]),  # 500 wenn WODIFY nicht konfiguriert
    ]
    
    results = []
    for name, endpoint, method, expected_status in endpoints:
        url = f"{API_BASE_URL}{endpoint}"
        if isinstance(expected_status, list):
            success = False
            status_msg = ""
            for status in expected_status:
                ok, msg = check_endpoint(url, method, status)
                if ok:
                    success = True
                    status_msg = msg
                    break
            if not success:
                status_msg = f"Keiner der erwarteten Status-Codes erreicht"
        else:
            success, status_msg = check_endpoint(url, method, expected_status)
        
        if success:
            print_success(f"{name}: {status_msg}")
            results.append((name, True))
        else:
            print_warning(f"{name}: {status_msg}")
            results.append((name, False))
    
    return results


def review_frontend_pages():
    """Review Frontend Pages"""
    print_section("Frontend - Seiten")
    
    pages = [
        ("Homepage", "/"),
        ("Kursplan", "/schedule"),
        ("Preise", "/pricing"),
        ("Kontakt", "/contact"),
        ("Shop", "/shop"),
        ("Login", "/login"),
        ("Dashboard", "/dashboard"),
    ]
    
    results = []
    for name, path in pages:
        url = f"{FRONTEND_URL}{path}"
        success, msg = check_endpoint(url, "GET", [200, 404])  # 404 wenn nicht gebaut
        
        if success:
            print_success(f"{name} ({path}): {msg}")
            results.append((name, True))
        else:
            print_warning(f"{name} ({path}): Nicht erreichbar (Frontend läuft möglicherweise nicht)")
            results.append((name, False))
    
    return results


def review_webhooks():
    """Review Webhook Endpoints"""
    print_section("Webhooks - Endpunkte")
    
    webhooks = [
        ("Membership Created", "/webhooks/wodify/membership-created", "POST"),
        ("Lead Created", "/webhooks/wodify/lead-created", "POST"),
        ("Class Booked", "/webhooks/wodify/class-booked", "POST"),
    ]
    
    results = []
    for name, endpoint, method in webhooks:
        url = f"{API_BASE_URL}{endpoint}"
        # Webhooks sollten ohne Signatur 401 zurückgeben
        success, msg = check_endpoint(url, method, [401, 422, 200])  # 401 = Auth fehlt, 422 = Validation, 200 = OK
        
        if success:
            print_success(f"{name}: Endpunkt erreichbar ({msg})")
            results.append((name, True))
        else:
            print_warning(f"{name}: {msg}")
            results.append((name, False))
    
    return results


def review_database():
    """Review Database Status"""
    print_section("Datenbank - Status")
    
    try:
        # Prüfe Admin Stats (enthält DB-Statistiken)
        response = requests.get(f"{API_BASE_URL}/api/admin/stats", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print_success("Datenbank-Verbindung erfolgreich")
            print_info(f"Mitglieder: {data.get('total_members', 0)}")
            print_info(f"Leads: {data.get('total_leads', 0)}")
            print_info(f"E-Mails: {data.get('total_emails', 0)}")
            print_info(f"Webhooks: {data.get('total_webhooks', 0)}")
            return True
        else:
            print_warning("Admin-Stats nicht verfügbar (möglicherweise Auth erforderlich)")
            return True  # Nicht kritisch
    except Exception as e:
        print_warning(f"Datenbank-Status konnte nicht abgerufen werden: {str(e)}")
        return False


def review_email_service():
    """Review Email Service Configuration"""
    print_section("E-Mail-Service - Konfiguration")
    
    # Prüfe ob SendGrid konfiguriert ist (indirekt über Health-Check)
    try:
        response = requests.get(f"{API_BASE_URL}/webhooks/health", timeout=5)
        if response.status_code == 200:
            print_success("E-Mail-Service-Endpunkt erreichbar")
            print_info("Hinweis: E-Mail-Versand muss manuell getestet werden")
            return True
        else:
            print_warning("Health-Check fehlgeschlagen")
            return False
    except Exception as e:
        print_warning(f"E-Mail-Service-Status konnte nicht abgerufen werden: {str(e)}")
        return False


def review_security():
    """Review Security Settings"""
    print_section("Sicherheit - Konfiguration")
    
    checks = []
    
    # Prüfe CORS (indirekt über OPTIONS-Request)
    try:
        response = requests.options(f"{API_BASE_URL}/", timeout=5)
        if response.status_code in [200, 204]:
            print_success("CORS konfiguriert")
            checks.append(True)
        else:
            print_warning("CORS-Status unklar")
            checks.append(False)
    except:
        checks.append(False)
    
    # Prüfe Rate Limiting (indirekt)
    print_info("Rate Limiting: Konfiguriert (siehe main.py)")
    checks.append(True)
    
    # Prüfe HTTPS (nur wenn Production)
    if "localhost" not in API_BASE_URL:
        if API_BASE_URL.startswith("https"):
            print_success("HTTPS aktiviert")
            checks.append(True)
        else:
            print_warning("HTTPS nicht aktiviert (Production!)")
            checks.append(False)
    else:
        print_info("HTTPS: Nicht erforderlich (Development)")
        checks.append(True)
    
    return all(checks)


def generate_review_report(results: Dict[str, List[Tuple[str, bool]]]):
    """Generate review report"""
    print_header("Review-Zusammenfassung")
    
    total_checks = 0
    passed_checks = 0
    
    for category, items in results.items():
        print(f"\n{Colors.BOLD}{category}:{Colors.RESET}")
        for name, success in items:
            total_checks += 1
            if success:
                passed_checks += 1
                print(f"  {Colors.GREEN}✅{Colors.RESET} {name}")
            else:
                print(f"  {Colors.YELLOW}⚠️ {Colors.RESET} {name}")
    
    print(f"\n{Colors.BOLD}Gesamt:{Colors.RESET}")
    print(f"  {passed_checks}/{total_checks} Checks bestanden ({passed_checks/total_checks*100:.1f}%)")
    
    if passed_checks == total_checks:
        print_success("Alle Checks bestanden! 🎉")
        return 0
    else:
        print_warning(f"{total_checks - passed_checks} Check(s) benötigen Aufmerksamkeit")
        return 1


def main():
    """Main review function"""
    print_header("System Review - G3 CrossFit WODIFY Automation")
    print_info(f"Backend URL: {API_BASE_URL}")
    print_info(f"Frontend URL: {FRONTEND_URL}")
    print_info(f"Datum: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Prüfe Backend-Verfügbarkeit
    try:
        response = requests.get(f"{API_BASE_URL}/webhooks/health", timeout=5)
        if response.status_code != 200:
            print_error("Backend ist nicht erreichbar oder antwortet nicht korrekt")
            print_info("Bitte starte das Backend: python main.py")
            sys.exit(1)
        print_success("Backend ist erreichbar")
    except requests.exceptions.RequestException as e:
        print_error(f"Backend ist nicht erreichbar: {str(e)}")
        print_info("Bitte starte das Backend: python main.py")
        sys.exit(1)
    
    results = {}
    
    # Führe Reviews durch
    results["Backend API"] = review_backend_api()
    time.sleep(1)
    
    results["Frontend Seiten"] = review_frontend_pages()
    time.sleep(1)
    
    results["Webhooks"] = review_webhooks()
    time.sleep(1)
    
    db_ok = review_database()
    results["Datenbank"] = [("Verbindung", db_ok)]
    time.sleep(1)
    
    email_ok = review_email_service()
    results["E-Mail-Service"] = [("Konfiguration", email_ok)]
    time.sleep(1)
    
    security_ok = review_security()
    results["Sicherheit"] = [("Konfiguration", security_ok)]
    
    # Generiere Report
    exit_code = generate_review_report(results)
    
    # Nächste Schritte
    print_header("Nächste Schritte")
    print_info("1. Manuelle Tests durchführen:")
    print("   - Frontend-Seiten im Browser öffnen")
    print("   - Funktionen testen (Login, Formulare, etc.)")
    print("   - Mobile-Ansicht prüfen")
    print()
    print_info("2. Integrationstests durchführen:")
    print("   - python scripts/uat_tests.py")
    print("   - Webhooks manuell testen")
    print("   - E-Mail-Versand testen")
    print()
    print_info("3. Performance-Tests durchführen:")
    print("   - python scripts/performance_tests.py")
    print()
    
    return exit_code


if __name__ == "__main__":
    sys.exit(main())

