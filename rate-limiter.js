const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
    points: 20, // 20 requests
    duration: 60, // Per 60 seconds (1 minute)
    blockDuration: 1, // Block for 1 second after limit is reached
});

const limitTask = async (userId) => {
    try {
        await rateLimiter.consume(userId);
        return true;
    } catch (rejRes) {
        return false; // Rate limit exceeded
    }
};

module.exports = { limitTask };
