import express from "express";

const app = express();
const PORT = 3000;

// public
app.use(express.static("public"));

// view engine
app.set("view engine", "ejs");

// routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

// categories route
app.get("/categories", (req, res) => {
  res.render("categories", {
    title: "Service Project Categories",
  });
});

// organizations route
app.get("/organizations", (req, res) => {
  res.render("organizations", { title: "Organizations" });
});

// projects route
app.get("/projects", (req, res) => {
  res.render("projects", { title: "Service Projects" });
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});