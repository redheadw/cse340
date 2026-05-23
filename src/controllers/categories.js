import {
  getAllCategories,
  getCategoryDetails,
  getProjectsForCategory
} from "../models/categories.js";

const showCategoriesPage = async (req, res, next) => {
  try {
    const categories = await getAllCategories();

    res.render("categories", {
      title: "Service Project Categories",
      categories
    });
  } catch (error) {
    next(error);
  }
};

const showCategoryDetailsPage = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const category = await getCategoryDetails(categoryId);

    if (!category) {
      const error = new Error("Category not found");
      error.status = 404;
      return next(error);
    }

    const projects = await getProjectsForCategory(categoryId);

    res.render("category", {
      title: category.name,
      category,
      projects
    });
  } catch (error) {
    next(error);
  }
};

export { showCategoriesPage, showCategoryDetailsPage };