import { createContext, useEffect, useState } from "react";
// import {products} from "../assets/frontend_assets/assets"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    // const currency = "₹ ";
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({})
    const navigate = useNavigate()
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState("")
    const [subCategoryData, setSubCategoryData] = useState("")
    const [wishlistItems, setWishlistItems] = useState({});
    const [currency, setCurrency] = useState("INR"); // Default is INR
    const [fromCurrency, setFromCurrency] = useState("INR"); // Default is INR
    const [toCurrency, setToCurrency] = useState("INR"); // Default is INR
    const [conversionRate, setConversionRate] = useState(1); // Default conversion rate
    const supportedCurrencies = ["INR", "USD", "EUR", "GBP"]; // Add more as needed
    const delivery_fee = 10 * conversionRate;

    const fetchConversionRate = async (fromCurrency,toCurrency) => {
        try {
            const response = await axios.get(`https://v6.exchangerate-api.com/v6/3988bc920f2d29ad3b90090a/pair/${fromCurrency}/${toCurrency}`);
            console.log(fromCurrency,toCurrency)
            setConversionRate(response.data.conversion_rate);
            setCurrency(toCurrency)
        } catch (error) {
            console.error("Error fetching currency rates:", error);
            toast.error("Failed to fetch currency rates");
        }
    };
    
    const changeCurrency = () => {
        // console.log(fromCurrency,toCurrency)
        // fetchConversionRate(fromCurrency,toCurrency);
        
    };

    useEffect(()=>{
        console.log(`Conversion Rate from ${fromCurrency} to ${toCurrency}`,conversionRate)
    },[conversionRate])
    



    const addToCart = async (itemId, selectedAttributeValues) => {
        let cartData = structuredClone(cartItems);

        // Create a unique key for this item + attributes combination
        const attributesKey = JSON.stringify(selectedAttributeValues || {});
        const cartItemKey = `${itemId}_${attributesKey}`;

        // Check if this exact item with these attributes exists
        if (cartData[cartItemKey]) {
            cartData[cartItemKey].quantity += 1;
        } else {
            cartData[cartItemKey] = {
                itemId, // Store original itemId for reference
                quantity: 1,
                attributes: selectedAttributeValues
            };
        }

        setCartItems(cartData);
        console.log(cartData);

        if (token) {
            try {
                const response = await axios.post(backendUrl + "/api/cart/add",
                    { itemId, selectedAttributeValues },
                    { headers: { token } }
                );

                if (response.data.message) {
                    toast.success(response.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getCartCount = () => {
        let totalCount = 0;

        try {
            for (const cartItemKey in cartItems) {
                const item = cartItems[cartItemKey];
                if (item && item.quantity > 0) {
                    totalCount += item.quantity;
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }

        return totalCount;
    };

    const updateQuantity = async (itemId, quantity, selectedAttributeValues) => {
        let cartData = structuredClone(cartItems);

        // Create the same composite key used in addToCart
        const attributesKey = JSON.stringify(selectedAttributeValues || {});
        const cartItemKey = `${itemId}_${attributesKey}`;

        if (cartData[cartItemKey]) {
            cartData[cartItemKey].quantity = quantity;
        }

        setCartItems(cartData);

        if (token) {
            try {
                const response = await axios.post(backendUrl + "/api/cart/update",
                    { itemId, quantity, selectedAttributeValues },
                    { headers: { token } }
                );

                if (response.data.message) {
                    toast.success(response.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getCartAmount = () => {
        let totalAmount = 0;

        for (const cartItemKey in cartItems) {
            const item = cartItems[cartItemKey];

            try {
                if (item && item.quantity > 0) {
                    // Extract the original itemId from the composite key or from the item object
                    const itemId = item.itemId || cartItemKey.split('_')[0];

                    // Find the product details for the current itemId
                    const itemInfo = products.find((product) => product._id === itemId);
                    if (itemInfo) {
                        const convertedPrice = conversionRate * itemInfo.price
                        totalAmount += convertedPrice * item.quantity;
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }

        return totalAmount;
    };


    // const getCartAmount = () => {
    //     let totalAmount = 0;
    
    //     for (const cartItemKey in cartItems) {
    //         const item = cartItems[cartItemKey];
    
    //         try {
    //             if (item && item.quantity > 0) {
    //                 const itemId = item.itemId || cartItemKey.split('_')[0];
    //                 const itemInfo = products.find((product) => product._id === itemId);
    //                 if (itemInfo) {
    //                     const convertedPrice = (itemInfo.price * conversionRates[currency]).toFixed(2);
    //                     totalAmount += convertedPrice * item.quantity;
    //                 }
    //             }
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    
    //     return totalAmount;
    // };
    


    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/product/list");
            if (response.data.success) {
                setProducts(response.data.products)
                console.log(response.data.products)

            } else {
                toast.error(response.data.message)
            }



        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }
    }


    const getSubCategoryData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/category/getSubCategory`);
            console.log("SubCategory", response.data);
            if (response.data.success) {
                const subCategoryData = response.data.categories.reduce((acc, category) => {
                    acc[category.category] = category.subcategories;
                    return acc;
                }, {});
                console.log(subCategoryData);
                setSubCategoryData(subCategoryData);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };


    // Add to wishlist
    const addToWishlist = async (itemId, selectedAttributeValues) => {
        let wishlistData = structuredClone(wishlistItems);

        // Create a unique key for this item + attributes combination
        const attributesKey = JSON.stringify(selectedAttributeValues || {});
        const wishlistItemKey = `${itemId}_${attributesKey}`;

        // Store the item in wishlist
        wishlistData[wishlistItemKey] = {
            itemId,
            attributes: selectedAttributeValues,
        };

        setWishlistItems(wishlistData);

        if (token) {
            try {
                const response = await axios.post(
                    backendUrl + "/api/wishlist/add",
                    { itemId, selectedAttributeValues },
                    { headers: { token } }
                );
                if (response.data.message) {
                    toast.success(response.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    // Remove from wishlist
    const removeFromWishlist = async (itemId, selectedAttributeValues) => {
        let wishlistData = structuredClone(wishlistItems);

        const attributesKey = JSON.stringify(selectedAttributeValues || {});
        const wishlistItemKey = `${itemId}_${attributesKey}`;

        if (wishlistData[wishlistItemKey]) {
            delete wishlistData[wishlistItemKey];
            setWishlistItems(wishlistData);

            if (token) {
                try {
                    const response = await axios.post(
                        backendUrl + "/api/wishlist/remove",
                        { itemId, selectedAttributeValues },
                        { headers: { token } }
                    );
                    if (response.data.message) {
                        toast.success(response.data.message);
                    }
                } catch (error) {
                    console.log(error);
                    toast.error(error.message);
                }
            }
        }
    };

    // Move from wishlist to cart
    const moveToCart = async (itemId, selectedAttributeValues) => {
        const attributesKey = JSON.stringify(selectedAttributeValues || {});
        const wishlistItemKey = `${itemId}_${attributesKey}`;

        if (wishlistItems[wishlistItemKey]) {
            // First add to cart
            await addToCart(itemId, selectedAttributeValues);

            // Then remove from wishlist
            await removeFromWishlist(itemId, selectedAttributeValues);

            if (token) {
                try {
                    const response = await axios.post(
                        backendUrl + "/api/wishlist/move-to-cart",
                        { itemId, selectedAttributeValues },
                        { headers: { token } }
                    );
                    if (response.data.message) {
                        toast.success(response.data.message);
                    }
                } catch (error) {
                    console.log(error);
                    toast.error(error.message);
                }
            }
        }
    };

    // Get wishlist count
    const getWishlistCount = () => {
        return Object.keys(wishlistItems).length;
    };

    // Check if item is in wishlist
    const isInWishlist = (itemId, selectedAttributeValues) => {
        const attributesKey = JSON.stringify(selectedAttributeValues || {});
        const wishlistItemKey = `${itemId}_${attributesKey}`;
        return !!wishlistItems[wishlistItemKey];
    };

    // Get user's wishlist from the backend
    const getUserWishlist = async (token) => {
        try {
            const response = await axios.post(
                backendUrl + "/api/wishlist/get",
                {},
                { headers: { token } }
            );

            if (response.data.success) {
                setWishlistItems(response.data.wishlistData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };



    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + "/api/cart/get", {}, { headers: { token } })

            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }
    }








    useEffect(() => {
        getProductsData();
        getSubCategoryData();
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            getUserCart(localStorage.getItem("token"));
            getUserWishlist(localStorage.getItem("token"));
            fetchConversionRate(currency);
        }
    })




    const value = {
        products, currency, delivery_fee, search, setSearch, showSearch, setShowSearch, cartItems, addToCart, getCartCount, updateQuantity, getCartAmount, navigate, backendUrl, token, setToken, setCartItems, subCategoryData, wishlistItems,
        setWishlistItems,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        getWishlistCount,
        isInWishlist,
    changeCurrency,
    conversionRate,
    supportedCurrencies,
    fromCurrency,setFromCurrency,toCurrency,setToCurrency,
    fetchConversionRate
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )


}

export default ShopContextProvider;