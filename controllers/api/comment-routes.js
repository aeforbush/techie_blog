const router = require("express").Router();
const { Comment, User } = require("../../models");
const chalk = require("chalk");
const withAuth = require('../../utils/auth');


// get all comments
router.get("/", (req, res) => {
  Comment.findAll()
    .then((dbCommentData) => res.json(dbCommentData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get comment by id
router.get("/:id", (req, res) => {
  Comment.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "comment_text", "user_id", "post_id"],
    inlcude: [
      {
        model: User,
        as: "user",
        attributes: ["email"],
      },
    ],
  })
    .then((dbCommentData) => {
      if (!dbCommentData) {
        res.status(400).json({ message: "No comment found with this id" });
        return;
      }
      res.json(dbCommentData);
    })
    .catch((err) => {
      console.log(chalk.greenBright(err));
      res.status(500).json(err);
    });
});

// add comment
router.post("/", withAuth, (req, res) => {
  if(req.session) {
  // { comment_text, user_id, post_id }
  Comment.create({
    comment_text: req.body.comment_text,
    user_id: req.session.user_id,
    post_id: req.body.post_id,
  })
    .then((dbCommentData) => {
      res.json(dbCommentData);
    })
    .catch((err) => {
      console.log(chalk.greenBright(err));
      res.status(500).json(err);
    });
  }
});

// update a comment
router.put("/:id", withAuth, (req, res) => {
  Comment.update(
    {
      comment_text: req.body.comment_text,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbCommentData) => {
      if (!dbCommentData) {
        res.status(404).json({ message: "No comment found with this id" });
        return;
      }
      res.json(dbCommentData);
    })
    .catch((err) => {
      console.log(chalk.greenBright(err));
      res.status(500).json(err);
    });
});

// remove comment
router.delete('/:id', withAuth, (req, res) => {
  Comment.destroy({
      where: {
          id: req.params.id
      }
  }).then(dbCommentData => {
      if (!dbCommentData) {
          res.status(404).json({ message: 'No comment found with this id' });
          return;
      }
      res.json(dbCommentData);
  }).catch(err => {
      console.log(err);
      res.status(500).json(err);
  });
});

module.exports = router;
