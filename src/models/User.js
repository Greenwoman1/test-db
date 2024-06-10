const { DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../../sequelize'); 

const Product = require('./Product');
class User extends Model { }

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true

        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Last name cannot be empty',
                },
            },
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