#!/usr/bin/env python3
"""
Script to check if the Django server is running and test API endpoints
"""

import requests
import json
import sys
import time

BASE_URL = "http://localhost:8000/api"

def check_server():
    """Check if Django server is running"""
    try:
        response = requests.get(f"{BASE_URL}/companies/login/companies/", timeout=5)
        return response.status_code == 200
    except requests.exceptions.RequestException:
        return False

def test_endpoints():
    """Test all API endpoints"""
    print("Testing API endpoints...")
    print("=" * 50)
    
    # Test companies endpoint
    try:
        response = requests.get(f"{BASE_URL}/companies/login/companies/")
        print(f"✅ Companies endpoint: {response.status_code}")
        if response.status_code == 200:
            companies = response.json()
            print(f"   Found {len(companies)} companies")
            for company in companies:
                print(f"   - {company['name']} (ID: {company['id']})")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Companies endpoint failed: {e}")
        return False
    
    # Test company users endpoint
    try:
        if companies:
            company_id = companies[0]['id']
            response = requests.get(f"{BASE_URL}/companies/login/companies/{company_id}/users/")
            print(f"✅ Company users endpoint: {response.status_code}")
            if response.status_code == 200:
                users = response.json()
                print(f"   Found {len(users)} users for {companies[0]['name']}")
                for user in users:
                    print(f"   - {user['first_name']} {user['last_name']} ({user['role']}) - {user['email']}")
            else:
                print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Company users endpoint failed: {e}")
        return False
    
    # Test login endpoint
    try:
        if companies and users:
            login_data = {
                "email": users[0]['email'],
                "password": "admin123",
                "company_id": company_id,
                "role": users[0]['role']
            }
            response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
            print(f"✅ Login endpoint: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   Login successful for {data['user']['first_name']} {data['user']['last_name']}")
                print(f"   Role: {data['user']['role']}")
                print(f"   Company: {data['user']['company']}")
            else:
                print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Login endpoint failed: {e}")
        return False
    
    return True

def main():
    print("Expense Management System - Server Check")
    print("=" * 50)
    
    if not check_server():
        print("❌ Django server is not running!")
        print("Please start the server with: python manage.py runserver")
        sys.exit(1)
    
    print("✅ Django server is running")
    
    if test_endpoints():
        print("\n🎉 All tests passed! The system is ready to use.")
        print("\nYou can now:")
        print("1. Open http://localhost:5173 in your browser")
        print("2. Test the login flow with the provided credentials")
        print("3. Try creating a new company")
    else:
        print("\n❌ Some tests failed. Please check the server logs.")
        sys.exit(1)

if __name__ == "__main__":
    main()
