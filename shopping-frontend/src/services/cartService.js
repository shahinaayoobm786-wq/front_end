import api from "./api";

export const getCart = () => {
    return api.get("/cart");
};

export const addToCartApi = (productId, quantity = 1) => {
    return api.post("/cart/items", { productId, quantity });
};

export const removeFromCartApi = (cartItemId) => {
    return api.delete(`/cart/items/${cartItemId}`);
};
