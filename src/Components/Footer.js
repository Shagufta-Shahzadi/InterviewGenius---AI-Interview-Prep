// src/components/Footer.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const Footer = ({
  backgroundColor = '#F8FAFC',
  activeColor = '#6366F1',
  inactiveColor = '#64748B',
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const activeTab = route.name;

  const tabs = [
    {
      name: 'Home',
      icon: 'home',
      iconOutline: 'home-outline',
      label: 'Home',
      screenName: 'Home',
    },
    {
      name: 'Practice',
      icon: 'school',
      iconOutline: 'school-outline',
      label: 'Practice',
      screenName: 'JobSelection', // Navigate to job selection for practice
    },
    {
      name: 'History',
      icon: 'bar-chart',
      iconOutline: 'bar-chart-outline',
      label: 'History',
      screenName: 'History', // You'll need to create this screen
    },
    {
      name: 'Settings',
      icon: 'settings',
      iconOutline: 'settings-outline',
      label: 'Settings',
      screenName: 'Settings',
    },
  ];

  const handleTabPress = (screenName, tabName) => {
    try {
      // Prevent navigation if already on the same screen
      if (activeTab === screenName) {
        return;
      }

      // Handle special navigation cases
      switch (screenName) {
        case 'Home':
          navigation.navigate('Home');
          break;
        case 'JobSelection':
          navigation.navigate('JobSelection');
          break;
        case 'History':
          // Navigate to History screen (you'll need to add this to your navigator)
          navigation.navigate('History');
          break;
        case 'Settings':
          navigation.navigate('Settings');
          break;
        default:
          navigation.navigate(screenName);
      }
    } catch (error) {
      console.warn(`Navigation error for ${screenName}:`, error);
      // Fallback navigation
      navigation.navigate(screenName);
    }
  };

  const TabItem = ({ tab, isActive }) => (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={() => handleTabPress(tab.screenName, tab.name)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.tabIconContainer,
        isActive && { backgroundColor: activeColor + '15' }
      ]}>
        <Icon
          name={isActive ? tab.icon : tab.iconOutline}
          size={22}
          color={isActive ? activeColor : inactiveColor}
        />
      </View>
      <Text
        style={[
          styles.tabLabel,
          {
            color: isActive ? activeColor : inactiveColor,
            fontWeight: isActive ? '600' : '500'
          }
        ]}
        numberOfLines={1}
      >
        {tab.label}
      </Text>
    </TouchableOpacity>
  );

  // Don't show footer on certain screens
  const hideFooterScreens = ['Login', 'Register', 'Interview', 'Result'];
  if (hideFooterScreens.includes(activeTab)) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.footerWrapper, { backgroundColor }]}>
      <View style={[styles.container, { backgroundColor }]}>
        {tabs.map((tab) => (
          <TabItem
            key={tab.name}
            tab={tab}
            isActive={activeTab === tab.screenName}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopWidth: 0.5,
    borderTopColor: '#E2E8F0',
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    height: 80,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default Footer;