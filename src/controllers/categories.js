import {
  getAllCategories,
  getCategoryDetails,
  getProjectsForCategory,
  getCategoriesForProject,
  updateCategoryAssignments
} from "../models/categories.js";

import {
  getProjectDetails
} from "../models/projects.js";

const showCategoriesPage = async (
  req,
  res,
  next
) => {

  try {

    const categories =
      await getAllCategories();

    res.render("categories", {
      title: "Service Project Categories",
      categories
    });

  } catch (error) {

    next(error);

  }

};

const showCategoryDetailsPage = async (
  req,
  res,
  next
) => {

  try {

    const categoryId = req.params.id;

    const category =
      await getCategoryDetails(categoryId);

    if (!category) {

      const error =
        new Error("Category not found");

      error.status = 404;

      return next(error);

    }

    const projects =
      await getProjectsForCategory(categoryId);

    res.render("category", {
      title: category.name,
      category,
      projects
    });

  } catch (error) {

    next(error);

  }

};

const showAssignCategoriesForm = async (
  req,
  res,
  next
) => {

  try {

    const projectId =
      req.params.projectId;

    const project =
      await getProjectDetails(projectId);

    const categories =
      await getAllCategories();

    const assignedCategories =
      await getCategoriesForProject(projectId);

    res.render("assign-categories", {
      title: "Assign Categories to Project",
      project,
      categories,
      assignedCategories
    });

  } catch (error) {

    next(error);

  }

};

const processAssignCategoriesForm = async (
  req,
  res
) => {

  const projectId =
    req.params.projectId;

  const { categoryIds } = req.body;

  await updateCategoryAssignments(
    projectId,
    categoryIds
  );

  req.flash(
    "success",
    "Project categories updated successfully!"
  );

  res.redirect(`/project/${projectId}`);
};

export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm
};