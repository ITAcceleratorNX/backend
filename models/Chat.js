// models/Chat.js
import {DataTypes} from 'sequelize';
import sequelize from '../config/database.js';

export const Chat = sequelize.define('Chat', {
    user_id: DataTypes.INTEGER,
    manager_id: DataTypes.INTEGER,
    status: DataTypes.STRING // 'PENDING', 'ACCEPTED', 'CLOSED'
},
    {
        tableName: 'chats',
        timestamps: false
    });

export default Chat;