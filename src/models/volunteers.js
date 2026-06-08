import db from "./db.js";

const addVolunteer = async (projectId, userId) => {
  const query = `
    INSERT INTO public.project_volunteers
    (project_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
  `;

  await db.query(query, [projectId, userId]);
};

const removeVolunteer = async (projectId, userId) => {
  const query = `
    DELETE FROM public.project_volunteers
    WHERE project_id = $1
      AND user_id = $2;
  `;

  await db.query(query, [projectId, userId]);
};

const isUserVolunteering = async (projectId, userId) => {
  const query = `
    SELECT project_id, user_id
    FROM public.project_volunteers
    WHERE project_id = $1
      AND user_id = $2;
  `;

  const result = await db.query(query, [projectId, userId]);
  return result.rows.length > 0;
};

const getVolunteerProjectsForUser = async (userId) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.date,
      p.location
    FROM public.projects p
    JOIN public.project_volunteers pv
      ON p.project_id = pv.project_id
    WHERE pv.user_id = $1
    ORDER BY p.date ASC;
  `;

  const result = await db.query(query, [userId]);
  return result.rows;
};

export {
  addVolunteer,
  removeVolunteer,
  isUserVolunteering,
  getVolunteerProjectsForUser
};