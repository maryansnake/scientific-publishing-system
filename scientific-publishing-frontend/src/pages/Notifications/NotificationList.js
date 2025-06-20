import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, CircularProgress, Alert,
  List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction,
  IconButton, Divider, Paper, Tabs, Tab, Badge
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Delete as DeleteIcon,
  DoneAll as DoneAllIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { AuthContext } from '../../context/AuthContext';
import NotificationService from '../../services/notification.service';

const NotificationList = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      try {
        const params = { userId: currentUser.id };
        if (tabValue === 1) {
          params.unreadOnly = true;
        }
        
        const response = await NotificationService.getNotifications(params);
        setNotifications(response.data);
        
        const countResponse = await NotificationService.getUnreadCount(currentUser.id);
        setUnreadCount(countResponse);
      } catch (err) {
        setError('Failed to load notifications. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [currentUser, navigate, tabValue]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await NotificationService.markAsRead(notification.id);
        
        // Update the notification in the state
        setNotifications(prevNotifications => 
          prevNotifications.map(n => 
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Navigate to the relevant page if there's a link URL
      if (notification.linkUrl) {
        navigate(notification.linkUrl);
      }
    } catch (err) {
      toast.error('Failed to mark notification as read');
      console.error(err);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead(currentUser.id);
      
      // Update all notifications in the state
      setNotifications(prevNotifications => 
        prevNotifications.map(n => ({ ...n, isRead: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
      
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all notifications as read');
      console.error(err);
    }
  };
  
  const handleDeleteNotification = async (id, event) => {
    event.stopPropagation();
    try {
      await NotificationService.deleteNotification(id);
      
      // Remove the notification from the state
      setNotifications(prevNotifications => 
        prevNotifications.filter(n => n.id !== id)
      );
      
      toast.success('Notification deleted');
    } catch (err) {
      toast.error('Failed to delete notification');
      console.error(err);
    }
  };
  
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'submission':
        return <FileUploadIcon color="primary" />;
      case 'review_assignment':
        return <AssignmentIcon color="secondary" />;
      case 'review_completed':
        return <AssignmentTurnedInIcon color="success" />;
      case 'article_status_change':
        return <UpdateIcon color="info" />;
      case 'issue_published':
        return <MenuBookIcon color="primary" />;
      case 'account':
        return <PersonIcon />;
      case 'system':
      default:
        return <NotificationsIcon />;
    }
  };
  
  if (loading && notifications.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Notifications</Typography>
        {unreadCount > 0 && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<DoneAllIcon />}
            onClick={handleMarkAllAsRead}
          >
            Mark All as Read
          </Button>
        )}
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="notification tabs">
            <Tab label="All" />
            <Tab 
              label={
                <Badge badgeContent={unreadCount} color="error">
                  Unread
                </Badge>
              } 
            />
          </Tabs>
        </Box>
      </Paper>
      
      {notifications.length === 0 ? (
        <Alert severity="info">
          {tabValue === 0 
            ? 'You have no notifications.' 
            : 'You have no unread notifications.'}
        </Alert>
      ) : (
        <List>
          {notifications.map((notification) => (
            <Paper 
              key={notification.id} 
              sx={{ 
                mb: 2,
                bgcolor: notification.isRead ? 'background.paper' : 'action.hover'
              }}
            >
              <ListItem 
                button 
                onClick={() => handleNotificationClick(notification)}
              >
                <ListItemIcon>
                  {notification.isRead 
                    ? getNotificationIcon(notification.type)
                    : <NotificationsActiveIcon color="error" />
                  }
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography 
                      variant="subtitle1" 
                      sx={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block">
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={(e) => handleDeleteNotification(notification.id, e)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Container>
  );
};

export default NotificationList;