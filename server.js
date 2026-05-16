import "dotenv/config";
import express from "express";

import { testConnection } from "./src/models/db.js";
import { getAllOrganizations } from "./src/models/organizations.js";
import { getAllCategories } from "./src/models/categories.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Static files
app.use(express.static("public"));

// View engine
app.set("view engine", "ejs");


// HOME PAGE
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home"
  });
});


// CATEGORIES PAGE
app.get("/categories", async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.render("categories", {
      title: "Service Project Categories",
      categories
    });

  } catch (error) {
    console.error("Error loading categories:", error);
    res.status(500).send("Server Error");
  }
});


// ORGANIZATIONS PAGE
app.get("/organizations", async (req, res) => {
  try {
    const organizations = await getAllOrganizations();

    res.render("organizations", {
      title: "Our Partner Organizations",
      organizations
    });

  } catch (error) {
    console.error("Error loading organizations:", error);
    res.status(500).send("Server Error");
  }
});


// PROJECTS PAGE
app.get("/projects", (req, res) => {
  res.render("projects", {
    title: "Service Projects"
  });
});


// START SERVER
app.listen(PORT, async () => {
  try {
    await testConnection();

    console.log(`Server running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);

  } catch (error) {
    console.error("Database connection failed:", error);
  }
});