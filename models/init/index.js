import IndividualStorage from "../IndividualStorage.js";
import CloudStorage from "../CloudStorage.js";
import Price from "../Price.js";
import OrderStatus from "../OrderStatus.js";
import Order from "../Order.js";
import OrderType from "../OrderType.js";
import User from "../User.js";
import ItemCategory from "../ItemCategory.js";
import CloudItem from "../CloudItem.js";
import Transaction from "../Transaction.js";
import MovingOrder from "../MovingOrder.js";
import OrderItem from "../OrderItem.js";
import UserRole from "../UserRole.js";
import Callback from "../Callback.js";
import WarehouseStatus from "../WarehouseStatus.js";
import Warehouse from "../Warehouse.js";
import PriceType from "../PriceType.js";
import StorageType from "../StorageType.js";
import OrderItemType from "../OrderItemType.js";
import PaymentSystem from "../PaymentSystem.js";
import FAQ from "../Faq.js";
import FAQCategory from "../FaqCategory.js";
import TransactionStatus from "../TransactionStatus.js";
import Contract from "../Contract.js";
import Notification from "../Notification.js";

User.belongsTo(UserRole, { foreignKey: 'role_code' });
User.hasMany(Order);
User.hasMany(IndividualStorage);
User.hasMany(CloudStorage);
User.hasMany(Callback);
User.hasMany(Notification);
Warehouse.belongsTo(WarehouseStatus, { foreignKey: 'status_code' });
Warehouse.hasMany(IndividualStorage);
Warehouse.hasMany(CloudStorage);
User.hasMany(Contract);

StorageType.hasMany(Price);
StorageType.hasMany(IndividualStorage);
StorageType.hasMany(CloudStorage);

Price.belongsTo(PriceType, { foreignKey: 'price_type_code' });
Price.hasMany(OrderItem);

CloudStorage.belongsTo(User);
CloudStorage.belongsTo(Warehouse);
CloudStorage.hasMany(CloudItem);

CloudItem.belongsTo(CloudStorage, { foreignKey: 'storage_id' });
CloudItem.belongsTo(ItemCategory, { foreignKey: 'category_code' });

Order.belongsTo(User);
Order.belongsTo(OrderType, { foreignKey: 'order_type_code' });
Order.belongsTo(OrderStatus, { foreignKey: 'status_code' });
Order.hasMany(OrderItem);
Order.hasMany(Transaction);
Order.hasOne(MovingOrder);
Order.hasMany(Notification);
Order.hasMany(Contract);

OrderItem.belongsTo(Order);
OrderItem.belongsTo(Price);
OrderItem.belongsTo(OrderItemType, { foreignKey: 'item_type_code' });

PaymentSystem.hasMany(Transaction);
Transaction.belongsTo(PaymentSystem);
Transaction.belongsTo(Order);
Transaction.belongsTo(TransactionStatus, { foreignKey: 'status_code' });

MovingOrder.belongsTo(Order);
Contract.belongsTo(User, { foreignKey: 'user_id' });
Contract.belongsTo(Order, { foreignKey: 'order_id' });
FAQ.belongsTo(FAQCategory, { foreignKey: 'category_code' });
Notification.belongsTo(User, { foreignKey: 'user_id' });
Notification.belongsTo(Order, { foreignKey: 'related_order_id' });