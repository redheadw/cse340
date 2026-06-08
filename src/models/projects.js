import db from "./db.js";

const getUpcomingProjects = async (numberOfProjects) => {

  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.date,
      p.location,
      p.organization_id,
      o.name AS organization_name
    FROM public.projects p
    JOIN public.organization o
      ON p.organization_id = o.organization_id
    WHERE p.date >= CURRENT_DATE
    ORDER BY p.date ASC
    LIMIT $1;
  `;

  const result =
    await db.query(query, [numberOfProjects]);

  return result.rows;
};

const getProjectDetails = async (id) => {

  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.date,
      p.location,
      p.organization_id,
      o.name AS organization_name
    FROM public.projects p
    JOIN public.organization o
      ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;
  `;

  const result =
    await db.query(query, [id]);

  return result.rows[0];
};

const createProject = async (
  title,
  description,
  location,
  date,
  organizationId
) => {

  const query = `
    INSERT INTO projects
    (
      title,
      description,
      location,
      date,
      organization_id
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;

  const queryParams = [
    title,
    description,
    location,
    date,
    organizationId
  ];

  const result =
    await db.query(query, queryParams);

  return result.rows[0].project_id;
};

const updateProject = async (
  id,
  title,
  description,
  location,
  date,
  organizationId
) => {
  const query = `
    UPDATE public.projects
    SET
      title = $1,
      description = $2,
      location = $3,
      date = $4,
      organization_id = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

  const result = await db.query(query, [
    title,
    description,
    location,
    date,
    organizationId,
    id
  ]);

  if (result.rows.length === 0) {
    throw new Error("Failed to update project");
  }

  return result.rows[0].project_id;
};

export {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  volunteerForProject,
  removeVolunteerFromProject,
  projectValidation
};