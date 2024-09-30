const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logFile = path.join(__dirname, 'task.log');

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: logFile })
    ]
});

const task = async (user_id) => {
    const timestamp = Date.now();
    const logMessage = `${user_id}-task completed at-${timestamp}`;
    logger.info(logMessage);
    console.log(logMessage);
};

module.exports = { task };
