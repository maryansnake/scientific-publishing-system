import React, { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Drawer, 
  List, ListItem, ListItemIcon, ListItemText, Box, 
  Divider, Avatar, Badge, Menu, MenuItem 
} from '@mui/material';
import { 
  Menu as MenuIcon, Home, LibraryBooks, School, AccountCircle, 
  Notifications, People, Settings, ExitToApp 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import NotificationService from '../../services/notification.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info('You have been logged out');
  };
  
  // Get notification count when component mounts
  React.useEffect(() => {
    const fetchNotifications = async () => {
      if (currentUser) {
        try {
          const {count} = await NotificationService.getUnreadCount(currentUser.id);
          setNotificationCount(count);    
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      }
    };
    
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [currentUser]);
  
  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Journals', icon: <LibraryBooks />, path: '/journals' },
    { text: 'My Articles', icon: <School />, path: '/my-articles' },
  ];
  
  if (currentUser?.roles?.includes('editor') || currentUser?.roles?.includes('admin')) {
    menuItems.push(
      { text: 'Review Management', icon: <People />, path: '/reviews' }
    );
  }
  
  if (currentUser?.roles?.includes('admin')) {
    menuItems.push(
      { text: 'User Management', icon: <People />, path: '/users' },
      { text: 'Settings', icon: <Settings />, path: '/settings' }
    );
  }
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Scientific Publishing System
          </Typography>
          
          {currentUser ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" onClick={() => navigate('/notifications')}>
                <Badge badgeContent={notificationCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleProfileMenuOpen}
              >
                <Avatar 
                  alt={`${currentUser.firstName} ${currentUser.lastName}`}
                  src={currentUser.avatar}
                  sx={{ width: 32, height: 32 }}
                >
                  {currentUser.firstName ? currentUser.firstName[0] : 'U'}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { 
                  navigate('/profile'); 
                  handleMenuClose(); 
                }}>
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </MenuItem>
                
                <Divider />
                
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToApp fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box>
              <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
              <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ width: 240 }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6">
              Scientific Publishing
            </Typography>
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem 
                // button 
                key={item.text} 
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            
            {currentUser && (
              <ListItem button onClick={handleLogout}>
                <ListItemIcon><ExitToApp /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
        <Outlet />
      </Box>
      
      <Box component="footer" sx={{ p: 2, textAlign: 'center', mt: 'auto' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Scientific Publishing System
        </Typography>
      </Box>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Box>
  );
};

export default MainLayout;