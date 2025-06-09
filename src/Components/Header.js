import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Header = ({ 
  title = "InterviewGenius", 
  showBackButton = false,
  showMenuButton = false,
  showNotification = false,
  onMenuPress,
  onNotificationPress,
  onBackPress,
  navigation 
}) => {
  
  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
    } else if (navigation) {
      navigation.openDrawer();
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.header}>
      {/* StatusBar color ab header ke same hai */}
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      <View style={styles.headerContent}>
        {/* Left Side */}
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={handleBackPress}
            >
              <Icon name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
          
          {showMenuButton && (
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={handleMenuPress}
            >
              <Icon name="menu" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
          
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Right Side */}
        <View style={styles.rightContainer}>
          {showNotification && (
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={handleNotificationPress}
            >
              <Icon name="notifications" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#6366F1', // Header color
    paddingTop: StatusBar.currentHeight || 44,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default Header;