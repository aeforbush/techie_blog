// this file collects the packaged API routes and prefixes them with the path /api
const router = require("express").Router();

const userRoutes = require('./api/user-routes');
const postRoutes = require('./api/post-routes');
const commentRoutes = require('./api/comment-routes');
const homeRoutes = require("./home-routes");
const apiRoutes = require("./api");
const dashboardRoutes = require("./dashboard-routes");

// taking routes and implementing them to another router instance and prefixing the path with /users
router.use("/", homeRoutes);
router.use("/api", apiRoutes);
router.use("/dashboard", dashboardRoutes);
router.use('/api/users', userRoutes);
router.use('/api/posts', postRoutes);
router.use('/api/comments', commentRoutes);

// this second router.use is a RESTful API practice  indicating a request that doesn't exist
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
