import 'dotenv/config';
import express from "express";
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';

const app = express();
const PORT = process.env.PORT || 3000;

// public
app.use(express.static("public"));

// view engine
app.set("view engine", "ejs");

// routes
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// categories route
app.get("/categories", (req, res) => {
  res.render("categories", {
    title: "Service Project Categories",
  });
});

// organizations route
app.get("/organizations", async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = "Our Partner Organizations";

  res.render("organizations", { title, organizations });
});

// projects route
app.get("/projects", (req, res) => {
  res.render("projects", { title: "Service Projects" });
});

// start server
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});