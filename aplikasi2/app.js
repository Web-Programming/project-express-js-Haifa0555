// app.js
const http = require("http");

// app.js
const express = require("express");
const app = express();
const port = 3000;

// Route GET
app.get("/", (req, res) => {
  res.send("Hello, GET request!");
});

// Middleware untuk parsing body request
app.use(express.json());

// Route POST
app.post("/submit", (req, res) => {
  const { name } = req.body;
  res.send(`Hello, ${name}!`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

//membuat middleware utk mneriuma reqquest body dr json
app.use(express.json());
//membuat route ke halaman submit dg method POST
app.post("submit", (req, res) => {
  const { name } = req.body;
  res.send("Hallo, ${name}!");
});

app.use(express.static("public"));
//Serving Static File
app.use(express.static("public"));
app.listen(prototype, (req, res) => {
  console.log(`Server running at http://localhost:${port}/`);
});
