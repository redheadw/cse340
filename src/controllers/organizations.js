import { getAllOrganizations, getOrganizationDetails } from "../models/organizations.js";

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
    const organization = await getOrganizationDetails(organizationId);

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

export { showOrganizationsPage, showOrganizationDetailsPage };