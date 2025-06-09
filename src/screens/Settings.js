// src/screens/SettingsScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  // Mock user data - replace with actual context when available
  const user = { name: 'John Doe', email: 'john@example.com' };
  
  // If you have AppContext set up, uncomment these lines:
  // const { user, logout } = useContext(AppContext);
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [practiceReminders, setPracticeReminders] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              
              // If using AppContext, call logout() here
              // logout();
              
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your interview data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement account deletion API call
            Alert.alert('Feature Coming Soon', 'Account deletion will be available in the next update.');
          },
        },
      ]
    );
  };

  // Handle clear data
  const handleClearData = () => {
    Alert.alert(
      'Clear Interview Data',
      'This will delete all your interview history and statistics. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Implement clear data API call
              Alert.alert('Success', 'Interview data cleared successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Settings section component
  const SettingsSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  // Settings item with switch
  const SettingsToggle = ({ icon, title, subtitle, value, onValueChange, iconColor = '#6366F1' }) => (
    <View style={styles.settingsItem}>
      <View style={styles.settingsItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
          <Icon name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.settingsTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        trackColor={{ false: '#E2E8F0', true: '#6366F1' }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
        ios_backgroundColor="#E2E8F0"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  // Settings item with arrow (navigation)
  const SettingsItem = ({ icon, title, subtitle, onPress, iconColor = '#6366F1', rightText, danger = false }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingsItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
          <Icon name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.settingsTitle, danger && { color: '#EF4444' }]}>{title}</Text>
          {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {rightText && <Text style={styles.rightText}>{rightText}</Text>}
        <Icon name="chevron-forward" size={20} color="#94A3B8" />
      </View>
    </TouchableOpacity>
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Icon name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <SettingsSection title="Profile">
          <SettingsItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your name and email"
            onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon.')}
            iconColor="#6366F1"
          />
          <SettingsItem
            icon="stats-chart-outline"
            title="View Statistics"
            subtitle="See your interview performance"
            onPress={() => navigation.navigate('Home')}
            iconColor="#10B981"
          />
        </SettingsSection>

        {/* App Preferences */}
        <SettingsSection title="App Preferences">
          <SettingsToggle
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Get notified about updates"
            value={notifications}
            onValueChange={setNotifications}
            iconColor="#F59E0B"
          />
          <SettingsToggle
            icon="alarm-outline"
            title="Practice Reminders"
            subtitle="Daily interview practice reminders"
            value={practiceReminders}
            onValueChange={setPracticeReminders}
            iconColor="#8B5CF6"
          />
          <SettingsToggle
            icon="volume-high-outline"
            title="Sound Effects"
            subtitle="Enable app sounds and feedback"
            value={soundEffects}
            onValueChange={setSoundEffects}
            iconColor="#06B6D4"
          />
          <SettingsToggle
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Use dark theme (Coming Soon)"
            value={darkMode}
            onValueChange={setDarkMode}
            iconColor="#64748B"
          />
          <SettingsToggle
            icon="save-outline"
            title="Auto-save Answers"
            subtitle="Automatically save draft answers"
            value={autoSave}
            onValueChange={setAutoSave}
            iconColor="#10B981"
          />
        </SettingsSection>

        {/* Interview Settings */}
        <SettingsSection title="Interview Settings">
          <SettingsItem
            icon="time-outline"
            title="Session Duration"
            subtitle="Set default interview length"
            rightText="15 min"
            onPress={() => Alert.alert('Coming Soon', 'Duration settings will be available soon.')}
            iconColor="#F59E0B"
          />
          <SettingsItem
            icon="library-outline"
            title="Question Difficulty"
            subtitle="Choose question complexity level"
            rightText="Medium"
            onPress={() => Alert.alert('Coming Soon', 'Difficulty settings will be available soon.')}
            iconColor="#8B5CF6"
          />
        </SettingsSection>

        {/* Support & Info */}
        <SettingsSection title="Support & Information">
          <SettingsItem
            icon="help-circle-outline"
            title="Help & FAQ"
            subtitle="Get answers to common questions"
            onPress={() => Alert.alert('Help', 'For support, contact us at support@interviewgenius.com')}
            iconColor="#06B6D4"
          />
          <SettingsItem
            icon="document-text-outline"
            title="Privacy Policy"
            subtitle="How we handle your data"
            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy will open in browser.')}
            iconColor="#64748B"
          />
          <SettingsItem
            icon="information-circle-outline"
            title="About InterviewGenius"
            subtitle="Version 1.0.0"
            onPress={() => Alert.alert('About', 'InterviewGenius v1.0.0\nBuilt with React Native\n\nHelping you ace your interviews!')}
            iconColor="#6366F1"
          />
        </SettingsSection>

        {/* Data & Privacy */}
        <SettingsSection title="Data & Privacy">
          <SettingsItem
            icon="download-outline"
            title="Export Data"
            subtitle="Download your interview history"
            onPress={() => Alert.alert('Coming Soon', 'Data export will be available soon.')}
            iconColor="#10B981"
          />
          <SettingsItem
            icon="trash-outline"
            title="Clear Interview Data"
            subtitle="Delete all interview history"
            onPress={handleClearData}
            iconColor="#F59E0B"
          />
        </SettingsSection>

        {/* Account Actions */}
        <SettingsSection title="Account">
          <SettingsItem
            icon="log-out-outline"
            title="Logout"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            iconColor="#EF4444"
            danger={true}
          />
          <SettingsItem
            icon="close-circle-outline"
            title="Delete Account"
            subtitle="Permanently delete your account"
            onPress={handleDeleteAccount}
            iconColor="#EF4444"
            danger={true}
          />
        </SettingsSection>

        {/* Add bottom padding for footer */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '400',
  },
  rightText: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 8,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 100, // Space for footer
  },
  header: {
    backgroundColor: '#6366F1',
    borderBottomWidth: 0.5,
    borderBottomColor: '#818CF8',
    elevation: 3,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 40,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginLeft: 40,
  },
});

export default SettingsScreen;