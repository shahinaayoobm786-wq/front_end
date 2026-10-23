import api from "./api";

export const checkoutOrder = (checkoutData) => {
    return api.post("/orders/checkout", checkoutData);
};

export const getMyOrders = () => {
    return api.get("/orders/my-orders");
};

export const getAllOrders = () => {
    return api.get("/orders");
};

export const updateOrderStatus = (orderId, status) => {
    return api.put(`/orders/${orderId}/status?status=${status}`);
};
