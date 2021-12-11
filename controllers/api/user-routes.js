// creating CRUD operation routes that work with the User model
const router = require("express").Router();
const { User } = require("../../models");
const chalk = require("chalk");

// GET/api/users
router.get("/", (req, res) => {
  // findAll is one of the model class methods
  // querying all of the users from the user table in the db || SELECT * FROM
  User.findAll({
    attributes: { exclude: ["password"] },
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(chalk.blue(err));
    });
});

// GET/api/users/1
router.get("/:id", (req, res) => {
  User.findOne({
    attributes: { exclude: ["password"] },
    // where option = SELECT * FROM users WHERE id = 1
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        // 404 = wrong piece of data looked for
        res.status(404).json({ message: "no user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(chalk.blue(err));
      res.status(500).json(err);
    });
});

// POST/api/users
router.post("/", (req, res) => {
  // expects { email and password }
  User.create({
    // passsing in key/value, values comes from req.body
    email: req.body.email,
    password: req.body.password,
  })
    .then((dbUserData) => {
      // wrapping variables in a callback to ensure the sess was created
      req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.loggedIn = true;

      res.json(dbUserData);
    })
    })
    .catch((err) => {
      console.log(chalk.blue(err));
      // 500 = internal server error
      res.status(500).json(err);
    });
});

// POST/api/users
router.post("/login", (req, res) => {
  console.log(chalk.blue("request received"));
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((dbUserData) => {
    if (!dbUserData) {
      res
        .status(400)
        .json({ message: "No user found with that email address" });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password! '});
      return;
    }

    req.session.save(() => {
      // declare session varibles
      req.session.user_id = dbUserData.id;
      req.session.loggedIn = true;
    })
    res.json({ user: dbUserData, message: "You are logged in!" });
  });
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    })
  } else {
    res.status(404).end();
  }
})

// PUT/api/users/1
router.put("/:id", (req, res) => {
  // SQL funcs = UPDATE, SET, WHERE
  // expects {email and password} and combines parameters for creating data and looking up data
  // // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead which passes in the data
  User.update(req.body, {
    individualHooks: true,
    where: {
      // indicates where exactly the new data is to be used
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(chalk.blue(err));
    });
});

// DELETE/api/users/1
router.delete("/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(chalk.blue(err));
      res.status(500).json(err);
    });
});

module.exports = router;
