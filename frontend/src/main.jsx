import { StrictMode, useContext } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import ShopContextProvider, { ShopContext } from './context/ShopContext.jsx';
import { UiProvider } from './context/UiContext.jsx';





createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ShopContextProvider>
      
        <UiProvider>
          <App />
        </UiProvider>
   
    </ShopContextProvider>


  </BrowserRouter >,
)
