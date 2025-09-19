import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom'; // Import Link
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ user, notifications = [], onNotificationClick, onProfileClick, onMenuToggle }) => {
 const [isNotificationOpen, setIsNotificationOpen] = useState(false);
 const [isProfileOpen, setIsProfileOpen] = useState(false);
 const location = useLocation();

 const navigationItems = [
   { label: 'Requests', path: '/cash-transfer-request-form', icon: 'FileText' },
   { label: 'Approvals', path: '/approval-queue-dashboard', icon: 'CheckCircle' },
   { label: 'Analytics', path: '/reporting-and-analytics-dashboard', icon: 'BarChart3' },
   { label: 'Status', path: '/request-status-tracking', icon: 'Clock' },
 ];

 const moreItems = [
   { label: 'Administration', path: '/system-administration-panel', icon: 'Settings' },
   { label: 'Over-Limit Requests', path: '/over-limit-approval-request-form', icon: 'AlertTriangle' },
 ];

 const [isMoreOpen, setIsMoreOpen] = useState(false);

 const getPageTitle = () => {
   const currentPath = location.pathname;
   const allItems = [...navigationItems, ...moreItems];
   const currentItem = allItems.find(item => item.path === currentPath);
   return currentItem?.label || 'Wing Cash Movement System';
 };

 const unreadCount = notifications.filter(n => !n.read).length;

 const handleNotificationToggle = () => {
   setIsNotificationOpen(!isNotificationOpen);
   setIsProfileOpen(false);
   setIsMoreOpen(false);
 };

 const handleProfileToggle = () => {
   setIsProfileOpen(!isProfileOpen);
   setIsNotificationOpen(false);
   setIsMoreOpen(false);
 };

 const handleMoreToggle = () => {
   setIsMoreOpen(!isMoreOpen);
   setIsNotificationOpen(false);
   setIsProfileOpen(false);
 };

 const handleNotificationClick = (notification) => {
   if (onNotificationClick) {
     onNotificationClick(notification);
   }
   setIsNotificationOpen(false);
 };

 const handleProfileAction = (action) => {
   if (onProfileClick) {
     onProfileClick(action);
   }
   setIsProfileOpen(false);
 };

 return (
   <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50">
     <div className="flex items-center justify-between h-full px-6">
       {/* Left Section - Logo and Navigation */}
       <div className="flex items-center space-x-8">
         {/* Logo */}
         <div className="flex items-center space-x-3">
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
           </div>
           <div className="flex flex-col">
             <span className="text-lg font-semibold text-foreground">Wing</span>
             <span className="text-xs text-muted-foreground -mt-1">Cash Movement</span>
           </div>
         </div>

         {/* Desktop Navigation */}
         <nav className="hidden lg:flex items-center space-x-1">
           {navigationItems.map((item) => (
             <Link // <-- USE LINK INSTEAD OF <a>
               key={item.path}
               to={item.path} // <-- USE to INSTEAD OF href
               className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                 location.pathname === item.path
                   ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
               }`}
             >
               <Icon name={item.icon} size={16} />
               <span>{item.label}</span>
             </Link>
           ))}
           
           {/* More Dropdown */}
           <div className="relative">
             <Button
               variant="ghost"
               size="sm"
               onClick={handleMoreToggle}
               className="flex items-center space-x-2"
             >
               <Icon name="MoreHorizontal" size={16} />
               <span>More</span>
               <Icon name="ChevronDown" size={14} className={`transition-transform duration-150 ${isMoreOpen ? 'rotate-180' : ''}`} />
             </Button>
             
             {isMoreOpen && (
               <div className="absolute top-full left-0 mt-1 w-56 bg-popover border border-border rounded-md shadow-lg z-50 animate-fade-in">
                 <div className="py-1">
                   {moreItems.map((item) => (
                     <Link // <-- USE LINK INSTEAD OF <a>
                       key={item.path}
                       to={item.path} // <-- USE to INSTEAD OF href
                       className={`flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-150 ${
                         location.pathname === item.path
                           ? 'bg-primary/10 text-primary' :'text-popover-foreground hover:bg-muted'
                       }`}
                       onClick={() => setIsMoreOpen(false)}
                     >
                       <Icon name={item.icon} size={16} />
                       <span>{item.label}</span>
                     </Link>
                   ))}
                 </div>
               </div>
             )}
           </div>
         </nav>

         {/* Mobile Menu Button */}
         <Button
           variant="ghost"
           size="sm"
           className="lg:hidden"
           onClick={onMenuToggle}
         >
           <Icon name="Menu" size={20} />
         </Button>
       </div>

       {/* Right Section - Actions and User */}
       <div className="flex items-center space-x-4">
         {/* Page Title - Mobile */}
         <div className="lg:hidden">
           <h1 className="text-sm font-medium text-foreground truncate max-w-32">
             {getPageTitle()}
           </h1>
         </div>

         {/* Notifications */}
         <div className="relative">
           <Button
             variant="ghost"
             size="sm"
             onClick={handleNotificationToggle}
             className="relative"
           >
             <Icon name="Bell" size={20} />
             {unreadCount > 0 && (
               <span className="absolute -top-1 -right-1 h-5 w-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                 {unreadCount > 9 ? '9+' : unreadCount}
               </span>
             )}
           </Button>

           {isNotificationOpen && (
             <div className="absolute top-full right-0 mt-1 w-80 bg-popover border border-border rounded-md shadow-lg z-50 animate-fade-in">
               <div className="p-4 border-b border-border">
                 <h3 className="text-sm font-medium text-popover-foreground">Notifications</h3>
                 {unreadCount > 0 && (
                   <p className="text-xs text-muted-foreground mt-1">{unreadCount} unread</p>
                 )}
               </div>
               <div className="max-h-80 overflow-y-auto">
                 {notifications.length > 0 ? (
                   notifications.slice(0, 5).map((notification, index) => (
                     <div
                       key={index}
                       className={`p-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted transition-colors duration-150 ${
                         !notification.read ? 'bg-primary/5' : ''
                       }`}
                       onClick={() => handleNotificationClick(notification)}
                     >
                       <div className="flex items-start space-x-3">
                         <div className={`w-2 h-2 rounded-full mt-2 ${
                           notification.type === 'approval' ? 'bg-warning' :
                           notification.type === 'success' ? 'bg-success' :
                           notification.type === 'error' ? 'bg-error' : 'bg-accent'
                         }`} />
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium text-popover-foreground truncate">
                             {notification.title}
                           </p>
                           <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                             {notification.message}
                           </p>
                           <p className="text-xs text-muted-foreground mt-2">
                             {notification.time}
                           </p>
                         </div>
                       </div>
                     </div>
                   ))
                 ) : (
                   <div className="p-8 text-center">
                     <Icon name="Bell" size={32} className="mx-auto text-muted-foreground mb-2" />
                     <p className="text-sm text-muted-foreground">No notifications</p>
                   </div>
                 )}
               </div>
               {notifications.length > 5 && (
                 <div className="p-3 border-t border-border">
                   <Button variant="ghost" size="sm" className="w-full">
                     View all notifications
                   </Button>
                 </div>
               )}
             </div>
           )}
         </div>

         {/* User Profile */}
         <div className="relative">
           <Button
             variant="ghost"
             size="sm"
             onClick={handleProfileToggle}
             className="flex items-center space-x-2"
           >
             <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
               {user?.name?.charAt(0) || 'U'}
             </div>
             <div className="hidden md:block text-left">
               <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
               <p className="text-xs text-muted-foreground">{user?.role || 'Staff'}</p>
             </div>
             <Icon name="ChevronDown" size={14} className={`hidden md:block transition-transform duration-150 ${isProfileOpen ? 'rotate-180' : ''}`} />
           </Button>

           {isProfileOpen && (
             <div className="absolute top-full right-0 mt-1 w-56 bg-popover border border-border rounded-md shadow-lg z-50 animate-fade-in">
               <div className="p-4 border-b border-border">
                 <p className="text-sm font-medium text-popover-foreground">{user?.name || 'User'}</p>
                 <p className="text-xs text-muted-foreground">{user?.email || 'user@wingbank.com'}</p>
                 <p className="text-xs text-muted-foreground mt-1">{user?.role || 'Staff'}</p>
               </div>
               <div className="py-1">
                 <button
                   className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
                   onClick={() => handleProfileAction('profile')}
                 >
                   <Icon name="User" size={16} />
                   <span>Profile Settings</span>
                 </button>
                 <button
                   className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
                   onClick={() => handleProfileAction('preferences')}
                 >
                   <Icon name="Settings" size={16} />
                   <span>Preferences</span>
                 </button>
                 <button
                   className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
                   onClick={() => handleProfileAction('help')}
                 >
                   <Icon name="HelpCircle" size={16} />
                   <span>Help & Support</span>
                 </button>
                 <div className="border-t border-border my-1"></div>
                 <button
                   className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors duration-150"
                   onClick={() => handleProfileAction('logout')}
                 >
                   <Icon name="LogOut" size={16} />
                   <span>Sign Out</span>
                 </button>
               </div>
             </div>
           )}
         </div>
       </div>
     </div>
   </header>
 );
};

export default Header;
