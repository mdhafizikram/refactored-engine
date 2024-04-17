const express = require("express");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();
const port = 5000;

app.use(express.json());

// GET all posts
app.get("/posts", async (req, res, next) => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
});

// GET a single post
app.get("/posts/:id", async (req, res, next) => {
  try {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${req.params.id}`
    );
    if (response.data) {
      res.status(200).json(response.data);
    } else {
      next({
        response: {
          status: 404,
          statusText: "Post not found",
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

// POST a new post
app.post("/posts", async (req, res, next) => {
  try {
    const response = await axios.post(
      "https://jsonplaceholder.typicode.com/posts",
      req.body
    );
    res.status(201).json(response.data);
  } catch (error) {
    next(error);
  }
});

// PUT/UPDATE an existing post
app.put("/posts/:id", async (req, res, next) => {
  try {
    const response = await axios.put(
      `https://jsonplaceholder.typicode.com/posts/${req.params.id}`,
      req.body
    );
    if (response.data) {
      res.status(200).json(response.data);
    } else {
      next({
        response: {
          status: 404,
          statusText: "Post not found",
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE a post
app.delete("/posts/:id", async (req, res, next) => {
  try {
    const response = await axios.delete(
      `https://jsonplaceholder.typicode.com/posts/${req.params.id}`
    );
    if (response.data) {
      res.status(200).json(response.data);
    } else {
      next({
        response: {
          status: 404,
          statusText: "Post not found",
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.response) {
    res.status(err.response.status).json({ error: err.response.statusText });
  } else {
    res.status(500).json({ error: "Internal server error" });
  }
});
// Catch-all route handler
app.use((req, res) => {
  console.log("route not found");
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
