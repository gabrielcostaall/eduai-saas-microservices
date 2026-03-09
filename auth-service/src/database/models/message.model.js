
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: "success"
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "messages",
  timestamps: false
})};
