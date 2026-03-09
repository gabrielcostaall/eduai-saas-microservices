
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Conversation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "conversations",
  timestamps: false
})};