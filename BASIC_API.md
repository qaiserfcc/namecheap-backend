# Basic API Endpoints

This Express.js API includes simple, ready-to-use endpoints that work without any database or authentication setup.

## Available Endpoints

### 1. Root Endpoint
**URL:** `/`  
**Method:** `GET`  
**Description:** Returns basic API gateway information

**Example:**
```bash
curl https://your-api.vercel.app/
```

**Response:**
```json
{
  "message": "Namecheap E-Commerce API Gateway",
  "version": "1.0.0",
  "status": "running",
  "timestamp": "2025-12-30T17:43:46.112Z"
}
```

---

### 2. Health Check
**URL:** `/api/health`  
**Method:** `GET`  
**Description:** Simple health check endpoint (useful for monitoring and uptime checks)

**Example:**
```bash
curl https://your-api.vercel.app/api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-30T17:43:46.122Z"
}
```

---

### 3. API Information
**URL:** `/api/info`  
**Method:** `GET`  
**Description:** Returns API metadata and available endpoints

**Example:**
```bash
curl https://your-api.vercel.app/api/info
```

**Response:**
```json
{
  "name": "Namecheap E-Commerce API",
  "version": "1.0.0",
  "description": "Backend API for e-commerce platform",
  "endpoints": {
    "health": "/api/health",
    "info": "/api/info",
    "time": "/api/time",
    "echo": "/api/echo",
    "docs": "/api/docs"
  },
  "environment": "development"
}
```

---

### 4. Server Time
**URL:** `/api/time`  
**Method:** `GET`  
**Description:** Returns current server time in multiple formats

**Example:**
```bash
curl https://your-api.vercel.app/api/time
```

**Response:**
```json
{
  "timestamp": "2025-12-30T17:43:46.136Z",
  "unix": 1735579426,
  "formatted": "Monday, December 30, 2024 at 05:43:46 PM",
  "utc": "Mon, 30 Dec 2024 17:43:46 GMT",
  "timezone": "UTC"
}
```

---

### 5. Echo Endpoint
**URL:** `/api/echo`  
**Method:** `POST`  
**Description:** Echoes back the request data (useful for testing and debugging)

**Example:**
```bash
curl -X POST https://your-api.vercel.app/api/echo \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello API", "test": true}'
```

**Response:**
```json
{
  "message": "Echo response",
  "receivedData": {
    "message": "Hello API",
    "test": true
  },
  "headers": {
    "content-type": "application/json",
    "user-agent": "curl/8.5.0"
  },
  "method": "POST",
  "timestamp": "2025-12-30T17:43:46.164Z"
}
```

---

## Quick Test Script

Save this as `test-api.sh` to test all endpoints:

```bash
#!/bin/bash

API_URL="${1:-http://localhost:3000}"

echo "Testing API at: $API_URL"
echo ""

echo "=== Root Endpoint ==="
curl -s "$API_URL/" | jq .
echo ""

echo "=== Health Check ==="
curl -s "$API_URL/api/health" | jq .
echo ""

echo "=== API Info ==="
curl -s "$API_URL/api/info" | jq .
echo ""

echo "=== Server Time ==="
curl -s "$API_URL/api/time" | jq .
echo ""

echo "=== Echo Test ==="
curl -s -X POST "$API_URL/api/echo" \
  -H "Content-Type: application/json" \
  -d '{"test": "Hello API!"}' | jq .
echo ""

echo "All tests complete!"
```

Usage:
```bash
# Test local server
./test-api.sh http://localhost:3000

# Test deployed Vercel app
./test-api.sh https://your-project.vercel.app
```

## Integration Examples

### JavaScript/Node.js
```javascript
// Using fetch
const response = await fetch('https://your-api.vercel.app/api/health');
const data = await response.json();
console.log(data); // { status: 'ok', timestamp: '...' }

// Echo test
const echoResponse = await fetch('https://your-api.vercel.app/api/echo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello!' })
});
const echoData = await echoResponse.json();
console.log(echoData.receivedData); // { message: 'Hello!' }
```

### Python
```python
import requests

# Health check
response = requests.get('https://your-api.vercel.app/api/health')
print(response.json())  # {'status': 'ok', 'timestamp': '...'}

# Echo test
echo_response = requests.post(
    'https://your-api.vercel.app/api/echo',
    json={'message': 'Hello from Python!'}
)
print(echo_response.json()['receivedData'])
```

### cURL
```bash
# Simple health check
curl https://your-api.vercel.app/api/health

# Get server time
curl https://your-api.vercel.app/api/time

# Echo with custom data
curl -X POST https://your-api.vercel.app/api/echo \
  -H "Content-Type: application/json" \
  -d '{"user": "john", "action": "login"}'
```

## Use Cases

### Health Monitoring
Use `/api/health` with monitoring services like:
- UptimeRobot
- Pingdom  
- StatusCake
- Vercel's built-in monitoring

### API Testing
Use `/api/echo` to:
- Test HTTP clients
- Debug request payloads
- Verify headers
- Test API integration

### Time Synchronization
Use `/api/time` for:
- Getting server timestamps
- Timezone conversions
- Debugging time-related issues

## Next Steps

- **Basic Usage:** These endpoints work immediately after deployment
- **Advanced Features:** See [README.md](./README.md) for authentication, products, orders, etc.
- **Deployment:** See [VERCEL_DEPLOYMENT_QUICKSTART.md](./VERCEL_DEPLOYMENT_QUICKSTART.md)
- **API Documentation:** See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Notes

- ✅ No database required for these endpoints
- ✅ No authentication required
- ✅ CORS enabled for frontend integration
- ✅ Production-ready security with Helmet middleware
- ✅ Request logging with Morgan
- ✅ Ready for Vercel deployment
