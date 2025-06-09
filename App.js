import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import your screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import Footer from './src/Components/Footer';
import JobSelectionScreen from './src/screens/JobSelectionScreen';
import InterviewScreen from './src/screens/InterviewScreen';
import ResultScreen from './src/screens/ResultScreen';
import HistoryScreen from './src/screens/History';
import Profile from './src/screens/Profile';
import InterviewDetails from './src/screens/InterviewDetails';
import Settings from './src/screens/Settings';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Create a stack navigator for auth screens (Splash, Login, Signup)
const AuthStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignUpScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
       <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
};

// Custom Drawer Content
const CustomDrawerContent = ({ navigation }) => {
  const menuItems = [
    { name: 'Home', icon: 'home', screen: 'Home' },
    { name: 'Job Selection', icon: 'work', screen: 'JobSelection' },
    { name: 'Interview', icon: 'mic', screen: 'Interview' },
    { name: 'Results', icon: 'assessment', screen: 'Result' },
    { name: 'History', icon: 'history', screen: 'History' },
    { name: 'Profile', icon: 'person', screen: 'Profile' },
    { name: 'Interview Details', icon: 'description', screen: 'InterviewDetails' },
    { name: 'Settings', icon: 'settings', screen: 'Settings' },
  ];

  return (
    <View style={styles.drawerContainer}>
      {/* Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.profileImageContainer}>
          <Icon name="person" size={40} color="#6366F1" />
        </View>
        <Text style={styles.drawerTitle}>InterviewGenius</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Icon name={item.icon} size={24} color="#6366F1" />
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// FIXED: Remove Header from these wrapper components and let each screen handle it internally
const HomeScreenWithLayout = ({ navigation }) => (
  <View style={{ flex: 1 }}>
    <HomeScreen navigation={navigation} />
    <Footer navigation={navigation} />
  </View>
);

const JobSelectionScreenWithLayout = ({ navigation }) => (
  <View style={{ flex: 1 }}>
    <JobSelectionScreen navigation={navigation} />
  </View>
);

const InterviewScreenWithLayout = (props) => (
  <InterviewScreen {...props} />
);

const ResultScreenWithLayout = (props) => (
  <View style={{ flex: 1 }}>
    <ResultScreen {...props} />
  </View>
);

const HistoryScreenWithLayout = ({ navigation }) => (
  <View style={{ flex: 1 }}>
    <HistoryScreen navigation={navigation} />
    <Footer navigation={navigation} />
  </View>
);

const ProfileScreenWithLayout = ({ navigation }) => (
  <View style={{ flex: 1 }}>
    <Profile navigation={navigation} />
    <Footer navigation={navigation} />
  </View>
);

const InterviewDetailsWithLayout = (props) => (
  <InterviewDetails {...props} />
);

const SettingsScreenWithLayout = ({ navigation }) => (
  <View style={{ flex: 1 }}>
    <Settings navigation={navigation} />
  </View>
);

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar 
            barStyle="light-content" 
            backgroundColor="transparent" 
            translucent 
          />
          
          <Drawer.Navigator
            initialRouteName="Auth"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
              headerShown: false, // Hide Drawer default header
              drawerStyle: {
                backgroundColor: '#fff',
                width: 280,
              },
            }}
          >
            {/* Auth Stack - Hidden from drawer */}
            <Drawer.Screen 
              name="Auth" 
              component={AuthStack} 
              options={{
                drawerItemStyle: { display: 'none' },
                headerShown: false,
              }}
            />

            {/* Main App Screens */}
            <Drawer.Screen 
              name="Home" 
              component={HomeScreenWithLayout}
              options={{ 
                title: 'Home'
              }}
            />
            
            <Drawer.Screen 
              name="JobSelection" 
              component={JobSelectionScreenWithLayout}
              options={{ 
                title: 'Job Selection'
              }}
            />

            <Drawer.Screen 
              name="Interview" 
              component={InterviewScreen}
            />

            <Drawer.Screen 
              name="Result" 
              component={ResultScreen}
            />

            <Drawer.Screen 
              name="History" 
              component={HistoryScreenWithLayout}
              options={{ 
                title: 'History'
              }}
            />

            <Drawer.Screen 
              name="Profile" 
              component={ProfileScreenWithLayout}
              options={{ 
                title: 'Profile'
              }}
            />

            <Drawer.Screen 
              name="InterviewDetails" 
              component={InterviewDetailsWithLayout}
              options={{ 
                title: 'Interview Details'
              }}
            />
   
            <Drawer.Screen 
              name="Settings" 
              component={SettingsScreenWithLayout}
              options={{ 
                title: 'Settings'
              }}
            />

          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    backgroundColor: '#6366F1',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  drawerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  drawerSubtitle: {
    color: '#E0E7FF',
    fontSize: 14,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
});

export default App;