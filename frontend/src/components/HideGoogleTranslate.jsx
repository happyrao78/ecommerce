import { useEffect } from 'react';

const HideGoogleTranslateBar = () => {
  useEffect(() => {
    // Add the styles when component mounts
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame { display: none !important; }
      .skiptranslate { display: none !important; }
      body { top: 0px !important; }
      iframe[name="google_cookie_match_frame"] { display: none !important; }
    `;
    document.head.appendChild(style);
    
    // Remove the extra space that Google Translate adds
    document.body.style.top = '0px';
    
    return () => {
      // Clean up on unmount
      document.head.removeChild(style);
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default HideGoogleTranslateBar;