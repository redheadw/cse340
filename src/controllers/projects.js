// Define any controller functions
const showProjectsPage = async (req, res) => {

  const title = "Service Projects";

  res.render("projects", { title });

};

// Export any controller functions
export { showProjectsPage };