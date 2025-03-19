import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BsLightningCharge, BsTicket } from "react-icons/bs";

const Freeship = () => {
  const location = useLocation();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip fetching if on login page
    if (location.pathname === '/login') {
      return;
    }

    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://ecommerce-production-a805.up.railway.app/api/discount');
        
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
  }, [location.pathname]);

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
        <span className="bg-yellow-100 px-2 py-1 rounded text-sm font-bold">
          CODE: {coupon.code}
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

  // Repeat the coupons to create a continuous scrolling effect
  const renderCouponContent = () => {
    if (loading || error || coupons.length === 0) {
      // Repeat the default content for scrolling
      return Array(10).fill().map((_, index) => (
        <DefaultContent key={index} />
      ));
    }
    
    // Repeat the available coupons for scrolling
    return coupons.flatMap((coupon, index) => 
      // Duplicate each coupon a few times to ensure continuous scrolling
      Array(3).fill().map((_, dupIndex) => (
        <CouponDisplay key={`${index}-${dupIndex}`} coupon={coupon} />
      ))
    );
  };

  return (
    <div className="sm:text-sm bg-white text-black text-center py-4 border-slate-200 border px-4 sm:px-6 md:px-8 md:text-lg w-full overflow-hidden uppercase font-semibold -mt-1">
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {renderCouponContent()}
        </div>
        
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex">
          {renderCouponContent()}
        </div>
      </div>
    </div>
  );
};

export default Freeship;

