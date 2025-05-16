import sequelize from "../config/database.js";
import {DataTypes} from "sequelize";

export const Message = sequelize.define('Message', {
    chat_id: DataTypes.INTEGER,
    sender_id: DataTypes.INTEGER,
    text: DataTypes.STRING,
    is_from_user: DataTypes.BOOLEAN
},
    {
        tableName: 'messages',
        timestamps: false
    });
export default Message;