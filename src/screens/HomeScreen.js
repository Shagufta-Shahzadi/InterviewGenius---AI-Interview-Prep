// src/screens/HomeScreen.js
import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Briefcase, 
  Star, 
  Trophy, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Clock, 
  Lightbulb,
  ArrowRight,
  Play,
  ChevronRight
} from 'lucide-react-native';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Define utility functions at the top level, before any component definitions
const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Beginner': return '#10B981';
    case 'Intermediate': return '#F59E0B';
    case 'Advanced': return '#EF4444';
    case 'Expert': return '#8B5CF6';
    default: return '#6B7280';
  }
};

const getScoreColor = (score) => {
  if (score >= 8) return '#10B981';
  if (score >= 6) return '#F59E0B';
  return '#EF4444';
};

// Memoized components
const StatCard = memo(({ title, value, subtitle, color = '#667eea', IconComponent, trend }) => (
  <View style={[styles.statCard, { borderTopColor: color }]}>
    <View style={styles.statHeader}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <IconComponent size={18} color={color} />
      </View>
      {trend && trend > 0 && (
        <View style={[styles.trendIndicator, { backgroundColor: trend > 0 ? '#10B981' : '#EF4444' }]}>
          <TrendingUp size={10} color="#ffffff" />
        </View>
      )}
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
    {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
  </View>
));

const RecentInterviewItem = memo(({ interview, onPress }) => {
  const difficultyColor = getDifficultyColor(interview.difficulty);
  const scoreColor = getScoreColor(interview.totalScore);
  
  return (
    <TouchableOpacity style={styles.interviewItem} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.interviewContent}>
        <View style={styles.interviewLeft}>
          <View style={styles.roleContainer}>
            <Text style={styles.interviewRole}>
              {interview.jobRole?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Interview'}
            </Text>
            <View style={[styles.difficultyBadge, { backgroundColor: `${difficultyColor}20` }]}>
              <Text style={[styles.difficultyText, { color: difficultyColor }]}>
                {interview.difficulty}
              </Text>
            </View>
          </View>
          <View style={styles.interviewMeta}>
            <Text style={styles.interviewDate}>
              {new Date(interview.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
            <View style={styles.durationContainer}>
              <Clock size={12} color="#64748b" />
              <Text style={styles.duration}>{interview.duration}min</Text>
            </View>
          </View>
        </View>
        <View style={styles.interviewRight}>
          <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
            <Text style={[styles.interviewScore, { color: scoreColor }]}>
              {interview.totalScore?.toFixed(1) || '0.0'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const HomeScreen = ({ navigation }) => {
  // State management - Initialize with empty/zero values
  const [userStats, setUserStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    bestScore: 0,
    improvementRate: 0,
  });
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate improvement rate based on recent interviews
  const calculateImprovementRate = (interviews) => {
    if (interviews.length < 2) return 0;
    
    // Sort interviews by date (newest first)
    const sortedInterviews = [...interviews].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    // Get last 3 interviews vs previous 3 interviews
    const recentCount = Math.min(3, Math.floor(sortedInterviews.length / 2));
    const olderCount = Math.min(3, sortedInterviews.length - recentCount);
    
    if (recentCount === 0 || olderCount === 0) return 0;
    
    const recentAvg = sortedInterviews.slice(0, recentCount)
      .reduce((sum, interview) => sum + (interview.totalScore || 0), 0) / recentCount;
    
    const olderAvg = sortedInterviews.slice(-olderCount)
      .reduce((sum, interview) => sum + (interview.totalScore || 0), 0) / olderCount;
    
    if (olderAvg === 0) return 0;
    
    return ((recentAvg - olderAvg) / olderAvg) * 100;
  };

  // Load user data from AsyncStorage - ONLY real data
  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get interview history from AsyncStorage
      const existing = await AsyncStorage.getItem('interviewHistory');
      const history = existing ? JSON.parse(existing) : [];

      // Validate and filter only complete interviews
      const validInterviews = history.filter(interview => 
        interview && 
        interview.id && 
        interview.totalScore !== undefined && 
        interview.totalScore !== null &&
        interview.createdAt &&
        interview.jobRole &&
        interview.difficulty
      );

      // Sort by date (newest first)
      const sortedInterviews = validInterviews.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setRecentInterviews(sortedInterviews);

      // Calculate stats ONLY from real user data
      if (sortedInterviews.length > 0) {
        const totalScore = sortedInterviews.reduce((sum, interview) => sum + interview.totalScore, 0);
        const avgScore = totalScore / sortedInterviews.length;
        const bestScore = Math.max(...sortedInterviews.map(i => i.totalScore));
        const improvementRate = calculateImprovementRate(sortedInterviews);

        setUserStats({
          totalInterviews: sortedInterviews.length,
          averageScore: avgScore,
          bestScore: bestScore,
          improvementRate: improvementRate,
        });
      } else {
        // Reset to zero if no interviews found
        setUserStats({
          totalInterviews: 0,
          averageScore: 0,
          bestScore: 0,
          improvementRate: 0,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
      
      // Reset to empty state on error
      setUserStats({
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        improvementRate: 0,
      });
      setRecentInterviews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Focus listener to refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDashboardData();
    });

    return unsubscribe;
  }, [navigation, loadDashboardData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, [loadDashboardData]);

  // Event handlers
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

  const handleMenuPress = useCallback(() => {
    navigation.openDrawer()
  }, [navigation]);

  const handleNotificationPress = useCallback(() => {
    console.log('Notifications pressed');
  }, []);

  const handleTabPress = useCallback((tabName) => {
    switch (tabName) {
      case 'Practice':
        navigation.navigate('JobSelection');
        break;
      case 'History':
        navigation.navigate('History');
        break;
      case 'Profile':
        navigation.navigate('Profile');
        break;
      default:
        break;
    }
  }, [navigation]);

  const handleInterviewPress = useCallback((interview) => {
    navigation.navigate('InterviewDetails', { interviewId: interview.id });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      <Header
        title="InterviewGenius"
        showBackButton={false}
        showMenuButton={true}
        showNotification={true}
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Target size={48} color="#ffffff" />
            <Text style={styles.heroTitle}>Ready to Excel?</Text>
            <Text style={styles.heroSubtitle}>
              Master your next interview with AI-powered practice sessions
            </Text>
            {userStats.totalInterviews > 0 ? (
              <Text style={styles.heroStats}>
                You've completed {userStats.totalInterviews} interview{userStats.totalInterviews > 1 ? 's' : ''} so far!
              </Text>
            ) : (
              <Text style={styles.heroStats}>
                Start your journey to interview success
              </Text>
            )}
            
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => handleTabPress('Practice')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                style={styles.ctaGradient}
              >
                <Play size={20} color="#667eea" />
                <Text style={styles.ctaButtonText}>
                  {userStats.totalInterviews > 0 ? 'Practice Again' : 'Start First Interview'}
                </Text>
                <ArrowRight size={20} color="#667eea" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Statistics Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Performance</Text>
            {userStats.totalInterviews > 0 && (
              <TouchableOpacity 
                style={styles.insightButton}
                onPress={() => handleTabPress('History')}
              >
                <Text style={styles.insightText}>View Insights</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Sessions"
              value={userStats.totalInterviews.toString()}
              IconComponent={Briefcase}
              color="#667eea"
              trend={userStats.totalInterviews > 0 ? 1 : 0}
            />
            <StatCard
              title="Average Score"
              value={userStats.averageScore.toFixed(1)}
              subtitle="out of 10"
              IconComponent={Star}
              color="#10B981"
              trend={userStats.improvementRate > 0 ? 1 : 0}
            />
            <StatCard
              title="Best Performance"
              value={userStats.bestScore.toFixed(1)}
              subtitle="personal record"
              IconComponent={Trophy}
              color="#F59E0B"
            />
            <StatCard
              title="Growth Rate"
              value={userStats.improvementRate > 0 ? `+${userStats.improvementRate.toFixed(1)}%` : '0%'}
              subtitle="improvement"
              IconComponent={TrendingUp}
              color="#8B5CF6"
              trend={userStats.improvementRate}
            />
          </View>
        </View>

        {/* Recent Interviews Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            {recentInterviews.length > 3 && (
              <TouchableOpacity onPress={() => handleTabPress('History')}>
                <View style={styles.viewAllContainer}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <ChevronRight size={16} color="#667eea" />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {recentInterviews.length > 0 ? (
            <View style={styles.interviewsList}>
              {recentInterviews.slice(0, 3).map((interview) => (
                <RecentInterviewItem 
                  key={interview.id} 
                  interview={interview} 
                  onPress={() => handleInterviewPress(interview)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Target size={48} color="#94a3b8" />
              <Text style={styles.emptyTitle}>Start Your Journey</Text>
              <Text style={styles.emptySubtitle}>
                Complete your first AI interview session to track your progress and see detailed analytics
              </Text>
              <TouchableOpacity 
                style={styles.emptyButton} 
                onPress={() => handleTabPress('Practice')}
              >
                <Text style={styles.emptyButtonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleTabPress('Practice')}
              activeOpacity={0.8}
            >
              <View style={styles.actionContent}>
                <Target size={24} color="#667eea" />
                <Text style={styles.actionTitle}>Practice Now</Text>
                <Text style={styles.actionSubtitle}>
                  {userStats.totalInterviews > 0 ? 'Continue practicing' : 'Start interview session'}
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleTabPress('History')}
              activeOpacity={0.8}
            >
              <View style={styles.actionContent}>
                <BarChart3 size={24} color="#667eea" />
                <Text style={styles.actionTitle}>
                  {userStats.totalInterviews > 0 ? 'View Analytics' : 'View History'}
                </Text>
                <Text style={styles.actionSubtitle}>
                  {userStats.totalInterviews > 0 ? 'Check your progress' : 'Review past sessions'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Interview Tips</Text>
          <View style={styles.tipsCard}>
            <View style={styles.tipHeader}>
              <Lightbulb size={20} color="#10B981" />
              <Text style={styles.tipTitle}>Today's Tip</Text>
            </View>
            <Text style={styles.tipText}>
              Practice the STAR method (Situation, Task, Action, Result) for behavioral questions. 
              Our AI analyzes your responses for structure and clarity.
            </Text>
            <TouchableOpacity style={styles.tipButton}>
              <Text style={styles.tipButtonText}>Learn More Tips</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <Footer
        activeTab="Home"
        onTabPress={handleTabPress}
        showBadge={recentInterviews.length > 0}
      />
    </View>
  );
};

// Styles remain the same as in your original code
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100,
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  greetingText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '400',
  },
  userNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 2,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  heroStats: {
    fontSize: 14,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 28,
    fontStyle: 'italic',
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  insightButton: {
    backgroundColor: '#667eea20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  insightText: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '600',
  },
  viewAllText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderTopWidth: 4,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  interviewsList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  interviewItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  interviewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interviewLeft: {
    flex: 1,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  interviewRole: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  interviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interviewDate: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 12,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  interviewRight: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  interviewScore: {
    fontSize: 14,
    fontWeight: '800',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginHorizontal: 6,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionContent: {
    padding: 20,
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 8,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  tipsCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 40,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  tipButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#10B98120',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tipButtonText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 80,
  },
});

export default HomeScreen;