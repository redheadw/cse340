import db from "./db.js";

const getAllCategories = async () => {
  const query = `
    SELECT category_id, name
    FROM public.categories
    ORDER BY name;
  `;

  const result = await db.query(query);
  return result.rows;
};

const getCategoryDetails = async (id) => {
  const query = `
    SELECT category_id, name
    FROM public.categories
    WHERE category_id = $1;
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
};

const getCategoriesForProject = async (projectId) => {
  const query = `
    SELECT c.category_id, c.name
    FROM public.categories c
    JOIN public.project_categories pc
      ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.name;
  `;

  const result = await db.query(query, [projectId]);
  return result.rows;
};

const getProjectsForCategory = async (categoryId) => {
  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.date,
      p.location,
      p.organization_id
    FROM public.projects p
    JOIN public.project_categories pc
      ON p.project_id = pc.project_id
    WHERE pc.category_id = $1
    ORDER BY p.date ASC;
  `;

  const result = await db.query(query, [categoryId]);
  return result.rows;
};

const assignCategoryToProject = async (
  projectId,
  categoryId
) => {

  const query = `
    INSERT INTO project_categories
    (
      project_id,
      category_id
    )
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
  `;

  await db.query(query, [
    projectId,
    categoryId
  ]);
};

const updateCategoryAssignments = async (
  projectId,
  categoryIds
) => {

  const deleteQuery = `
    DELETE FROM project_categories
    WHERE project_id = $1;
  `;

  await db.query(deleteQuery, [projectId]);

  if (!categoryIds) {
    return;
  }

  const categoryArray = Array.isArray(categoryIds)
    ? categoryIds
    : [categoryIds];

  for (const categoryId of categoryArray) {

    await assignCategoryToProject(
      projectId,
      categoryId
    );

  }
};

export {
  getAllCategories,
  getCategoryDetails,
  getCategoriesForProject,
  getProjectsForCategory,
  updateCategoryAssignments
};