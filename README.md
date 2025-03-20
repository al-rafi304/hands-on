# HandsOn

## 📌 Project Overview
HandsOn is a community driven social volunteering platform that connects people willing to help with those in need. It enables users to create and participate in community-driven events, collaborate on social causes, and track the impact of their contributions.

## 🚀 Technologies Used
- **Backend:** Node.js, Express.js
- **Frontend:** React.js, TailwindCSS
- **Database:** MongoDB (mongoose)
- **Authentication:** JWT
- **Deployment:** Docker

## ✨ Features
- **User Registration & Authentication** – Secure login system with JWT-based authentication.
- **Event Discovery** – Users can create and join events to help communities.
- **Help Requests** - Anyone can post a help request with levels of urgency.
- **Comment & Like System** – Engage with help requests by commenting and liking posts.
- **Impact Tracking** – Log volunteer hours and verify them through peer verification system.

## Database Schema

![HandsOn](https://github.com/user-attachments/assets/7e91682b-11db-44db-90ca-ffa79c31e2e9)

## Setup & Run Instruction
This project can be run both locally and in a docker container. 
### Env file structure
This is an example environment file
```shell
NODE_ENV=development
SERVER_PORT=3000
MONGO_URI=mongodb://localhost:27017/<db-name>
JWT_SECRET=your_jwt_secret
JWT_LIFETIME=3600
```

### Running in docker
Place the .env file in the root directory with the docker compose file
```bash
touch .env
```
Build the images and run it in detached mode. It will automatically install all dependencies and start both the server and the client in background.
```bash
docker-compose up -d --build
```
View the server logs
```bash
docker-compose logs -f server
```
View the client logs
```bash
docker-compose logs -f client
```

### Running locally

**Ensure that mongodb in running locally**
```bash
mongo
```

Place the .env file in the server directory
```bash
touch server/.env
```

Install dependencies for both server and client. Go to each directory and run
```bash
npm install
```
Start the server
```bash
cd server
npm run dev
```
Start the client
```bash
cd client
npm run dev
```

# API Documentation

## Base URL
```
/api/v1
```

---
## Authentication
### Login
**POST** `/auth/login`
#### Request Body
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
#### Response
```json
{
  "token": "jwt_token",
  "user_id": "userId"
}
```

### Register
**POST** `/auth/register`
#### Request Body
```json
{
  "name": "name", 
  "email": "user@example.com", 
  "password": "securepassword", 
  "location": "City, Country", 
  "bio": "user bio", 
  "skills": ["skill1", "skill2"], 
  "causesSupport": ["Animal Welfare"] // from constants.js
}
```
#### Response
```json
{
  "token": "jwt_token",
  "user_id": "userId"
}
```

---
## User
### Get User Details
**GET** `/user/`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Response
```json
{
  "_id": "67dc29624f443c34015bb753",
  "name": "name", 
  "email": "user@example.com",
  "location": "City, Country", 
  "bio": "user bio", 
  "skills": ["skill1", "skill2"], 
  "causesSupport": ["Animal Welfare"]
  "totalHours": 0,
  "points": 0
}
```

### Update User
**PATCH** `/user/`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Request Body
```json
{
  "name": "name", 
  "email": "user@example.com",
  "location": "City, Country", 
  "bio": "user bio", 
  "skills": ["skill1", "skill2"], 
  "causesSupport": ["Animal Welfare"] // from constants.js
}
```
#### Response
```json
{
  "user": { ...userData }
}
```

---
## Events
### Create Event
**POST** `/event/`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Request Body
```json
{
  "title": "Beach Cleanup",
  "description": "Join us in cleaning the beach!",
  "date": "2025-04-15T10:00:00Z",
  "location": "Beachfront, City",
  "category": "Environment"  // from constants.js
}
```
#### Response
```json
{
  "event_id": "eventId"
}
```

### Get Specific Events
**GET** `/event/{eventId}`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Response
```json
{
  "event": {
    "_id": "67cdc4c75e800c93f7813540",
    "organizer": {
        "_id": "67cb02a5c2d235b0ade7a9d1",
        "name": "test"
    },
    "attending": [
        "67d0012c6e7434f66a7906ae"
    ],
    "title": "Beach Cleanup",
    "description": "Join us in cleaning the beach!",
    "date": "2025-04-15T10:00:00Z",
    "location": "Beachfront, City",
    "category": "Environment",
    "createdAt": "2025-03-09T16:41:43.894Z",
    "updatedAt": "2025-03-14T16:01:02.442Z",
  },
}
```
### Get All Events
**GET** `/event/`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Response
```json
{
  "events": [
    { ...eventData },
  ]
}
```

### Get User Attending Events
**GET** `/event/attending`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Response
```json
{
  "events": [
    { ...eventData },
  ]
}
```

### Get User Organized Events
**GET** `/event/organized`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Response
```json
{
  "events": [
    { ...eventData },
  ]
}
```

### Join Event
**POST** `/event/{eventId}/join`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Response
```json
{
  "msg": "User joined event!"
}
```

### Leave Event
**POST** `/event/{eventId}/leave`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Response
```json
{
  "msg": "User left event!"
}
```

---
## Help Requests
### Create Help Request
**POST** `/request/`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Request Body
```json
{
  "title": "Need volunteers for food distribution",
  "description": "Looking for volunteers to help distribute food in the community",
  "location": "Community Center, City",
  "category": "Poverty Alleviation",
  "urgency": "High"  // from constants.js
}
```
#### Response
```json
{
  "helpRequest": {
    "user": {
      "_id": "67dc29624f443c34015bb753",
      "name": "name", 
      "email": "user@example.com",
      "location": "City, Country", 
      "bio": "user bio", 
      "skills": ["skill1", "skill2"], 
      "causesSupport": ["Animal Welfare"]
    },
    "title": "Need volunteers for food distribution",
    "description": "Looking for volunteers to help distribute food in the community",
    "location": "Community Center, City",
    "category": "Poverty Alleviation",
    "urgency": "High" 
    "is_open": true,
    "_id": "67dc2ca94f443c34015bb75f",
    "createdAt": "2025-03-20T14:56:41.527Z",
    "updatedAt": "2025-03-20T14:56:41.527Z",
  }
}
```

### Get Specific Help Requests
**GET** `/request/{requestId}`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Response
```json
{
  "helpRequest": {
    "user": {
      "_id": "67dc29624f443c34015bb753",
      "name": "name", 
    },
    "title": "Need volunteers for food distribution",
    "description": "Looking for volunteers to help distribute food in the community",
    "location": "Community Center, City",
    "category": "Poverty Alleviation",
    "urgency": "High" 
    "is_open": true,
    "_id": "67dc2ca94f443c34015bb75f",
    "createdAt": "2025-03-20T14:56:41.527Z",
    "updatedAt": "2025-03-20T14:56:41.527Z",
  }
}
```

### Get All Help Requests
**GET** `/request`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Response
```json
{
  "helpRequest": [
      { ...helpRequestData }
  ]
}
```

### Close Help Request
**POST** `/request/{requestId}/close`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Response
```json
{
  "msg": "Closed request"
}
```

---
## Comments
### Add Comment to Help Request
**POST** `/comment/{helpRequestId}`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Request Body
```json
{
  "text": "I can help with this!"
}
```
#### Response
```json
{
  "comment": {
    "_id": "67d86444c3a668b611d70c6d",
    "user": {
        "_id": "67cb02a5c2d235b0ade7a9d1",
        "name": "test"
    },
    "helpRequest": "67d59a091a743552e4731da9",
    "text": "I can help with this!"
    "createdAt": "2025-03-17T18:04:52.742Z",
    "updatedAt": "2025-03-17T18:04:52.742Z",
    "__v": 0,
    "likes": 3,
    "has_liked": true
  }
}
```

### Get Comments for a Help Request
**GET** `/comment/{helpRequestId}`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Response
```json
{
  "comments": [
    {...commentData}
  ]
}
```

---
## Likes
### Like a Comment
**POST** `/like/{commentId}`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Response
```json
{
  "msg": "Like added"
}
```

### Unlike a Comment
**DELETE** `/like/{commentId}`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Response
```json
{
  "msg": "Like removed"
}
```

---
## Volunteer Log
### Log Volunteer Hours
**POST** `/event/{eventId}/log-hours`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Request Body
```json
{
  "hours": 5
}
```
#### Response
```json
{
  "id": "logId"
}
```

### Get Verification Requests
**GET** `/event/{eventId}/verifications`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Response
```json
{
    "logs": [
        {
            "_id": "67d9a513272f16a057e33204",
            "user": {
                "_id": "67cb02a5c2d235b0ade7a9d1",
                "name": "test"
            },
            "event": "67d2ff277a5b88efd07162a9",
            "hours": 2,
            "peerVerifications": [
              "67cb02a5c2d235b0ade7a9d1"
            ],
            "createdAt": "2025-03-18T16:53:39.873Z",
            "updatedAt": "2025-03-18T16:53:39.873Z",
            "__v": 0,
            "hasVerified": false
        },
    ]
}
```

### Verify Log
**POST** `/event/{eventId}/verify`
#### Headers
```json
{
  "Authorization": "Bearer jwt_token"
}
```
#### Response
```json
{
    "msg": "Peer Verification successful"
}
```
---





