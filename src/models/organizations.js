import db from "./db.js";

const getAllOrganizations = async () => {
  const query = `
    SELECT organization_id, name, description, contact_email, logo_filename
    FROM public.organization;
  `;

  const result = await db.query(query);
  return result.rows;
};

const getOrganizationDetails = async (id) => {
  const query = `
    SELECT organization_id, name, description, contact_email, logo_filename
    FROM public.organization
    WHERE organization_id = $1;
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
};

export { getAllOrganizations, getOrganizationDetails };