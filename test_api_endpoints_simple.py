#!/usr/bin/env python3
"""Test script for the AI providers API endpoints (without Unicode characters)"""

import sys
import json
import urllib.request
import urllib.parse
import http.client
import ssl

def test_available_models():
    """Test the available models API endpoint"""
    try:
        conn = http.client.HTTPConnection("localhost", 8000)
        conn.request("GET", "/api/available-models")
        response = conn.getresponse()

        if response.status == 200:
            data = response.read().decode('utf-8')
            result = json.loads(data)
            print("OK Available Models API: Success")
            print("   Response: {}".format(result))
            return True
        else:
            print("ERROR Available Models API: Failed (Status: {})".format(response.status))
            print("   Response: {}".format(response.read().decode('utf-8')))
            return False

    except Exception as e:
        print("ERROR Available Models API: Failed")
        print("   Error: {}".format(e))
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
            print("OK Active Model API: Success")
            print("   Response: {}".format(result))
            return True
        else:
            print("ERROR Active Model API: Failed (Status: {})".format(response.status))
            print("   Response: {}".format(response.read().decode('utf-8')))
            return False

    except Exception as e:
        print("ERROR Active Model API: Failed")
        print("   Error: {}".format(e))
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