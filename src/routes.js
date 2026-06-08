import express from "express";

import { showHomePage } from "./controllers/index.js";

import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
  organizationValidation
} from "./controllers/organizations.js";

import {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation
} from "./controllers/projects.js";

import {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryPage,
  createNewCategory,
  showEditCategoryPage,
  updateExistingCategory,
  showAssignCategoriesForm,
  processAssignCategoriesForm
} from "./controllers/categories.js";

import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  showDashboard,
  requireRole,
  showUsersPage,
  volunteerForProject,
  removeVolunteerFromProject  
} from "./controllers/users.js";

import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

/* Home */

router.get("/", showHomePage);

/* Organizations */

router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);

router.get(
  "/new-organization",
  requireRole("admin"),
  showNewOrganizationForm
);

router.post(
  "/new-organization",
  requireRole("admin"),
  organizationValidation,
  processNewOrganizationForm
);

router.get(
  "/edit-organization/:id",
  requireRole("admin"),
  showEditOrganizationForm
);

router.post(
  "/edit-organization/:id",
  requireRole("admin"),
  organizationValidation,
  processEditOrganizationForm
);

/* Projects */

router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);

router.get(
  "/new-project",
  requireRole("admin"),
  showNewProjectForm
);

router.post(
  "/new-project",
  requireRole("admin"),
  projectValidation,
  processNewProjectForm
);

router.get(
  "/edit-project/:id",
  requireRole("admin"),
  showEditProjectForm
);

router.post(
  "/edit-project/:id",
  requireRole("admin"),
  projectValidation,
  processEditProjectForm
);

/* Categories */

router.get("/categories", showCategoriesPage);
router.get("/category/:id", showCategoryDetailsPage);

router.get(
  "/new-category",
  requireRole("admin"),
  showNewCategoryPage
);

router.post(
  "/new-category",
  requireRole("admin"),
  createNewCategory
);

router.get(
  "/edit-category/:id",
  requireRole("admin"),
  showEditCategoryPage
);

router.post(
  "/edit-category/:id",
  requireRole("admin"),
  updateExistingCategory
);

/* Project Category Assignment */

router.get(
  "/project/:projectId/assign-categories",
  requireRole("admin"),
  showAssignCategoriesForm
);

router.post(
  "/project/:projectId/assign-categories",
  requireRole("admin"),
  processAssignCategoriesForm
);

/* User Registration */

router.get("/register", showUserRegistrationForm);
router.post("/register", processUserRegistrationForm);

/* User Login */

router.get("/login", showLoginForm);
router.post("/login", processLoginForm);

router.get("/logout", processLogout);

router.get(
  "/dashboard",
  requireLogin,
  showDashboard
);

router.get("/users", requireRole("admin"), showUsersPage);

router.get("/project/:id/volunteer", requireLogin, volunteerForProject);
router.get("/project/:id/remove-volunteer", requireLogin, removeVolunteerFromProject);

/* Error Testing */

router.get("/test-error", testErrorPage);

export default router;