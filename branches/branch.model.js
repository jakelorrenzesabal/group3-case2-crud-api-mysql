const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false },
        manager: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.ENUM('active', 'deactivated'), allowNull: false, defaultValue: 'active'}
    };

    const options = {
        defaultScope: {},
        scopes: {}
    };

    return sequelize.define('Branch', attributes, options);
}


