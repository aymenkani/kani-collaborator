const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware to capture every incoming request
app.use((req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    domain: req.headers.host,
    headers: req.headers,
    cookies: req.cookies,
    ip: req.ip,
  };

  // Log the request data to a file
  const logFilePath = path.join(__dirname, 'request_logs.txt');
  const logText = `${logEntry.timestamp} - ${logEntry.method} ${logEntry.url} - Domain: ${logEntry.domain} - IP: ${logEntry.ip} - Headers: ${JSON.stringify(logEntry.headers)} - Cookies: ${JSON.stringify(logEntry.cookies)}\n`;

  // Append the log entry to the file
  fs.appendFile(logFilePath, logText, (err) => {
    if (err) {
      console.error('Error writing log:', err);
    }
  });

  // Continue to the next middleware or route handler
  next();
});

// Serve the request_logs.txt file as a static file (accessible at /logs/request_logs.txt)
app.use('/logs', express.static(path.join(__dirname, '/')));

// Catch-all route to handle any subdomain and log the request
app.get('*', (req, res) => {
  res.status(404).send('Subdomain not found, but the request has been logged.');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
