#!/usr/bin/env python
"""
Setup script for the Expense Management System Django backend
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up Expense Management System Backend")
    print("=" * 50)
    
    # Check if Python is available
    if not run_command("python --version", "Checking Python installation"):
        print("❌ Python is not installed or not in PATH")
        print("Please install Python 3.8+ and try again")
        return False
    
    # Check if pip is available
    if not run_command("pip --version", "Checking pip installation"):
        print("❌ pip is not installed or not in PATH")
        print("Please install pip and try again")
        return False
    
    # Create virtual environment
    if not os.path.exists("venv"):
        if not run_command("python -m venv venv", "Creating virtual environment"):
            return False
    else:
        print("✅ Virtual environment already exists")
    
    # Activate virtual environment and install requirements
    if os.name == 'nt':  # Windows
        activate_cmd = "venv\\Scripts\\activate"
        pip_cmd = "venv\\Scripts\\pip"
        python_cmd = "venv\\Scripts\\python"
    else:  # Unix/Linux/Mac
        activate_cmd = "source venv/bin/activate"
        pip_cmd = "venv/bin/pip"
        python_cmd = "venv/bin/python"
    
    # Install requirements
    if not run_command(f"{pip_cmd} install -r requirements.txt", "Installing Python dependencies"):
        return False
    
    # Create .env file if it doesn't exist
    if not os.path.exists(".env"):
        if os.path.exists("env.example"):
            run_command("copy env.example .env" if os.name == 'nt' else "cp env.example .env", "Creating .env file")
            print("📝 Please edit .env file with your configuration")
        else:
            print("⚠️  env.example not found, please create .env file manually")
    
    # Create logs directory
    os.makedirs("logs", exist_ok=True)
    
    # Create media directories
    os.makedirs("media/avatars", exist_ok=True)
    os.makedirs("media/company_logos", exist_ok=True)
    os.makedirs("media/expense_receipts", exist_ok=True)
    
    # Run Django setup commands
    if not run_command(f"{python_cmd} manage.py makemigrations", "Creating Django migrations"):
        return False
    
    if not run_command(f"{python_cmd} manage.py migrate", "Running Django migrations"):
        return False
    
    print("\n🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Edit .env file with your database and email settings")
    print("2. Create a superuser: python manage.py createsuperuser")
    print("3. Start the development server: python manage.py runserver")
    print("4. Access the admin panel at: http://localhost:8000/admin/")
    print("5. API documentation at: http://localhost:8000/api/")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
