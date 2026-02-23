const Sequelize = require("sequelize");
const config = require("../config");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const db = {};


db.User = require("./user.model")(sequelize, Sequelize.DataTypes);
db.Conversation = require("./conversation.model")(sequelize, Sequelize.DataTypes);
db.Message = require("./message.model")(sequelize, Sequelize.DataTypes);



db.User.hasMany(db.Conversation, {
  foreignKey: "user_id",
  onDelete: "CASCADE"
});

db.Conversation.belongsTo(db.User, {
  foreignKey: "user_id"
});

db.Conversation.hasMany(db.Message, {
  foreignKey: "conversation_id",
  onDelete: "CASCADE"
});

db.Message.belongsTo(db.Conversation, {
  foreignKey: "conversation_id"
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;