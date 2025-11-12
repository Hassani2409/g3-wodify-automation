#!/usr/bin/env python3
"""
Performance Test Script - G3 CrossFit WODIFY Automation

Dieses Skript führt Performance-Tests für API-Endpunkte durch.
"""

import requests
import time
import statistics
import os
from typing import List, Dict, Tuple
import sys

# API Base URL
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")

# Colors for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'


def print_header(text: str):
    """Print formatted header"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}\n")


def print_success(text: str):
    """Print success message"""
    print(f"{Colors.GREEN}✅ {text}{Colors.RESET}")


def print_error(text: str):
    """Print error message"""
    print(f"{Colors.RED}❌ {text}{Colors.RESET}")


def print_warning(text: str):
    """Print warning message"""
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.RESET}")


def print_info(text: str):
    """Print info message"""
    print(f"{Colors.BLUE}ℹ️  {text}{Colors.RESET}")


def measure_response_time(url: str, method: str = "GET", **kwargs) -> Tuple[float, int]:
    """
    Measure response time for an API endpoint
    
    Returns:
        Tuple of (response_time_ms, status_code)
    """
    start_time = time.time()
    try:
        if method == "GET":
            response = requests.get(url, timeout=10, **kwargs)
        elif method == "POST":
            response = requests.post(url, timeout=10, **kwargs)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        end_time = time.time()
        response_time_ms = (end_time - start_time) * 1000
        return response_time_ms, response.status_code
    except requests.exceptions.RequestException as e:
        end_time = time.time()
        response_time_ms = (end_time - start_time) * 1000
        print_warning(f"Request failed: {str(e)}")
        return response_time_ms, 0


def test_endpoint_performance(
    endpoint: str,
    method: str = "GET",
    expected_max_ms: float,
    iterations: int = 10,
    **kwargs
) -> Dict:
    """
    Test endpoint performance
    
    Args:
        endpoint: API endpoint path
        method: HTTP method
        expected_max_ms: Maximum expected response time in milliseconds
        iterations: Number of test iterations
        **kwargs: Additional arguments for requests
    
    Returns:
        Dictionary with test results
    """
    url = f"{API_BASE_URL}{endpoint}"
    response_times = []
    status_codes = []
    
    print_info(f"Testing {method} {endpoint} ({iterations} iterations)...")
    
    for i in range(iterations):
        response_time, status_code = measure_response_time(url, method, **kwargs)
        response_times.append(response_time)
        status_codes.append(status_code)
        time.sleep(0.1)  # Small delay between requests
    
    # Calculate statistics
    avg_time = statistics.mean(response_times)
    median_time = statistics.median(response_times)
    min_time = min(response_times)
    max_time = max(response_times)
    p95_time = sorted(response_times)[int(len(response_times) * 0.95)]
    
    # Check if meets requirements
    meets_requirement = avg_time <= expected_max_ms
    success_rate = sum(1 for sc in status_codes if sc == 200) / len(status_codes) * 100
    
    result = {
        "endpoint": endpoint,
        "method": method,
        "expected_max_ms": expected_max_ms,
        "avg_ms": avg_time,
        "median_ms": median_time,
        "min_ms": min_time,
        "max_ms": max_time,
        "p95_ms": p95_time,
        "meets_requirement": meets_requirement,
        "success_rate": success_rate,
        "iterations": iterations
    }
    
    # Print results
    if meets_requirement:
        print_success(f"✅ {endpoint}: {avg_time:.2f}ms (avg), {p95_time:.2f}ms (P95)")
    else:
        print_warning(f"⚠️  {endpoint}: {avg_time:.2f}ms (avg), {p95_time:.2f}ms (P95) - über Schwellenwert!")
    
    print_info(f"   Min: {min_time:.2f}ms, Max: {max_time:.2f}ms, Success Rate: {success_rate:.1f}%")
    
    return result


def test_api_response_times():
    """Test 1: API-Response-Zeit"""
    print_header("Test 1: API-Response-Zeit")
    
    results = []
    
    # Health Check - sollte sehr schnell sein
    results.append(test_endpoint_performance(
        "/webhooks/health",
        method="GET",
        expected_max_ms=100,
        iterations=20
    ))
    
    # Schedule Classes - sollte unter 500ms sein
    results.append(test_endpoint_performance(
        "/api/schedule/classes",
        method="GET",
        expected_max_ms=500,
        iterations=10
    ))
    
    # Admin Stats - sollte unter 500ms sein
    results.append(test_endpoint_performance(
        "/api/admin/stats",
        method="GET",
        expected_max_ms=500,
        iterations=10
    ))
    
    return results


def test_database_performance():
    """Test 3: Datenbank-Performance"""
    print_header("Test 3: Datenbank-Performance")
    
    print_warning("Datenbank-Performance-Tests erfordern spezielle Endpunkte")
    print_info("Diese Tests sollten mit Datenbank-Monitoring-Tools durchgeführt werden")
    
    # TODO: Implementiere spezielle Datenbank-Performance-Endpunkte
    return []


def main():
    """Main function to run performance tests"""
    print_header("Performance-Tests - G3 CrossFit WODIFY Automation")
    print_info(f"API Base URL: {API_BASE_URL}")
    print()
    
    # Prüfe Backend-Verfügbarkeit
    try:
        response = requests.get(f"{API_BASE_URL}/webhooks/health", timeout=5)
        if response.status_code != 200:
            print_error("Backend ist nicht erreichbar oder antwortet nicht korrekt")
            sys.exit(1)
        print_success("Backend ist erreichbar")
    except requests.exceptions.RequestException as e:
        print_error(f"Backend ist nicht erreichbar: {str(e)}")
        print_info("Bitte starte das Backend mit: python main.py")
        sys.exit(1)
    
    all_results = []
    
    # Führe Performance-Tests durch
    api_results = test_api_response_times()
    all_results.extend(api_results)
    
    db_results = test_database_performance()
    all_results.extend(db_results)
    
    # Zusammenfassung
    print_header("Performance-Test-Zusammenfassung")
    
    print(f"\n{Colors.BOLD}API-Response-Zeiten:{Colors.RESET}\n")
    print(f"{'Endpoint':<40} {'Avg (ms)':<12} {'P95 (ms)':<12} {'Status':<10}")
    print("-" * 80)
    
    for result in all_results:
        status = "✅ OK" if result["meets_requirement"] else "⚠️  Langsam"
        print(f"{result['endpoint']:<40} {result['avg_ms']:<12.2f} {result['p95_ms']:<12.2f} {status}")
    
    # Gesamtbewertung
    all_meet_requirement = all(r["meets_requirement"] for r in all_results if r)
    
    print()
    if all_meet_requirement:
        print_success("Alle Performance-Anforderungen erfüllt! 🎉")
        return 0
    else:
        print_warning("Einige Endpunkte überschreiten die Performance-Schwellenwerte")
        return 1


if __name__ == "__main__":
    sys.exit(main())

