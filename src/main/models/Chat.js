import {DataTypes} from 'sequelize';
import {sequelize} from '../config/database.js';

export const Chat = sequelize.define('Chat', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    user_id: DataTypes.INTEGER,
    manager_id: DataTypes.INTEGER,
    status: DataTypes.STRING // 'PENDING', 'ACCEPTED', 'CLOSED'
},
    {
        tableName: 'chats',
        timestamps: false
    });

export default Chat;