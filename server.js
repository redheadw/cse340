import "dotenv/config";

import express from "express";
import { fileURLToPath } from "url";
import path from "path";

import session from "express-session";

import { testConnection } from "./src/models/db.js";
import router from "./src/routes.js";
import flash from "./src/middleware/flash.js";

// Define environment
const NODE_ENV =
  process.env.NODE_ENV?.toLowerCase()
  || "production";

// Define port
const PORT = process.env.PORT || 3000;

// Needed for ES modules
const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const app = express();

// Session secret
const SESSION_SECRET =
  process.env.SESSION_SECRET;

// Parse form data
app.use(
  express.urlencoded({ extended: true })
);

app.use(express.json());

// Static files
app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

// View engine
app.set("view engine", "ejs");

// Views folder
app.set("views", path.join(__dirname, "views"));

// Session middleware
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000
    }
  })
);

// Flash middleware
app.use(flash);

// Request logging
app.use((req, res, next) => {

  if (NODE_ENV === "development") {
    console.log(`${req.method} ${req.url}`);
  }

  next();

});

// Make NODE_ENV available to views
app.use((req, res, next) => {

  res.locals.NODE_ENV = NODE_ENV;

  next();

});

// Routes
app.use(router);

// 404 handler
app.use((req, res, next) => {

  const err = new Error("Page Not Found");

  err.status = 404;

  next(err);

});

// Global error handler
app.use((err, req, res, next) => {

  console.error(
    "Error occurred:",
    err.message
  );

  console.error(
    "Stack trace:",
    err.stack
  );

  const status =
    err.status || 500;

  const template =
    status === 404
      ? "404"
      : "500";

  const context = {
    title:
      status === 404
        ? "Page Not Found"
        : "Server Error",

    error: err.message,
    stack: err.stack
  };

  res
    .status(status)
    .render(`errors/${template}`, context);

});

// Start server
app.listen(PORT, async () => {

  console.log(
    `Server is running at http://127.0.0.1:${PORT}`
  );

  console.log(
    `Environment: ${NODE_ENV}`
  );

  try {

    await testConnection();

    console.log(
      "Database connected successfully"
    );

  } catch (error) {

    console.error(
      "Database connection failed:",
      error.message
    );

  }

});