import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    lastName: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'users',
});

// Static method to check if email is already taken
User.isEmailTaken = async function(email) {
    const user = await this.findOne({ where: { email } });
    return !!user; // Convert to boolean: true if user exists, false if not
  };
  

export default User;