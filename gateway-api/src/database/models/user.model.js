
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
}, {
  tableName: "users",
  timestamps: false
})};