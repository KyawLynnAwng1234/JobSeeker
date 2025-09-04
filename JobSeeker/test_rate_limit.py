import requests
import time
import json

# Target the login endpoint directly
url = 'http://127.0.0.1:8000/accounts-employer/employer/login/'

# Test data
data = {
    'email': 'test@example.com',
    'password': 'password123'
}

# Set proper headers for Django REST framework
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

# Make 10 requests to trigger rate limiting (5/m limit)
print("Making multiple requests to trigger rate limiting...")
for i in range(10):
    print(f"\nRequest {i+1}:")
    response = requests.post(url, data=json.dumps(data), headers=headers)
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {response.json()}")
    except:
        print(f"Response: {response.text}")
    
    # Small delay between requests
    time.sleep(0.2)