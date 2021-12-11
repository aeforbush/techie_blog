const express = require("express");
const path = require("path");
// session
const session = require("express-session");
const controller = require('./controllers');

// sequelize
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// custom console.logs
const chalk = require("chalk");

// handlebars
const exphbs = require("express-handlebars");
const helpers = require("./utils/helpers");

// this connects the session to our Sequelize db
const sess = {
    secret: "Super secret secret",
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
    }),
  };
// handlebars helpers
const hbs = exphbs.create({ helpers });

// initialize the server
const app = express();
const PORT = process.env.PORT || 3008;

// app middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sess));

// turn on routes and use API packages from routes/index.js 
app.use(controller);

// handlebars used as render engine (display html)
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");



// turn on connection to db and server ||  "sync" means that this Sequelize takes the models and connects them to the associatd db tables (creating it for you!)

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(chalk.blue("Now listening!")));
});
