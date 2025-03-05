import React from 'react';
import { FaWhatsapp, FaRocketchat } from 'react-icons/fa'; // Using react-icons for WhatsApp icon

const WhatsAppChat = () => {
  // WhatsApp phone number (use your actual business phone number)
  const phoneNumber = '8595864036'; // Example phone number, update with your own
  
  // The default message (URL encoded)
  const message = 'Hello, I checked your website and can I get more information about your services?'; // Default message

  // WhatsApp URL with phone number and default message
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className="fixed bottom-4 right-4 z-50" // Positioning it on the bottom right of the page
      style={{
        position: 'fixed',
        bottom: '60px',
        right: '40px',
        zIndex: 50,
      }}
    >
      <a
        href={whatsappURL} // Link to open WhatsApp with the message
        target="_blank" // Opens in a new tab
        rel="noopener noreferrer"
        className="relative p-4  rounded-full transition-all duration-10"
      >
        {/* Blinking effect circle */}
        <div className="absolute inset-0  w-[60px] h-[60px] rounded-full animate-pulse">
        <FaWhatsapp className=" text-orange-600 text-5xl mx-auto " />
        </div>
        
        
      </a>
    </div>
  );
};

export default WhatsAppChat;
