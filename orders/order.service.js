const db = require('_helpers/db');
const { Sequelize } = require('sequelize');

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    trackOrderStatus,
    processOrder,
    shipOrder,
    deliverOrder
};
async function getAllOrders() {
    return await db.Order.findAll({ where: { orderStatus: ['pendding', 'processed', 'shipped', 'delivered'] } });
}
async function getOrderById(id) {
    return await db.Order.findByPk(id);
}
async function createOrder(params) {
    const order = new db.Order(params);
    await order.save();
    return order;
}
async function updateOrder(id, params) {
    const order = await db.Order.findByPk(id);
    if (!order) throw 'Order not found';
    Object.assign(order, params);
    await order.save();
    return order;
} 
async function trackOrderStatus(id) {
    const order = await db.Order.findByPk(id, { attributes: ['orderStatus'] });
    if (!order) throw 'Order not found';
    return order.orderStatus;
}
async function processOrder(id) {
    const order = await getOrderById(id);
    if (!order) throw 'Order not found';

    if (order.orderStatus === 'processed') throw 'Order is already processed';

    order.orderStatus = 'processed';
    await order.save();
}
async function shipOrder(id) {
    const order = await getOrderById(id);
    if (!order) throw 'Order not found';

    if (order.orderStatus === 'shipped') throw 'Order is already shipped';

    order.orderStatus = 'shipped';
    await order.save();
}
async function deliverOrder(id) {
    const order = await getOrderById(id);
    if (!order) throw 'Order not found';

    if (order.orderStatus === 'delivered') throw 'Order is already delivered';

    order.orderStatus = 'delivered';
    await order.save();
}