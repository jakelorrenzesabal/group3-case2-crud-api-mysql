const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    
    await connection.end();

    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    db.User = require('../users/user.model')(sequelize);
    db.ActivityLog = require('../models/activitylog.model')(sequelize);

    db.Branch = require('../branches/branch.model')(sequelize);   
    db.Branch.hasMany(db.User, { foreignKey: 'branchId' });
    db.User.belongsTo(db.Branch, { foreignKey: 'branchId' });

    await sequelize.sync({ alter: true });
}