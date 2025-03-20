"use client";

import React, { useState, useEffect,useContext } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import {ShopContext} from "../context/ShopContext";

const WhatsAppChat = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const { backendUrl } = useContext(ShopContext);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminPhone = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(backendUrl + "/api/admin/admin-phone");
                
                if (!response.ok) {
                    throw new Error("Failed to fetch admin phone number");
                }
                
                const data = await response.json();
                setPhoneNumber(data.phoneNumber);
            } catch (err) {
                console.error("Error fetching admin phone:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminPhone();
    }, []);

    const handleWhatsAppClick = () => {
        if (!phoneNumber) {
            console.error("Phone number not available");
            return;
        }
        
        const whatsappUrl = `https://wa.me/${phoneNumber}`;
        window.open(whatsappUrl, "_blank");
    };

    // Don't render the button if we're still loading or there was an error
    if (isLoading) {
        return null; // Or you could return a loading spinner here
    }

    // You can handle the error state as needed
    if (error) {
        console.error("Error loading WhatsApp contact:", error);
        return null; // Or return a fallback UI
    }

    return (
        <motion.div
            className="fixed bottom-5 right-5 p-2  rounded-full  cursor-pointer z-50"
            onClick={handleWhatsAppClick}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
        >
            <FaWhatsapp className="text-4xl mb-8 sm:text-3xl lg:text-4xl z-50" color="red" />
        </motion.div>
    );
};

export default WhatsAppChat;