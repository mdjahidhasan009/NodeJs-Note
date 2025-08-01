import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';


const UserDetails = sequelize.define('UserDetails', {
  // Model attributes are defined here
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  mobNumber:{
    type: DataTypes.INTEGER
  }
}, {
  // Other model options go here
  freezeTableName: true
});

export default UserDetails;