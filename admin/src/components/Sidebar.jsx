import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Menu, LogOut, LayoutDashboard, ShoppingCart, ChevronDown, ChevronUp,
  ClipboardList, Box, User, Phone, Database, Settings, 
  CreditCard, BarChart3, Palette
} from 'lucide-react';

const Sidebar = ({ setToken, isOpen, setIsOpen }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [activeRoute, setActiveRoute] = useState('');

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSubMenu = (menu) => setOpenSubMenu(openSubMenu === menu ? null : menu);

  // Track active route for highlighting
  useEffect(() => {
    const path = window.location.pathname;
    setActiveRoute(path);
  }, []);

  // Menu item component for consistent styling
  const MenuItem = ({ icon, label, onClick, active, isSubmenuButton, isSubmenuItem, to }) => {
    const IconComponent = icon;
    
    const baseClasses = `
      flex items-center gap-3 p-3 rounded-xl transition-all duration-200
      ${isSubmenuItem ? 'pl-12 text-sm' : 'font-medium'}
      ${active ? 
        'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 
        'text-gray-300 hover:bg-gray-800 hover:text-white'}
    `;

    const content = (
      <>
        <div className={`${active ? 'text-white' : 'text-gray-400'} flex items-center justify-center`}>
          <IconComponent size={20} strokeWidth={active ? 2.5 : 1.5} />
        </div>
        
        {isOpen && (
          <div className="flex-grow flex items-center justify-between">
            <span className={`${active ? 'font-medium' : ''}`}>{label}</span>
            {isSubmenuButton && (
              <div className="text-gray-400">
                {openSubMenu === label.toLowerCase() ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            )}
          </div>
        )}
      </>
    );

    if (to) {
      return (
        <NavLink 
          to={to} 
          className={({ isActive }) => `${baseClasses} ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : ''}`}
          onClick={() => setActiveRoute(to)}
        >
          {content}
        </NavLink>
      );
    }

    return (
      <button className={baseClasses} onClick={onClick}>
        {content}
      </button>
    );
  };

  return (
    <div 
      className={`h-screen fixed bg-gray-900 shadow-2xl transition-all duration-300 flex flex-col ${isOpen ? 'w-72' : 'w-24'} z-50`}
      style={{ 
        position: 'fixed',
        height: '100vh'
      }}
    >
      {/* Glossy effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none opacity-40 z-0"></div>
      
      {/* Header with logo - Fixed at top */}
      <div className="relative z-10 p-6 border-b border-gray-800 flex items-center justify-between">
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Admin<span className="text-blue-400">Panel</span></h2>
              <div className="text-xs text-gray-400">Ecommerce Application</div>
            </div>
          </div>
        ) : (
          
           <User size={20} className='text-white'/>
        )}
        
        <button 
          onClick={toggleSidebar} 
          className="focus:outline-none text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Menu Section with scrolling - Takes remaining space between header and footer */}
      <div 
  className="flex-1 overflow-y-auto sidebar-scroll"
  style={{ 
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch'
  }}
>
  <style
    dangerouslySetInnerHTML={{
      __html: `
        .sidebar-scroll::-webkit-scrollbar {
          display: none;
        }
      `
    }}
  />
        <div className="p-4 space-y-1">
          <MenuItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            to="/dashboard" 
            active={activeRoute === '/dashboard'}
          />

          <div className="py-1">
            <MenuItem 
              icon={ShoppingCart} 
              label="Ecommerce" 
              onClick={() => toggleSubMenu('ecommerce')} 
              active={openSubMenu === 'ecommerce'}
              isSubmenuButton={true}
            />
            
            {openSubMenu === 'ecommerce' && isOpen && (
              <div className="mt-1 space-y-1 transition-all duration-200 ease-in-out">
                <MenuItem 
                  icon={Palette} 
                  label="Add Product" 
                  to="/add" 
                  isSubmenuItem={true}
                  active={activeRoute === '/add'}
                />
                <MenuItem 
                  icon={ClipboardList} 
                  label="List Products" 
                  to="/list" 
                  isSubmenuItem={true}
                  active={activeRoute === '/list'}
                />
              </div>
            )}
          </div>

          <div className="py-1">
            <MenuItem 
              icon={Box} 
              label="Categories" 
              onClick={() => toggleSubMenu('categories')} 
              active={openSubMenu === 'categories'}
              isSubmenuButton={true}
            />
            
            {openSubMenu === 'categories' && isOpen && (
              <div className="mt-1 space-y-1">
                <MenuItem 
                  icon={Box} 
                  label="Add Category" 
                  to="/add-category" 
                  isSubmenuItem={true}
                  active={activeRoute === '/add-category'}
                />
                <MenuItem 
                  icon={ClipboardList} 
                  label="List Categories" 
                  to="/list-category" 
                  isSubmenuItem={true}
                  active={activeRoute === '/list-category'}
                />
              </div>
            )}
          </div>

          <div className="py-1">
            <MenuItem 
              icon={Settings} 
              label="Attributes" 
              onClick={() => toggleSubMenu('attributes')} 
              active={openSubMenu === 'attributes'}
              isSubmenuButton={true}
            />
            
            {openSubMenu === 'attributes' && isOpen && (
              <div className="mt-1 space-y-1">
                <MenuItem 
                  icon={Settings} 
                  label="Add Attribute" 
                  to="/add-attribute" 
                  isSubmenuItem={true}
                  active={activeRoute === '/add-attribute'}
                />
                <MenuItem 
                  icon={ClipboardList} 
                  label="List Attributes" 
                  to="/list-attribute" 
                  isSubmenuItem={true}
                  active={activeRoute === '/list-attribute'}
                />
              </div>
            )}
          </div>

          <div className="py-1">
            <MenuItem 
              icon={BarChart3} 
              label="Components" 
              onClick={() => toggleSubMenu('dynamic')} 
              active={openSubMenu === 'dynamic'}
              isSubmenuButton={true}
            />
            
            {openSubMenu === 'dynamic' && isOpen && (
              <div className="mt-1 space-y-1">
                <MenuItem 
                  icon={BarChart3} 
                  label="Add Component" 
                  to="/add-dynamic" 
                  isSubmenuItem={true}
                  active={activeRoute === '/add-dynamic'}
                />
                <MenuItem 
                  icon={ClipboardList} 
                  label="List Components" 
                  to="/list-dynamic" 
                  isSubmenuItem={true}
                  active={activeRoute === '/list-dynamic'}
                />
              </div>
            )}
          </div>

          <div className="py-1">
            <MenuItem 
              icon={CreditCard} 
              label="Discounts" 
              onClick={() => toggleSubMenu('discount')} 
              active={openSubMenu === 'discount'}
              isSubmenuButton={true}
            />
            
            {openSubMenu === 'discount' && isOpen && (
              <div className="mt-1 space-y-1">
                <MenuItem 
                  icon={CreditCard} 
                  label="Add Coupon" 
                  to="/add-discount" 
                  isSubmenuItem={true}
                  active={activeRoute === '/add-discount'}
                />
                <MenuItem 
                  icon={ClipboardList} 
                  label="List Coupons" 
                  to="/list-discount" 
                  isSubmenuItem={true}
                  active={activeRoute === '/list-discount'}
                />
              </div>
            )}
          </div>
          
          {/* Single menu items */}
          <div className="pt-4 mt-4 border-t border-gray-800">
            <MenuItem 
              icon={ShoppingCart} 
              label="Orders" 
              to="/orders" 
              active={activeRoute === '/orders'}
            />
            
            <MenuItem 
              icon={Phone} 
              label="Admin Phone" 
              to="/admin-phone" 
              active={activeRoute === '/admin-phone'}
            />
{/*             
            <MenuItem 
              icon={Database} 
              label="Reports" 
              to="/reports" 
              active={activeRoute === '/reports'}
            /> */}
            
            <MenuItem 
              icon={User} 
              label="All Users" 
              to="/users" 
              active={activeRoute === '/users'}
            />
          </div>
        </div>
      </div>
      
      {/* User profile and logout section - Fixed at bottom */}
      {/* <div className="p-2 border-t border-gray-800">
        {isOpen && (
          <div className="flex items-center gap-3 px-3 py-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
              <User size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white truncate">Admin User</h4>
              <p className="text-xs text-gray-400 truncate">admin1234@gmail.com</p>
            </div>
          </div>
        )}
        
        <button 
          className="flex items-center gap-3 w-full p-3 rounded-xl text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition-colors shadow-lg"
          onClick={() => setToken("")}
        >
          <LogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div> */}
    </div>
  );
};

export default Sidebar;