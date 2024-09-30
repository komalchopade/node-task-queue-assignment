
const express = require('express');
const redis = require('redis');
const rateLimit = require('express-rate-limit');
const Queue = require('bull'); // for queueing system
const fs = require('fs');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// Initialize Express app
const app = express();
const port = 3000;

// Middlewares
app.use(express.json());

// Task queue using Bull and Redis
const taskQueue = new Queue('tasks', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

// Cluster setup
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Worker processes run the Express server

  // Rate limiting middleware (1 task per second, 20 tasks per minute per user)
  const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // limit each user to 20 tasks per minute
    keyGenerator: (req) => req.body.user_id, // rate limit per user ID
  });

  app.post('/task', limiter, async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).send('user_id is required');
    }

    // Add task to the queue
    taskQueue.add({ user_id });

    res.send('Task received');
  });

  // Process queue tasks
  taskQueue.process(async (job) => {
    const { user_id } = job.data;

    // Simulate task completion
    await task(user_id);
  });

  // Task function
  async function task(user_id) {
    const logMessage = `${user_id}-task completed at-${Date.now()}\n`;
    console.log(logMessage);

    // Append to log file
    fs.appendFile('task.log', logMessage, (err) => {
      if (err) throw err;
    });
  }

  // Start server
  app.listen(port, () => {
    console.log(`Worker ${process.pid} started on port ${port}`);
  });
}
