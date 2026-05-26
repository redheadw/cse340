import {
  getUpcomingProjects,
  getProjectDetails,
  createProject
} from "../models/projects.js";

import { getAllOrganizations }
  from "../models/organizations.js";

import {
  body,
  validationResult
} from "express-validator";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage(
      "Project title must be between 3 and 200 characters"
    ),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage(
      "Description cannot exceed 1000 characters"
    ),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ max: 200 })
    .withMessage(
      "Location cannot exceed 200 characters"
    ),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isDate()
    .withMessage("Please enter a valid date"),

  body("organizationId")
    .notEmpty()
    .withMessage("Organization is required")
    .isInt()
    .withMessage("Organization must be valid")

];

const showProjectsPage = async (
  req,
  res,
  next
) => {

  try {

    const projects =
      await getUpcomingProjects(
        NUMBER_OF_UPCOMING_PROJECTS
      );

    res.render("projects", {
      title: "Upcoming Service Projects",
      projects
    });

  } catch (error) {

    next(error);

  }

};

const showProjectDetailsPage = async (
  req,
  res,
  next
) => {

  try {

    const projectId = req.params.id;

    const project =
      await getProjectDetails(projectId);

    if (!project) {

      const error =
        new Error("Project not found");

      error.status = 404;

      return next(error);

    }

    res.render("project", {
      title: project.title,
      project
    });

  } catch (error) {

    next(error);

  }

};

const showNewProjectForm = async (
  req,
  res,
  next
) => {

  try {

    const organizations =
      await getAllOrganizations();

    res.render("new-project", {
      title: "Add New Project",
      organizations
    });

  } catch (error) {

    next(error);

  }

};

const processNewProjectForm = async (
  req,
  res
) => {

  const results = validationResult(req);

  if (!results.isEmpty()) {

    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect("/new-project");
  }

  const {
    organizationId,
    title,
    description,
    location,
    date
  } = req.body;

  await createProject(
    title,
    description,
    location,
    date,
    organizationId
  );

  req.flash(
    "success",
    "Project added successfully!"
  );

  res.redirect("/projects");
};

export {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation
};