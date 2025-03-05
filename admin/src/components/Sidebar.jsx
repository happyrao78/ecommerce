import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, LogOut, LayoutDashboard, ShoppingCart,ChevronDown,ChevronUp ,ClipboardList, Box, User, Phone, DatabaseIcon } from 'lucide-react';

const Sidebar = ({ setToken,isOpen,setIsOpen }) => {
  // const [isOpen, setIsOpen] = useState(t);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSubMenu = (menu) => setOpenSubMenu(openSubMenu === menu ? null : menu);

  return (
    <div className={`min-h-screen border-r bg-black shadow-md transition-all duration-300 flex flex-col justify-between ${isOpen ? 'w-64' : 'w-20'}`}>
      <div>
        <div className="p-4 border-b gap-3 flex items-center">
        
          
          
            <div className="flex items-center gap-3 text-white">
            {isOpen && (
              <>
              <span className="text-2xl font-bold">Admin</span>
              <span className="text-2xl font-bold">Panel</span>
              </>
            )}
            </div>

          
          <button onClick={toggleSidebar} className="focus:outline-none text-white">
          <Menu size={24} />
          </button>
        </div>

        <div className='flex flex-col gap-4 p-4'>
          {/* Dashboard */}
          <NavLink to="/dashboard" className="flex items-center gap-3 p-2 rounded-lg bg-white">
            <LayoutDashboard size={24} />
            {isOpen && <span>Dashboard</span>}
          </NavLink>

          {/* Ecommerce Menu */}
          <div>
            <button 
              className='flex items-center gap-3 w-full p-2 rounded-lg bg-white' 
              onClick={() => toggleSubMenu('ecommerce')}
            >
              <ShoppingCart size={24} />
              {isOpen && <span>Ecommerce</span>}
                {openSubMenu === 'ecommerce' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            {openSubMenu === 'ecommerce' && isOpen && (
              <div className='ml-6 flex flex-col gap-2 mt-2'>
                <NavLink to="/add" className="p-2 rounded-lg bg-white">Add Product</NavLink>
                <NavLink to="/list" className="p-2 rounded-lg bg-white">List Products</NavLink>
              </div>
            )}
          </div>

          {/* Categories Menu */}
          <div>
            <button 
              className='flex items-center gap-3 w-full p-2 rounded-lg bg-white' 
              onClick={() => toggleSubMenu('categories')}
            >
              <Box size={24} />
              {isOpen && <span>Category</span>}
              {openSubMenu === 'categories' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            {openSubMenu === 'categories' && isOpen && (
              <div className='ml-6 flex flex-col gap-2 mt-2'>
                <NavLink to="/add-category" className="p-2 rounded-lg bg-white">Add Category</NavLink>
                <NavLink to="/list-category" className="p-2 rounded-lg bg-white">List Category</NavLink>
              </div>
            )}
          </div>

          {/* Attribute Menu */}
          <div>
            <button 
              className='flex items-center gap-3 w-full p-2 rounded-lg bg-white' 
              onClick={() => toggleSubMenu('attributes')}
            >
              <ClipboardList size={24} />
              {isOpen && <span>Attributes</span>}
              {openSubMenu === 'attributes' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            {openSubMenu === 'attributes' && isOpen && (
              <div className='ml-6 flex flex-col gap-2 mt-2'>
                <NavLink to="/add-attribute" className="p-2 rounded-lg bg-white">Add Attribute</NavLink>
                <NavLink to="/list-attribute" className="p-2 rounded-lg bg-white">List Attribute</NavLink>
              </div>
            )}
          </div>

            {/* Dynamic Menu */}
          <div>
            <button 
              className='flex items-center gap-3 w-full p-2 rounded-lg bg-white' 
              onClick={() => toggleSubMenu('dynamic')}
            >
              <ClipboardList size={24} />
              {isOpen && <span>Component</span>}
              {openSubMenu === 'dynamic' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            {openSubMenu === 'dynamic' && isOpen && (
              <div className='ml-6 flex flex-col gap-2 mt-2'>
                <NavLink to="/add-dynamic" className="p-2 rounded-lg bg-white">Add Component</NavLink>
                <NavLink to="/list-dynamic" className="p-2 rounded-lg bg-white">List Component</NavLink>
              </div>
            )}
          </div>

          {/* Orders Menu */}
          <div>
          <NavLink to="/orders" className="flex items-center gap-3 p-2 rounded-lg bg-white">
            <LayoutDashboard size={24} />
            {isOpen && <span>Orders</span>}
          </NavLink>
          </div>

          {/* Admin Phone Menu */}
          <div>
          <NavLink to="/admin-phone" className="flex items-center gap-3 p-2 rounded-lg bg-white">
            <Phone size={24} />
            {isOpen && <span>Admin Phone</span>}
          </NavLink>
          </div>
          
          {/* report section  */}
          {/* <div>
          <NavLink to="/reports" className="flex items-center gap-3 p-2 rounded-lg bg-white">
            <DatabaseIcon size={24} />
            {isOpen && <span>Reports</span>}
          </NavLink>
          </div> */}

          {/* Manage Users */}
          <div>
          <NavLink to="/users" className="flex items-center gap-3 p-2 rounded-lg bg-white">
            <User size={24} />
            {isOpen && <span>All Users</span>}
          </NavLink>
          </div>
        </div>
      </div>
      
      {/* Logout Section */}
      <div className='p-4 border-t'>
        <button 
          className='flex items-center gap-3 w-full p-2 rounded-lg bg-white' 
          onClick={() => setToken("")}
        >
          <LogOut size={24} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
