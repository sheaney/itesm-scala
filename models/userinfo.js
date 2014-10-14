module.exports = function(sequelize, DataTypes) {
  return sequelize.define("UserInfo", {
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    firstname: {type: DataTypes.STRING, allowNull: false},
    lastname: {type: DataTypes.STRING, allowNull: false}
  });
};

