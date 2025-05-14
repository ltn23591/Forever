import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const currency = "$";
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Add product to cart
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Please select a size!");
            return;
        }
        if (!products.find((product) => product._id === itemId)) {
            toast.error("Invalid product!");
            return;
        }

        setIsLoading(true);
        try {
            let cartData = structuredClone(cartItems);
            if (cartData[itemId]) {
                cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
            } else {
                cartData[itemId] = { [size]: 1 };
            }
            setCartItems(cartData);
            toast.success("Added to cart!");

            if (token) {
                await axios.post(
                    `${backendUrl}/api/cart/add`,
                    { itemId, size },
                    { headers: { Authorization: `Bearer ${token}` } },
                );
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate total cart items
    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, sizes) => {
            return (
                total +
                Object.values(sizes).reduce((sum, qty) => sum + (qty || 0), 0)
            );
        }, 0);
    };

    // Update cart quantity
    const updateQuantity = async (itemId, size, quantity) => {
        if (!Number.isInteger(quantity) || quantity < 0) {
            toast.error("Invalid quantity!");
            return;
        }
        if (!products.find((product) => product._id === itemId)) {
            toast.error("Invalid product!");
            return;
        }

        setIsLoading(true);
        try {
            let cartData = structuredClone(cartItems);
            if (quantity === 0) {
                delete cartData[itemId][size];
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            } else {
                cartData[itemId][size] = quantity;
            }
            setCartItems(cartData);

            if (token) {
                await axios.post(
                    `${backendUrl}/api/cart/update`,
                    { itemId, size, quantity },
                    { headers: { Authorization: `Bearer ${token}` } },
                );
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    // Calculate total cart amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const itemInfo = products.find((product) => product._id === itemId);
            if (!itemInfo) continue;
            for (const size in cartItems[itemId]) {
                const quantity = cartItems[itemId][size] || 0;
                if (quantity > 0) {
                    totalAmount += itemInfo.price * quantity;
                }
            }
        }
        return totalAmount > 0 ? totalAmount + delivery_fee : 0;
    };

    // Fetch products
    const getProductsData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.msg);
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch user cart
    const getUserCart = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/get`,
                {},
                { headers: { Authorization: `Bearer ${token}` } },
            );
            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            } else {
                toast.error(response.data.msg);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    // Handle API errors
    const handleApiError = (error) => {
        console.error("API error:", error);
        if (error.response) {
            const { status, data } = error.response;
            if (status === 401) {
                toast.error("Session expired, please login again");
                setToken("");
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                toast.error(data.msg || "An error occurred");
            }
        } else {
            toast.error("Network error, please try again");
        }
    };

    // Logout
    const logout = () => {
        setToken("");
        setCartItems({});
        localStorage.removeItem("token");
        navigate("/login");
        toast.success("Logged out successfully");
    };

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
      
        getUserCart();
    }, [token]);

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        addToCart,
        cartItems,
        setCartItems,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        token,
        setToken,
        isLoading,
        logout,
        
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
