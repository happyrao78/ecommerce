import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Menu, LogOut, LayoutDashboard, ShoppingCart, ChevronDown, ChevronUp,
  ClipboardList, Box, User, Phone, Database, Settings, 
  CreditCard, BarChart3, Palette, X
} from 'lucide-react';

const Sidebar = ({ setToken, isOpen, setIsOpen }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const activeRoute = location.pathname;

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSubMenu = (menu) => setOpenSubMenu(openSubMenu === menu ? null : menu);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile, setIsOpen]);

  // Menu item component for consistent styling
  const MenuItem = ({ icon, label, onClick, active, isSubmenuButton, isSubmenuItem, to }) => {
    const IconComponent = icon;
    
    const baseClasses = `
      flex items-center gap-3 p-2 sm:p-3 rounded-xl transition-all duration-200
      ${isSubmenuItem ? (isOpen ? 'pl-10 sm:pl-12 text-sm' : 'justify-center') : (isOpen ? 'font-medium' : 'justify-center')}
      ${active ? 
        'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 
        'text-gray-300 hover:bg-gray-800 hover:text-white'}
    `;

    const content = (
      <>
        <div className={`${active ? 'text-white' : 'text-gray-400'} flex items-center justify-center`}>
          <IconComponent size={isSubmenuItem ? 18 : 20} strokeWidth={active ? 2.5 : 1.5} />
        </div>
        
        {isOpen && (
          <div className="flex-grow flex items-center justify-between">
            <span className={`${active ? 'font-medium' : ''} text-sm sm:text-base`}>{label}</span>
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

  // Sidebar backdrop for mobile
  const MobileBackdrop = () => (
    isOpen && isMobile ? (
      <div 
        className="fixed inset-0 bg-black/50 z-40" 
        onClick={toggleSidebar}
        aria-hidden="true"
      />
    ) : null
  );

  return (
    <>
      <MobileBackdrop />
      <div 
        className={`fixed h-full bg-gray-900 shadow-2xl transition-all duration-300 flex flex-col ${
          isOpen ? (isMobile ? 'w-64 sm:w-72 translate-x-0' : 'w-72') : 'w-0 sm:w-24'
        } z-50 ${
          !isOpen && isMobile ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Glossy effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none opacity-40 z-0"></div>
        
        {/* Header with logo - Fixed at top */}
        <div className="relative z-10 p-4 sm:p-6 border-b border-gray-800 flex items-center justify-between">
          {isOpen ? (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-base sm:text-xl">Admin<span className="text-blue-400">Panel</span></h2>
                <div className="text-xs text-gray-400">Ecommerce Application</div>
              </div>
            </div>
          ) : (
            !isMobile && <div className="flex justify-center w-full">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-base">A</span>
              </div>
            </div>
          )}
          
          <button 
            onClick={toggleSidebar} 
            className="focus:outline-none text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-gray-800"
          >
            {isOpen && isMobile ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Section with scrolling */}
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
          <div className="p-2 sm:p-4 space-y-1">
            <MenuItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              to="/dashboard" 
              active={activeRoute === '/dashboard' || activeRoute === '/'}
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
            <div className="pt-2 mt-2 sm:pt-4 sm:mt-4 border-t border-gray-800">
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
        {isOpen && (
          <div className="p-2 border-t border-gray-800">
            <div className="flex items-center gap-3 px-3 py-2 sm:py-3 mb-2">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                <User size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">Admin User</h4>
                <p className="text-xs text-gray-400 truncate">admin1234@gmail.com</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;