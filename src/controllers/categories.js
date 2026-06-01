import {
  getAllCategories,
  getCategoryDetails,
  createCategory,
  updateCategory,
  getProjectsForCategory,
  getCategoriesForProject,
  updateCategoryAssignments
} from "../models/categories.js";

import {
  getProjectDetails
} from "../models/projects.js";

/*   Category List Page */

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

/*   Category Details Page   */

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

/*    Create Category  */

const showNewCategoryPage = (
  req,
  res
) => {
  res.render("new-category", {
    title: "Create Category",
    errors: [],
    category: {}
  });
};

const createNewCategory = async (
  req,
  res,
  next
) => {
  try {
    const { name } = req.body;

    const errors = [];

    if (!name || name.trim() === "") {
      errors.push(
        "Category name is required."
      );
    }

    if (
      name &&
      name.trim().length < 3
    ) {
      errors.push(
        "Category name must be at least 3 characters."
      );
    }

    if (
      name &&
      name.trim().length > 100
    ) {
      errors.push(
        "Category name must be 100 characters or less."
      );
    }

    if (errors.length > 0) {
      return res.render(
        "new-category",
        {
          title: "Create Category",
          errors,
          category: { name }
        }
      );
    }

    await createCategory(
      name.trim()
    );

    req.flash(
      "success",
      "Category created successfully!"
    );

    res.redirect("/categories");
  } catch (error) {
    next(error);
  }
};

/*    Edit Category  */

const showEditCategoryPage = async (
  req,
  res,
  next
) => {
  try {
    const category =
      await getCategoryDetails(
        req.params.id
      );

    if (!category) {
      const error =
        new Error("Category not found");

      error.status = 404;

      return next(error);
    }

    res.render("edit-category", {
      title: "Edit Category",
      errors: [],
      category
    });
  } catch (error) {
    next(error);
  }
};

const updateExistingCategory =
  async (req, res, next) => {
    try {
      const categoryId =
        req.params.id;

      const { name } = req.body;

      const errors = [];

      if (
        !name ||
        name.trim() === ""
      ) {
        errors.push(
          "Category name is required."
        );
      }

      if (
        name &&
        name.trim().length < 3
      ) {
        errors.push(
          "Category name must be at least 3 characters."
        );
      }

      if (
        name &&
        name.trim().length > 100
      ) {
        errors.push(
          "Category name must be 100 characters or less."
        );
      }

      if (errors.length > 0) {
        return res.render(
          "edit-category",
          {
            title: "Edit Category",
            errors,
            category: {
              category_id:
                categoryId,
              name
            }
          }
        );
      }

      await updateCategory(
        categoryId,
        name.trim()
      );

      req.flash(
        "success",
        "Category updated successfully!"
      );

      res.redirect(
        "/categories"
      );
    } catch (error) {
      next(error);
    }
  };

// /*   Assign Categories * 
const showAssignCategoriesForm =
  async (req, res, next) => {
    try {
      const projectId =
        req.params.projectId;

      const project =
        await getProjectDetails(
          projectId
        );

      const categories =
        await getAllCategories();

      const assignedCategories =
        await getCategoriesForProject(
          projectId
        );

      res.render(
        "assign-categories",
        {
          title:
            "Assign Categories to Project",
          project,
          categories,
          assignedCategories
        }
      );
    } catch (error) {
      next(error);
    }
  };

const processAssignCategoriesForm =
  async (req, res, next) => {
    try {
      const projectId =
        req.params.projectId;

      const { categoryIds } =
        req.body;

      await updateCategoryAssignments(
        projectId,
        categoryIds
      );

      req.flash(
        "success",
        "Project categories updated successfully!"
      );

      res.redirect(
        `/project/${projectId}`
      );
    } catch (error) {
      next(error);
    }
  };

export {
  showCategoriesPage,
  showCategoryDetailsPage,

  showNewCategoryPage,
  createNewCategory,

  showEditCategoryPage,
  updateExistingCategory,

  showAssignCategoriesForm,
  processAssignCategoriesForm
};