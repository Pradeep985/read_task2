const fs = require("fs");
const http = require("http");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.setHeader("Content-Type", "text/html");

    // Read the content from formValues.txt and display it
    fs.readFile('formValues.txt', 'utf8', (err, data) => {
      let message = '';
      if (!err) {
        message = `<p>Stored Name: ${data}</p>`;
      }

      // Send the form along with the stored data
      res.end(`
        ${message}
        <form action="/message" method="POST">
          <label>Name:</label>
          <input type="text" name="username"></input>
          <button type="submit">Add</button>
        </form>
      `);
    });

  } else if (url === "/message" && method === "POST") {
    let body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      let buffer = Buffer.concat(body);
      let formData = buffer.toString();
      const formValues = formData.split('=')[1];

      fs.writeFile('formValues.txt', formValues, (err) => {
        res.statusCode = 302; 
        res.setHeader('Location', '/');
        res.end();
      });
    });

  }
});

server.listen(3001);
