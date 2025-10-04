#!/usr/bin/env python
"""
Simple test script to verify API endpoints work
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_companies_endpoint():
    """Test the companies endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/companies/login/companies/")
        print(f"Companies endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} companies")
            for company in data:
                print(f"  - {company['name']} (ID: {company['id']})")
        else:
            print(f"Error: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error connecting to companies endpoint: {e}")
        return False

def test_login_endpoint():
    """Test the login endpoint"""
    try:
        # First, let's try to get companies to see if we have any
        companies_response = requests.get(f"{BASE_URL}/companies/login/companies/")
        if companies_response.status_code != 200:
            print("No companies available for login test")
            return False
        
        companies = companies_response.json()
        if not companies:
            print("No companies found for login test")
            return False
        
        # Try to get users for the first company
        company_id = companies[0]['id']
        users_response = requests.get(f"{BASE_URL}/companies/login/companies/{company_id}/users/")
        print(f"Users endpoint status: {users_response.status_code}")
        
        if users_response.status_code == 200:
            users = users_response.json()
            print(f"Found {len(users)} users for company {companies[0]['name']}")
            for user in users:
                print(f"  - {user['first_name']} {user['last_name']} ({user['role']}) - {user['email']}")
        else:
            print(f"Error getting users: {users_response.text}")
        
        return users_response.status_code == 200
    except Exception as e:
        print(f"Error testing login endpoint: {e}")
        return False

def main():
    print("Testing API endpoints...")
    print("=" * 50)
    
    print("\n1. Testing companies endpoint...")
    companies_ok = test_companies_endpoint()
    
    print("\n2. Testing users endpoint...")
    users_ok = test_login_endpoint()
    
    print("\n" + "=" * 50)
    if companies_ok and users_ok:
        print("✅ All endpoints are working!")
    else:
        print("❌ Some endpoints are not working. Make sure the Django server is running.")
        print("Run: python manage.py runserver")

if __name__ == "__main__":
    main()
