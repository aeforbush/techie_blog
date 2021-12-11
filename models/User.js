const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

// create User model extends is key word for User to inherit the functionalitu of the model class
// when extending a class from the Sequelize model class, that new class(model) inherits methods for creating, reading, updating and deleting data from the db
class User extends Model {
  // set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    // this. allows us to access this user's properties
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// define table columns and configurations and init() provides context as to how the inherited methods work 
User.init(
  // create and define columns (there are 4 of them)
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
      //unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [5] },
    },
  },
  // add bcrypt hooks to hash the password
  {
    // hooks aka lifecycle events are functions that are called before or after calls in Sequelize
    hooks: {
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      // used when sending an update command
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
        return updatedUserData;
      },
    },
  
    // Table configs options go here
    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: "user",
  }

);

module.exports = User;
