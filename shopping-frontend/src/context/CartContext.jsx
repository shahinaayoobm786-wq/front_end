import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { getCart, addToCartApi, removeFromCartApi } from "../services/cartService";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const { isAuthenticated } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem("guest_cart");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [loading, setLoading] = useState(false);

    // Sync from backend when authenticated (and upload any guest items)
    const syncAndFetchBackendCart = async () => {
        if (!isAuthenticated) return;
        try {
            setLoading(true);

            // 1. Sync guest cart items to backend if any exist
            let guestItems = [];
            try {
                const saved = localStorage.getItem("guest_cart");
                guestItems = saved ? JSON.parse(saved) : [];
            } catch {
                guestItems = [];
            }

            if (guestItems.length > 0) {
                for (const gItem of guestItems) {
                    try {
                        await addToCartApi(gItem.id, gItem.quantity || 1);
                    } catch (e) {
                        console.error("Failed to sync guest cart item:", gItem, e);
                    }
                }
                localStorage.removeItem("guest_cart");
            }

            // 2. Fetch fresh cart from backend
            const res = await getCart();
            const normalized = (res.data || []).map((item) => ({
                id: item.product.id,
                cartItemId: item.id,
                name: item.product.name,
                price: Number(item.product.price),
                imageUrl: item.product.imageUrl,
                category: item.product.category,
                stockQuantity: item.product.stockQuantity,
                quantity: item.quantity
            }));
            setCartItems(normalized);
        } catch (err) {
            console.error("Failed to fetch backend cart:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            syncAndFetchBackendCart();
        }
    }, [isAuthenticated]);

    // Save to localStorage when guest
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem("guest_cart", JSON.stringify(cartItems));
        }
    }, [cartItems, isAuthenticated]);

    const addToCart = async (product, quantity = 1) => {
        const qty = Number(quantity) || 1;

        if (isAuthenticated) {
            try {
                const existing = cartItems.find((item) => item.id === product.id);
                const newQuantity = existing ? existing.quantity + qty : qty;
                await addToCartApi(product.id, newQuantity);
                await syncAndFetchBackendCart();
                return;
            } catch (err) {
                console.error("Failed to add to cart via API:", err);
            }
        }

        // Local state fallback / guest cart
        setCartItems((prevItems) => {
            const existing = prevItems.find((item) => item.id === product.id);
            let updated;
            if (existing) {
                updated = prevItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            } else {
                updated = [
                    ...prevItems,
                    {
                        id: product.id,
                        cartItemId: Date.now(),
                        name: product.name,
                        price: Number(product.price),
                        imageUrl: product.imageUrl,
                        category: product.category,
                        stockQuantity: product.stockQuantity,
                        quantity: qty
                    }
                ];
            }
            localStorage.setItem("guest_cart", JSON.stringify(updated));
            return updated;
        });
    };

    const removeFromCart = async (productId) => {
        const itemToRemove = cartItems.find((item) => item.id === productId);

        if (isAuthenticated && itemToRemove && itemToRemove.cartItemId) {
            try {
                await removeFromCartApi(itemToRemove.cartItemId);
                await syncAndFetchBackendCart();
                return;
            } catch (err) {
                console.error("Failed to remove cart item from backend:", err);
            }
        }

        setCartItems((prev) => {
            const updated = prev.filter((item) => item.id !== productId);
            if (!isAuthenticated) {
                localStorage.setItem("guest_cart", JSON.stringify(updated));
            }
            return updated;
        });
    };

    const increaseQuantity = async (productId) => {
        const item = cartItems.find((i) => i.id === productId);
        if (!item) return;

        if (item.stockQuantity !== undefined && item.quantity >= item.stockQuantity) {
            alert(`Cannot add more. Only ${item.stockQuantity} items in stock.`);
            return;
        }

        const newQty = item.quantity + 1;
        if (isAuthenticated && item.cartItemId) {
            try {
                await addToCartApi(productId, newQty);
                await syncAndFetchBackendCart();
                return;
            } catch (err) {
                console.error("Failed to update cart quantity on backend:", err);
            }
        }

        setCartItems((prev) => {
            const updated = prev.map((i) =>
                i.id === productId ? { ...i, quantity: newQty } : i
            );
            if (!isAuthenticated) {
                localStorage.setItem("guest_cart", JSON.stringify(updated));
            }
            return updated;
        });
    };

    const decreaseQuantity = async (productId) => {
        const item = cartItems.find((i) => i.id === productId);
        if (!item) return;

        const newQty = item.quantity - 1;
        if (newQty <= 0) {
            await removeFromCart(productId);
            return;
        }

        if (isAuthenticated && item.cartItemId) {
            try {
                await addToCartApi(productId, newQty);
                await syncAndFetchBackendCart();
                return;
            } catch (err) {
                console.error("Failed to update cart quantity on backend:", err);
            }
        }

        setCartItems((prev) => {
            const updated = prev.map((i) =>
                i.id === productId ? { ...i, quantity: newQty } : i
            );
            if (!isAuthenticated) {
                localStorage.setItem("guest_cart", JSON.stringify(updated));
            }
            return updated;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("guest_cart");
    };

    const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
    const totalPrice = cartItems.reduce(
        (acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 0),
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                loading,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                syncAndFetchBackendCart,
                cartCount,
                totalPrice
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;
