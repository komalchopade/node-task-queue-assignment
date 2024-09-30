const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
    console.error('Redis error:', err);
});

const addToQueue = (userId, task) => {
    client.rpush(`queue:${userId}`, JSON.stringify(task));
};

const processQueue = async (userId, processTask) => {
    const task = await new Promise((resolve, reject) => {
        client.lpop(`queue:${userId}`, (err, reply) => {
            if (err) reject(err);
            else resolve(JSON.parse(reply));
        });
    });

    if (task) {
        await processTask(task.user_id);
    }
};

module.exports = { addToQueue, processQueue };
