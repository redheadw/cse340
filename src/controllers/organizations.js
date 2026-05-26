import {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
  updateOrganization
} from "../models/organizations.js";

import { body, validationResult } from "express-validator";

const organizationValidation = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Organization name must be between 3 and 150 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Organization description is required")
    .isLength({ max: 500 })
    .withMessage("Organization description cannot exceed 500 characters"),

  body("contactEmail")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Contact email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")

];

const showOrganizationsPage = async (req, res, next) => {

  try {

    const organizations = await getAllOrganizations();

    res.render("organizations", {
      title: "Our Partner Organizations",
      organizations
    });

  } catch (error) {

    next(error);

  }

};

const showOrganizationDetailsPage = async (req, res, next) => {

  try {

    const organizationId = req.params.id;

    const organization =
      await getOrganizationDetails(organizationId);

    if (!organization) {

      const error = new Error("Organization not found");

      error.status = 404;

      return next(error);

    }

    res.render("organization", {
      title: organization.name,
      organization
    });

  } catch (error) {

    next(error);

  }

};

const showNewOrganizationForm = async (req, res) => {

  res.render("new-organization", {
    title: "Add New Organization"
  });

};

const processNewOrganizationForm = async (req, res) => {

  const results = validationResult(req);

  if (!results.isEmpty()) {

    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect("/new-organization");
  }

  const { name, description, contactEmail } = req.body;

  const logoFilename = "placeholder-logo.png";

  const organizationId = await createOrganization(
    name,
    description,
    contactEmail,
    logoFilename
  );

  req.flash(
    "success",
    "Organization added successfully!"
  );

  res.redirect(`/organization/${organizationId}`);
};

const showEditOrganizationForm = async (req, res, next) => {

  try {

    const organizationId = req.params.id;

    const organizationDetails =
      await getOrganizationDetails(organizationId);

    if (!organizationDetails) {

      const error = new Error("Organization not found");

      error.status = 404;

      return next(error);

    }

    res.render("edit-organization", {
      title: "Edit Organization",
      organizationDetails
    });

  } catch (error) {

    next(error);

  }

};

const processEditOrganizationForm = async (req, res) => {

  const results = validationResult(req);

  const organizationId = req.params.id;

  if (!results.isEmpty()) {

    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect(
      `/edit-organization/${organizationId}`
    );
  }

  const {
    name,
    description,
    contactEmail,
    logoFilename
  } = req.body;

  await updateOrganization(
    organizationId,
    name,
    description,
    contactEmail,
    logoFilename
  );

  req.flash(
    "success",
    "Organization updated successfully!"
  );

  res.redirect(`/organization/${organizationId}`);
};

export {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
  organizationValidation
};