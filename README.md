# Email Open Tracker (Take-Home Project)
A simple in-memory Node.js/Express service for tracking email open events. Intended as a demonstration of practical backend coding skills in a single-file, minimal environment.

## Features
- Accepts GET requests to track when an email has been opened
- Logs relevant metadata like user agent, IP, timestamp, etc.
- Stores events in memory with basic error validation
- Provides a read-only endpoint to return all tracked events
- Gracefully handles malformed or incomplete input

## Endpoints

### `GET /open`
Logs an email open event.

**Query Parameters:**
| Param       | Required | Description                  |
|-------------|----------|------------------------------|
| `campaignId`| Yes      | Identifier for the campaign  |
| `userId`    | Yes      | Identifier for the user      |

**Headers:**
- `User-Agent` is automatically captured from the request.
- IP is derived from `req.ip`.

**Example:**
GET /open?campaignId=123&userId=abc

**Responses:**
- `200 OK` – Successfully tracked
- `404 Not Found` – Missing required fields

---

### `GET /opens`
Returns all stored email open events.

**Example Response:**
```json
[
  {
    "campaignId": "123",
    "userId": "abc",
    "timestamp": "2025-05-18T00:00:00.000Z",
    "userAgent": "Mozilla/5.0...",
    "userIp": "::1",
    "errors": undefined
  }
]
