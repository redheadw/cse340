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

const getCategoryDetails = async (categoryId) => {
  const query = `
    SELECT category_id, name
    FROM public.categories
    WHERE category_id = $1;
  `;

  const result = await db.query(query, [categoryId]);
  return result.rows[0];
};

const createCategory = async (name) => {
  const query = `
    INSERT INTO public.categories (name)
    VALUES ($1)
    RETURNING category_id, name;
  `;

  const result = await db.query(query, [name]);
  return result.rows[0];
};

const updateCategory = async (categoryId, name) => {
  const query = `
    UPDATE public.categories
    SET name = $1
    WHERE category_id = $2
    RETURNING category_id, name;
  `;

  const result = await db.query(query, [name, categoryId]);
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

const assignCategoryToProject = async (projectId, categoryId) => {
  const query = `
    INSERT INTO public.project_categories (project_id, category_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
  `;

  await db.query(query, [projectId, categoryId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
  const deleteQuery = `
    DELETE FROM public.project_categories
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
    await assignCategoryToProject(projectId, categoryId);
  }
};

export {
  getAllCategories,
  getCategoryDetails,
  createCategory,
  updateCategory,
  getCategoriesForProject,
  getProjectsForCategory,
  updateCategoryAssignments
};