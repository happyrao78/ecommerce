"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Bot, X, Mic, Forward } from 'lucide-react';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Display initial message when chat is opened
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ 
                text: "Hello, Welcome to the Digital Assistant! How can I help you today?", 
                isUser: false 
            }]);
        }
    }, [isOpen, messages.length]);

    // Auto scroll to bottom of messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Adjust chat container height on mobile
    useEffect(() => {
        const handleResize = () => {
            if (chatContainerRef.current && isOpen) {
                const viewportHeight = window.innerHeight;
                const maxHeight = Math.min(viewportHeight * 0.7, 500); // Maximum 70% of viewport or 500px
                chatContainerRef.current.style.maxHeight = `${maxHeight}px`;
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    const handleSendMessage = async (message) => {
        if (!message.trim()) return;
        
        setMessages((prev) => [...prev, { text: message, isUser: true }]);
        setInputValue("");
        setIsLoading(true);

        // Call backend API for response
        try {
            const response = await axios.post('http://127.0.0.1:8000/ask-question', {
                question: message,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const botMessage = response.data.answer;  // Text response from the bot
            const audioUrl = response.data.audioUrl;  // Audio URL from the TTS

            // Set the bot's text response in the messages
            setMessages((prev) => [...prev, { text: botMessage, isUser: false }]);

            // Play the audio response automatically if the audio URL is available
            if (audioUrl) {
                const audio = new Audio(audioUrl);
                audio.play().catch((error) => {
                    console.error("Audio playback failed:", error);
                });
            }

        } catch (error) {
            console.error("Error fetching response:", error);
            setMessages((prev) => [...prev, { text: "Please try again!", isUser: false }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(inputValue);
        }
    };

    const handleVoiceInput = () => {
        if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            setMessages((prev) => [...prev, { 
                text: "Sorry, voice recognition is not supported in your browser.", 
                isUser: false 
            }]);
            return;
        }
        
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.start();

        // Show user feedback that voice recording is active
        setMessages((prev) => [...prev, { 
            text: "Listening...", 
            isUser: false,
            isTemporary: true 
        }]);

        recognition.onresult = (event) => {
            const speech = event.results[0][0].transcript;
            // Remove the "Listening..." message
            setMessages(prev => prev.filter(msg => !msg.isTemporary));
            handleSendMessage(speech);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            // Remove the "Listening..." message and show error
            setMessages(prev => [
                ...prev.filter(msg => !msg.isTemporary), 
                { text: "I couldn't hear you. Please try again.", isUser: false }
            ]);
        };
    };

    return (
        <div>
            {/* Chatbot Icon */}
            <motion.div
                className={`chatbot-icon fixed bottom-4 right-4 p-3 bg-black rounded-full shadow-lg cursor-pointer z-50 ${isOpen ? "hidden" : "block"}`}
                onClick={() => setIsOpen(true)}
                whileTap={{ scale: 0.9 }}
            >
                <Bot size={24} className="sm:w-8 sm:h-8" color="white" />
            </motion.div>

            {/* Chatbot Popup */}
            {isOpen && (
                <div 
                    ref={chatContainerRef}
                    className="chatbot-container p-3 sm:p-4 bg-white border rounded-lg shadow-lg fixed bottom-2 right-2 sm:bottom-5 sm:right-5 w-[calc(100vw-16px)] sm:w-80 md:w-96 flex flex-col z-50"
                >
                    <div className="flex justify-between items-center mb-2 py-1 border-b">
                        <h2 className="text-lg font-semibold">Chatbot</h2>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="hover:bg-gray-100 rounded-full p-1"
                            aria-label="Close chat"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    
                    <div 
                        className="messages flex-grow mb-3 overflow-y-auto font-body text-sm p-2"
                        style={{ height: "min(60vh, 300px)" }}
                    >
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`message w-full flex ${msg.isUser ? "justify-end" : "justify-start"} mb-2`}
                            >
                                <div 
                                    className={`${
                                        msg.isUser 
                                            ? "bg-black text-white" 
                                            : msg.isTemporary 
                                                ? "bg-blue-100 text-blue-800" 
                                                : "bg-lightGray text-black"
                                    } p-2 rounded-lg max-w-[85%] break-words text-sm`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message w-full flex justify-start mb-3">
                                <div className="bg-lightGray rounded-lg p-2 flex items-center">
                                    <motion.span 
                                        className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-1"
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                    <motion.span 
                                        className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-1"
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                                    />
                                    <motion.span 
                                        className="inline-block w-2 h-2 bg-gray-500 rounded-full"
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                                    />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="input-group flex font-body text-sm">
                        <input
                            type="text"
                            className="flex-grow border rounded-l-lg p-2 text-sm"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                        />
                        <button
                            className="bg-gradient text-black rounded-r-lg px-3 border"
                            onClick={() => handleSendMessage(inputValue)}
                            aria-label="Send message"
                        >
                            <Forward size={16} className="sm:w-5 sm:h-5" color="black" />
                        </button>
                        <button
                            className="ml-1 sm:ml-2 bg-gradient text-black rounded-lg p-2 border"
                            onClick={handleVoiceInput}
                            aria-label="Voice input"
                        >
                            <Mic size={16} className="sm:w-5 sm:h-5" color="black" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;