#!/usr/bin/env python3
"""Test script for the AI providers API endpoints"""

import sys
import json
import urllib.request
import urllib.parse
import http.client
import ssl

def test_available_models():
    """Test the available models API endpoint"""
    try:
        # Create a context that ignores SSL verification (for testing)
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

        conn = http.client.HTTPConnection("localhost", 8000)
        conn.request("GET", "/api/available-models")
        response = conn.getresponse()

        if response.status == 200:
            data = response.read().decode('utf-8')
            result = json.loads(data)
            print("✅ Available Models API: Success")
            print(f"   Response: {result}")
            return True
        else:
            print(f"❌ Available Models API: Failed (Status: {response.status})")
            print(f"   Response: {response.read().decode('utf-8')}")
            return False

    except Exception as e:
        print(f"❌ Available Models API: Failed")
        print(f"   Error: {e}")
        return False


def test_active_model():
    """Test the active model API endpoint"""
    try:
        conn = http.client.HTTPConnection("localhost", 8000)
        conn.request("GET", "/api/active-model")
        response = conn.getresponse()

        if response.status == 200:
            data = response.read().decode('utf-8')
            result = json.loads(data)
            print("✅ Active Model API: Success")
            print(f"   Response: {result}")
            return True
        else:
            print(f"❌ Active Model API: Failed (Status: {response.status})")
            print(f"   Response: {response.read().decode('utf-8')}")
            return False

    except Exception as e:
        print(f"❌ Active Model API: Failed")
        print(f"   Error: {e}")
        return False


def main():
    """Main test function"""
    print("Testing WebMind Graph API endpoints")
    print("=" * 50)

    print("\n1. Testing Available Models endpoint:")
    test_available_models()

    print("\n2. Testing Active Model endpoint:")
    test_active_model()

    print("\n" + "=" * 50)
    print("API endpoints test completed")


if __name__ == "__main__":
    main()