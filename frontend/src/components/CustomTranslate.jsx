import React, { useState, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'en', name: 'English' },
];

const CustomTranslate = () => {
  const [currentLang, setCurrentLang] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to load Google Translate
    const loadGoogleTranslate = () => {
      // Create a global function for Google Translate to call
      window.googleTranslateElementInit = () => {
        // Create Google Translate element
        new window.google.translate.TranslateElement(
          { 
            pageLanguage: 'en',
            includedLanguages: languages.map(lang => lang.code).join(','),
            autoDisplay: false 
          }, 
          'google_translate_element'
        );
        setIsLoading(false);
      };

      // Add the Google Translate script
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      // Hidden div for Google Translate
      if (!document.getElementById('google_translate_element')) {
        const div = document.createElement('div');
        div.id = 'google_translate_element';
        div.style.display = 'none';
        document.body.appendChild(div);
      }
    };

    loadGoogleTranslate();
  }, []);

  // This function uses the cookie method to change language
  const changeLanguage = (languageCode) => {
    if (isLoading) return;
    
    setCurrentLang(languageCode);
    
    // The direct cookie approach
    const cookieName = 'googtrans';
    const cookieValue = `/en/${languageCode}`;
    const cookieDomain = window.location.hostname;
    
    // Delete existing cookies first
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${cookieDomain};`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${cookieDomain};`;
    
    // Set new cookies
    document.cookie = `${cookieName}=${cookieValue}; path=/;`;
    document.cookie = `${cookieName}=${cookieValue}; path=/; domain=${cookieDomain};`;
    document.cookie = `${cookieName}=${cookieValue}; path=/; domain=.${cookieDomain};`;
    
    // Reload the page to apply changes
    window.location.reload();
  };

  return (
    <div className="language-selector">
      <select 
        value={currentLang}
        onChange={(e) => changeLanguage(e.target.value)}
        disabled={isLoading}
        className=""
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      {isLoading && <span>Loading translator...</span>}
    </div>
  );
};

export default CustomTranslate;