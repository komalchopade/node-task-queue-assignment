# node-task-queue-assignment
# Node.js Task Queue with Rate Limiting and Redis

This project demonstrates a Node.js application that implements task queuing with rate limiting using `Bull`, `Redis`, `cluster`, and `rate-limiter-flexible`. The system is designed to handle user-specific tasks with the following constraints:
- Each user can perform only 1 task per second.
- Users can perform up to 20 tasks per minute.

## Table of Contents
1. [Features](#features)
2. [Requirements](#requirements)
3. [Project Structure](#project-structure)
4. [Setup and Installation](#setup-and-installation)
5. [How to Run](#how-to-run)
6. [Testing the API](#testing-the-api)
7. [API Endpoints](#api-endpoints)
8. [How the Queue Works](#how-the-queue-works)
9. [Technologies Used](#technologies-used)

## Features
- Rate Limiting: Limits the number of tasks a user can submit per second and per minute.
- Task Queuing: Uses Redis to queue tasks when the rate limit is exceeded.
- Cluster Setup: Creates worker processes to distribute task handling across CPU cores.
- Logging: Logs task completions in a file.

## Requirements
- [Node.js](https://nodejs.org/) (version 12+)
- [Redis](https://redis.io/download) (installed and running)
- NPM (comes with Node.js)

## Project Structure
```bash
node-task-queue/
├── queue.js           # Handles task queuing using Redis
├── rate-limiter.js    # Implements rate-limiting logic
├── server.js          # Main Express application with clustering and API routes
├── task.js            # Handles task execution and logging
├── task.log           # Task log file (created during runtime)
└── package.json       # NPM dependencies and scripts

## Setup and Installation

Install the dependencies:

npm install

Make sure Redis is installed and running. You can start the Redis server using:
redis-server
How to Run
Start the application:

node server.js
The server should now be running on http://localhost:3000.
Testing the API
You can test the /task API endpoint using Postman, curl, or any HTTP client.

URL: POST http://localhost:3000/task
{
  "user_id": "123"
}
API Endpoints
POST /task
Description: Adds a task for a specific user. The task is either processed immediately (if under the rate limit) or added to the queue for later processing.
{
  "user_id": "123"
}
Response: Task received
## How the Queue Works
Rate Limiting: The app uses the rate-limiter-flexible package to ensure each user is limited to 1 task per second and 20 tasks per minute.
Queueing: If a user's task exceeds the rate limit, the task is added to a Redis queue. The queued tasks are processed once the user’s rate limit allows it.
Task Processing: Tasks are logged to task.log when they are completed, using the winston logging library.
## Technologies Used
Node.js: Backend runtime for building the task queue system.
Express: Web framework for handling HTTP requests.
Bull: A Redis-based task queue.
Redis: In-memory data store used to handle the queue.
rate-limiter-flexible: Package for handling rate limiting per user.
Cluster: To create worker processes and distribute tasks across CPU cores.
Winston: Logging utility for writing logs to a file.
