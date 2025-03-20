import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { BsLightningCharge, BsTicket, BsClipboard, BsClipboardCheck } from "react-icons/bs";
// import { ShopContext } from '../context/shopContext';

const Freeship = () => {
  const location = useLocation();
  // const { backendUrl } = useContext(ShopContext);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    // Skip fetching if on login page
    if (location.pathname === '/login') {
      return;
    }

    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://ecommerce-production-e059.up.railway.app/api/discount");
        
        if (!response.ok) {
          throw new Error('Failed to fetch coupons');
        }
        
        const data = await response.json();
        
        // If there are coupons available, filter active ones
        if (data.success && data.data.length > 0) {
          // Filter for active coupons that aren't expired
          const activeCoupons = data.data.filter(coupon => 
            coupon.isActive && 
            new Date(coupon.endDate) > new Date() &&
            new Date(coupon.startDate) <= new Date()
          );
          
          if (activeCoupons.length > 0) {
            setCoupons(activeCoupons);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [location.pathname, backendUrl]);

  // Function to copy coupon code to clipboard
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000); // Reset after 2 seconds
    });
  };

  // Don't render on login page
  if (location.pathname === '/login') {
    return null;
  }

  // Format the discount text based on type
  const getDiscountText = (coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    } else {
      return `Rs.${coupon.discountValue} OFF`;
    }
  };

  // Create coupon display component
  const CouponDisplay = ({ coupon }) => (
    <div className="flex items-center justify-center gap-2 whitespace-nowrap px-8">
      <BsTicket className="h-5 w-5 text-red-500" />
      <div className="font-medium">
        <span className="text-red-500 font-bold">{getDiscountText(coupon)}</span>
        {coupon.minOrderAmount > 0 && <span> on orders above Rs.{coupon.minOrderAmount}</span>}
        <span className="mx-2">|</span>
        <span className="bg-yellow-100 px-2 py-1 rounded text-sm font-bold flex items-center">
          CODE: {coupon.code}
          <button 
            onClick={() => copyToClipboard(coupon.code)}
            className="ml-2 focus:outline-none"
            title="Copy code"
          >
            {copiedCode === coupon.code ? 
              <BsClipboardCheck className="h-4 w-4 text-green-500" /> : 
              <BsClipboard className="h-4 w-4 text-gray-600 hover:text-gray-800" />
            }
          </button>
        </span>
      </div>
    </div>
  );

  // Default content for loading or error states
  const DefaultContent = () => (
    <div className="flex items-center justify-center gap-2 whitespace-nowrap px-8">
      <BsLightningCharge className="h-4 w-4 text-gray-500" />
      <p>Discount on orders above Rs.599</p>
    </div>
  );

  // Render content based on available coupons
  const renderMarqueeContent = () => {
    if (loading || error || coupons.length === 0) {
      return <DefaultContent />;
    }
    
    // Display all available coupons without duplication
    return coupons.map((coupon, index) => (
      <CouponDisplay key={`coupon-${index}`} coupon={coupon} />
    ));
  };

  // Create enough copies to fill the marquee
  const createMarqueeItems = () => {
    const content = renderMarqueeContent();
    
    // If we have coupons, repeat them only if needed to fill the marquee
    if (!loading && !error && coupons.length > 0) {
      // Need at least 5 items for smooth scrolling
      const repeatCount = Math.max(1, Math.ceil(5 / coupons.length));
      return Array(repeatCount).fill().flatMap(() => content);
    }
    
    // For default content, repeat it 5 times
    return Array(5).fill().map((_, index) => React.cloneElement(content, { key: `default-${index}` }));
  };

  return (
    <div className="sm:text-sm bg-white text-black text-center py-4 border-slate-200 border px-4 sm:px-6 md:px-8 md:text-lg w-full overflow-hidden uppercase font-semibold -mt-1">
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {createMarqueeItems()}
        </div>
        
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex">
          {createMarqueeItems()}
        </div>
      </div>
    </div>
  );
};

export default Freeship;