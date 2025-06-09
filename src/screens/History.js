// src/screens/HistoryScreen.js
import React, { useState, useEffect, useCallback } from 'react';
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
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Filter,
  Search,
  BarChart3,
  Trophy,
  Target,
  ChevronRight,
  Download,
  Trash2
} from 'lucide-react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Utility functions
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const InterviewHistoryItem = ({ interview, onPress, onDelete }) => {
  const difficultyColor = getDifficultyColor(interview.difficulty);
  const scoreColor = getScoreColor(interview.totalScore);
  
  return (
    <TouchableOpacity style={styles.historyItem} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.historyContent}>
        <View style={styles.historyLeft}>
          <View style={styles.roleHeader}>
            <Text style={styles.jobRole}>
              {interview.jobRole?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Interview'}
            </Text>
            <View style={[styles.difficultyBadge, { backgroundColor: `${difficultyColor}20` }]}>
              <Text style={[styles.difficultyText, { color: difficultyColor }]}>
                {interview.difficulty}
              </Text>
            </View>
          </View>
          
          <View style={styles.historyMeta}>
            <View style={styles.metaItem}>
              <Calendar size={14} color="#64748b" />
              <Text style={styles.metaText}>{formatDate(interview.createdAt)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={14} color="#64748b" />
              <Text style={styles.metaText}>{interview.duration} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Target size={14} color="#64748b" />
              <Text style={styles.metaText}>{interview.questionsCount} questions</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.historyRight}>
          <View style={[styles.scoreContainer, { borderColor: scoreColor }]}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>
              {interview.totalScore?.toFixed(1)}
            </Text>
            <Text style={styles.scoreLabel}>/ 10</Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
          {/* Delete Button */}
          <TouchableOpacity onPress={() => onDelete(interview.id)} style={{ marginLeft: 8 }}>
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const StatsSummary = ({ stats }) => (
  <View style={styles.statsContainer}>
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.statsGradient}
    >
      <Text style={styles.statsTitle}>Your Interview Journey</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalInterviews}</Text>
          <Text style={styles.statLabel}>Total Sessions</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.averageScore?.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Avg Score</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.bestScore?.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Best Score</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>+{stats.improvementRate?.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Growth</Text>
        </View>
      </View>
    </LinearGradient>
  </View>
);

const HistoryScreen = ({ navigation }) => {
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    bestScore: 0,
    improvementRate: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, recent, best

  const loadHistoryData = useCallback(async () => {
    try {
      const existing = await AsyncStorage.getItem('interviewHistory');
      const history = existing ? JSON.parse(existing) : [];
      setInterviews(history);

      // Calculate stats
      if (history.length > 0) {
        const totalScore = history.reduce((sum, interview) => sum + (interview.totalScore || 0), 0);
        const avgScore = totalScore / history.length;
        const bestScore = Math.max(...history.map(i => i.totalScore || 0));
        setStats({
          totalInterviews: history.length,
          averageScore: avgScore,
          bestScore: bestScore,
          improvementRate: 0, // Calculate if needed
        });
      } else {
        setStats({
          totalInterviews: 0,
          averageScore: 0,
          bestScore: 0,
          improvementRate: 0,
        });
      }
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Error', 'Failed to load interview history');
    }
  }, []);

  useEffect(() => {
    loadHistoryData();
  }, [loadHistoryData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistoryData();
    setRefreshing(false);
  }, [loadHistoryData]);

  const handleInterviewPress = useCallback((interview) => {
    navigation.navigate('InterviewDetails', { 
      interviewId: interview.id,
      interview: interview 
    });
  }, [navigation]);

  const handleTabPress = useCallback((tabName) => {
    switch (tabName) {
      case 'Home':
        navigation.navigate('Home');
        break;
      case 'Practice':
        navigation.navigate('JobSelection');
        break;
      case 'Profile':
        navigation.navigate('Profile');
        break;
      default:
        break;
    }
  }, [navigation]);

  const handleFilter = useCallback((filterType) => {
    setFilter(filterType);
    // Apply filter logic here
  }, []);

  const handleExportData = useCallback(() => {
    Alert.alert('Export Data', 'Export functionality coming soon!');
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDeleteInterview = useCallback(async (id) => {
    Alert.alert(
      'Delete Interview',
      'Are you sure you want to delete this interview?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            const existing = await AsyncStorage.getItem('interviewHistory');
            let history = existing ? JSON.parse(existing) : [];
            history = history.filter(item => item.id !== id);
            await AsyncStorage.setItem('interviewHistory', JSON.stringify(history));
            setInterviews(history);
          } catch (e) {
            Alert.alert('Error', 'Failed to delete interview.');
          }
        }},
      ]
    );
  }, []);

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
            <Text style={styles.headerTitle}>Interview History</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Summary */}
        <StatsSummary stats={stats} />

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Text style={styles.sectionTitle}>Interview Sessions</Text>
            <TouchableOpacity 
              style={styles.exportButton}
              onPress={handleExportData}
            >
              <Download size={16} color="#667eea" />
              <Text style={styles.exportText}>Export</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterButtons}>
            {['all', 'recent', 'best'].map((filterType) => (
              <TouchableOpacity
                key={filterType}
                style={[
                  styles.filterButton,
                  filter === filterType && styles.activeFilterButton
                ]}
                onPress={() => handleFilter(filterType)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filter === filterType && styles.activeFilterButtonText
                ]}>
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* History List */}
        <View style={styles.historySection}>
          {interviews.length > 0 ? (
            interviews.map((interview) => (
              <InterviewHistoryItem
                key={interview.id}
                interview={interview}
                onPress={() => handleInterviewPress(interview)}
                onDelete={handleDeleteInterview}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <BarChart3 size={48} color="#94a3b8" />
              <Text style={styles.emptyTitle}>No Interview History</Text>
              <Text style={styles.emptySubtitle}>
                Start practicing to build your interview history
              </Text>
              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => navigation.navigate('JobSelection')}
              >
                <Text style={styles.startButtonText}>Start First Interview</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <Footer
        activeTab="History"
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    paddingTop: 40, // Extra padding for status bar
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
  statsContainer: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statsGradient: {
    padding: 24,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#e2e8f0',
    marginTop: 4,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  exportText: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  filterButtons: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeFilterButton: {
    backgroundColor: '#667eea',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeFilterButtonText: {
    color: '#ffffff',
  },
  historySection: {
    paddingHorizontal: 20,
  },
  historyItem: {
    backgroundColor: '#ffffff',
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  historyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLeft: {
    flex: 1,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobRole: {
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
  historyMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  historyRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 80,
  },
});

export default HistoryScreen;