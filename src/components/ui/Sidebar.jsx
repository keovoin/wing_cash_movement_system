import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom'; // Import Link
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggle, user }) => {
 const location = useLocation();
 const [expandedSections, setExpandedSections] = useState(['requests', 'approvals']);

 const navigationSections = [
   {
     id: 'requests',
     label: 'Requests',
     icon: 'FileText',
     items: [
       {
         label: 'Cash Transfer Request',
         path: '/cash-transfer-request-form',
         icon: 'ArrowRightLeft',
         description: 'Submit new cash transfer requests'
       },
       {
         label: 'Over-Limit Approval',
         path: '/over-limit-approval-request-form',
         icon: 'AlertTriangle',
         description: 'Request approval for over-limit transactions'
       }
     ]
   },
   {
     id: 'approvals',
     label: 'Approvals',
     icon: 'CheckCircle',
     items: [
       {
         label: 'Approval Queue',
         path: '/approval-queue-dashboard',
         icon: 'Clock',
         description: 'Review and process pending approvals',
         badge: 12
       },
       {
         label: 'Request Status',
         path: '/request-status-tracking',
         icon: 'Search',
         description: 'Track request progress and history'
       }
     ]
   },
   {
     id: 'analytics',
     label: 'Analytics',
     icon: 'BarChart3',
     items: [
       {
         label: 'Reports & Analytics',
         path: '/reporting-and-analytics-dashboard',
         icon: 'TrendingUp',
         description: 'View performance metrics and reports'
       }
     ]
   },
   {
     id: 'administration',
     label: 'Administration',
     icon: 'Settings',
     items: [
       {
         label: 'System Administration',
         path: '/system-administration-panel',
         icon: 'Shield',
         description: 'Manage system settings and users'
       }
     ]
   }
 ];

 const toggleSection = (sectionId) => {
   if (isCollapsed) return;
   
   setExpandedSections(prev => 
     prev.includes(sectionId) 
       ? prev.filter(id => id !== sectionId)
       : [...prev, sectionId]
   );
 };

 const isItemActive = (path) => location.pathname === path;
 const isSectionActive = (section) => section.items.some(item => isItemActive(item.path));

 return (
   <>
     {/* Sidebar */}
     <aside className={`fixed left-0 top-16 bottom-0 bg-card border-r border-border z-40 transition-all duration-300 ease-out ${
       isCollapsed ? 'w-16' : 'w-72'
     }`}>
       <div className="flex flex-col h-full">
         {/* Sidebar Header */}
         <div className="flex items-center justify-between p-4 border-b border-border">
           {!isCollapsed && (
             <h2 className="text-sm font-semibold text-foreground">Navigation</h2>
           )}
           <Button
             variant="ghost"
             size="sm"
             onClick={onToggle}
             className="ml-auto"
           >
             <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
           </Button>
         </div>

         {/* Navigation */}
         <nav className="flex-1 overflow-y-auto p-4 space-y-2">
           {navigationSections.map((section) => {
             const isExpanded = expandedSections.includes(section.id);
             const hasActiveItem = isSectionActive(section);

             return (
               <div key={section.id} className="space-y-1">
                 {/* Section Header */}
                 <button
                   onClick={() => toggleSection(section.id)}
                   className={`w-full flex items-center justify-between p-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                     hasActiveItem
                       ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                   }`}
                   title={isCollapsed ? section.label : undefined}
                 >
                   <div className="flex items-center space-x-3">
                     <Icon name={section.icon} size={18} />
                     {!isCollapsed && <span>{section.label}</span>}
                   </div>
                   {!isCollapsed && (
                     <Icon 
                       name="ChevronDown" 
                       size={14} 
                       className={`transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`}
                     />
                   )}
                 </button>
                 {/* Section Items */}
                 {(isExpanded || isCollapsed) && (
                   <div className={`space-y-1 ${isCollapsed ? '' : 'ml-4'}`}>
                     {section.items.map((item) => (
                       <Link // <-- USE LINK INSTEAD OF <a>
                         key={item.path}
                         to={item.path} // <-- USE to INSTEAD OF href
                         className={`flex items-center justify-between p-2 rounded-md text-sm transition-colors duration-150 group ${
                           isItemActive(item.path)
                             ? 'bg-primary text-primary-foreground shadow-sm'
                             : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                         }`}
                         title={isCollapsed ? item.label : item.description}
                       >
                         <div className="flex items-center space-x-3 min-w-0">
                           <Icon name={item.icon} size={16} />
                           {!isCollapsed && (
                             <div className="min-w-0">
                               <span className="block truncate">{item.label}</span>
                               {item.description && (
                                 <span className="block text-xs opacity-75 truncate mt-0.5">
                                   {item.description}
                                 </span>
                               )}
                             </div>
                           )}
                         </div>
                         
                         {!isCollapsed && item.badge && (
                           <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${
                             isItemActive(item.path)
                               ? 'bg-primary-foreground/20 text-primary-foreground'
                               : 'bg-warning text-warning-foreground'
                           }`}>
                             {item.badge}
                           </span>
                         )}
                       </Link>
                     ))}
                   </div>
                 )}
               </div>
             );
           })}
         </nav>

         {/* Sidebar Footer */}
         {!isCollapsed && (
           <div className="p-4 border-t border-border">
             <div className="flex items-center space-x-3 p-2 rounded-md bg-muted/50">
               <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                 {user?.name?.charAt(0) || 'U'}
               </div>
               <div className="min-w-0 flex-1">
                 <p className="text-sm font-medium text-foreground truncate">
                   {user?.name || 'User'}
                 </p>
                 <p className="text-xs text-muted-foreground truncate">
                   {user?.role || 'Staff'}
                 </p>
               </div>
             </div>
           </div>
         )}
       </div>
     </aside>
     {/* Mobile Overlay */}
     <div className={`lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30 transition-opacity duration-300 ${
       isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
     }`} onClick={onToggle} />
   </>
 );
};

export default Sidebar;
