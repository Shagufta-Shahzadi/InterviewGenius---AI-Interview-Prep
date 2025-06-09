// src/screens/Profile.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  StatusBar,
  RefreshControl,
  Image,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Target,
  Settings,
  Edit3,
  Save,
  X,
  Camera,
  Award,
  TrendingUp,
  Clock,
  Star,
  LogOut,
  Shield,
  Bell,
} from 'lucide-react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const Profile = ({ navigation }) => {
  // State management
  const [user, setUser] = useState({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: '2024-01-15',
    avatar: null,
    totalInterviews: 12,
    averageScore: 7.8,
    bestScore: 9.2,
    improvementRate: 15.3,
    favoriteRole: 'Software Engineer',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [refreshing, setRefreshing] = useState(false);
  const [achievements, setAchievements] = useState([]);

  // Load user data and achievements
  const loadUserData = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set achievements
      setAchievements([
        {
          id: '1',
          title: 'First Interview',
          description: 'Completed your first practice session',
          icon: 'target',
          earned: true,
          earnedDate: '2024-01-15',
        },
        {
          id: '2',
          title: 'High Scorer',
          description: 'Achieved a score above 8.0',
          icon: 'star',
          earned: true,
          earnedDate: '2024-01-20',
        },
        {
          id: '3',
          title: 'Consistent Performer',
          description: 'Complete 10 interviews',
          icon: 'trophy',
          earned: true,
          earnedDate: '2024-02-01',
        },
        {
          id: '4',
          title: 'Expert Level',
          description: 'Achieve average score of 9.0+',
          icon: 'award',
          earned: false,
          progress: 78,
        },
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  }, [loadUserData]);

  // Event handlers
  const handleEdit = useCallback(() => {
    setEditedUser({ ...user });
    setIsEditing(true);
  }, [user]);

  const handleCancel = useCallback(() => {
    setEditedUser({ ...user });
    setIsEditing(false);
  }, [user]);

  const handleSave = useCallback(async () => {
    try {
      // Validate input
      if (!editedUser.name.trim()) {
        Alert.alert('Error', 'Name cannot be empty');
        return;
      }

      if (!editedUser.email.trim()) {
        Alert.alert('Error', 'Email cannot be empty');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser({ ...editedUser });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  }, [editedUser]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  }, [navigation]);

  const handleTabPress = useCallback((tabName) => {
    switch (tabName) {
      case 'Home':
        navigation.navigate('Home');
        break;
      case 'Practice':
        navigation.navigate('JobSelection');
        break;
      case 'History':
        navigation.navigate('History');
        break;
      default:
        break;
    }
  }, [navigation]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAchievementIcon = (iconName) => {
    const iconProps = { size: 20, color: '#667eea' };
    switch (iconName) {
      case 'target': return <Target {...iconProps} />;
      case 'star': return <Star {...iconProps} />;
      case 'trophy': return <Trophy {...iconProps} />;
      case 'award': return <Award {...iconProps} />;
      default: return <Trophy {...iconProps} />;
    }
  };

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
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileHeader}
        >
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={40} color="#ffffff" />
              </View>
            )}
            {isEditing && (
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={16} color="#ffffff" />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.profileInfo}>
            {isEditing ? (
              <TextInput
                style={styles.nameInput}
                value={editedUser.name}
                onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
                placeholder="Enter your name"
                placeholderTextColor="#cbd5e1"
              />
            ) : (
              <Text style={styles.userName}>{user.name}</Text>
            )}
            
            {isEditing ? (
              <TextInput
                style={styles.emailInput}
                value={editedUser.email}
                onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
                placeholder="Enter your email"
                placeholderTextColor="#cbd5e1"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.userEmail}>{user.email}</Text>
            )}
            
            <View style={styles.joinDateContainer}>
              <Calendar size={14} color="#cbd5e1" />
              <Text style={styles.joinDate}>Joined {formatDate(user.joinDate)}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Statistics Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Target size={20} color="#667eea" />
              </View>
              <Text style={styles.statValue}>{user.totalInterviews}</Text>
              <Text style={styles.statLabel}>Total Sessions</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Star size={20} color="#10B981" />
              </View>
              <Text style={styles.statValue}>{user.averageScore?.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Average Score</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Trophy size={20} color="#F59E0B" />
              </View>
              <Text style={styles.statValue}>{user.bestScore?.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Best Score</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <TrendingUp size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.statValue}>+{user.improvementRate?.toFixed(1)}%</Text>
              <Text style={styles.statLabel}>Growth Rate</Text>
            </View>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          
          <View style={styles.achievementsList}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  !achievement.earned && styles.achievementCardLocked
                ]}
              >
                <View style={styles.achievementLeft}>
                  <View style={[
                    styles.achievementIcon,
                    { opacity: achievement.earned ? 1 : 0.5 }
                  ]}>
                    {getAchievementIcon(achievement.icon)}
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={[
                      styles.achievementTitle,
                      !achievement.earned && styles.achievementTitleLocked
                    ]}>
                      {achievement.title}
                    </Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                    {achievement.earned && (
                      <Text style={styles.earnedDate}>
                        Earned on {formatDate(achievement.earnedDate)}
                      </Text>
                    )}
                    {!achievement.earned && achievement.progress && (
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressFill,
                              { width: `${achievement.progress}%` }
                            ]} 
                          />
                        </View>
                        <Text style={styles.progressText}>{achievement.progress}%</Text>
                      </View>
                    )}
                  </View>
                </View>
                {achievement.earned && (
                  <View style={styles.achievementBadge}>
                    <Award size={16} color="#10B981" />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={20} color="#64748b" />
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <Text style={styles.settingValue}>Enabled</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Shield size={20} color="#64748b" />
                <Text style={styles.settingText}>Privacy</Text>
              </View>
              <Text style={styles.settingValue}>Public</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Settings size={20} color="#64748b" />
                <Text style={styles.settingText}>General Settings</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
              <View style={styles.settingLeft}>
                <LogOut size={20} color="#EF4444" />
                <Text style={[styles.settingText, { color: '#EF4444' }]}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <Footer
        activeTab="Profile"
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
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
  scrollView: {
    flex: 1,
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
  },
  cancelButton: {
    padding: 8,
    marginRight: 8,
  },
  saveButton: {
    padding: 8,
  },
  profileHeader: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff20',
    borderWidth: 3,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 8,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff40',
    paddingVertical: 4,
    marginBottom: 8,
    minWidth: 200,
  },
  emailInput: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff40',
    paddingVertical: 4,
    marginBottom: 8,
    minWidth: 250,
  },
  joinDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinDate: {
    fontSize: 14,
    color: '#cbd5e1',
    marginLeft: 6,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  achievementsList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: '#94a3b8',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  earnedDate: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  achievementBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B98120',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
    fontWeight: '600',
  },
  settingValue: {
    fontSize: 14,
    color: '#64748b',
  },
  bottomSpacing: {
    height: 80,
  },
});

export default Profile;