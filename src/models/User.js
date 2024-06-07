const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../sequelize'); // Pobrini se da je putanja tačna

class User extends Model {}

User.init(
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'User',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updateTimestamp',
    },
);

module.exports = User;