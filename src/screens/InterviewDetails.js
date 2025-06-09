// src/screens/InterviewDetails.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  RefreshControl,
  Dimensions,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Clock,
  Calendar,
  Target,
  Star,
  Trophy,
  TrendingUp,
  CheckCircle,
  XCircle,
  MessageSquare,
  BarChart3,
  Download,
  Share2,
  RotateCcw,
  Home,
  ChevronRight,
  Lightbulb,
  Award,
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Play,
  FileText,
  Users,
  Brain,
} from 'lucide-react-native';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const InterviewDetails = ({ navigation, route }) => {
  const interviewId = route?.params?.interviewId;
  
  // State management
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Load interview details from AsyncStorage
  const loadInterviewDetails = useCallback(async () => {
    try {
      setLoading(true);

      // Get all interviews from AsyncStorage
      const existing = await AsyncStorage.getItem('interviewHistory');
      const history = existing ? JSON.parse(existing) : [];

      // Find the interview by id
      const found = history.find(i => i.id === interviewId);

      if (found) {
        setInterview(found);
      } else {
        Alert.alert('Not Found', 'Interview not found in your history.');
        setInterview(null);
      }

      // Animate fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

    } catch (error) {
      console.error('Error loading interview details:', error);
      Alert.alert('Error', 'Failed to load interview details');
    } finally {
      setLoading(false);
    }
  }, [interviewId, fadeAnim]);

  useEffect(() => {
    loadInterviewDetails();
  }, [loadInterviewDetails]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInterviewDetails();
    setRefreshing(false);
  }, [loadInterviewDetails]);

  // Helper functions
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
    if (score >= 8.5) return '#10B981';
    if (score >= 7) return '#F59E0B';
    if (score >= 5) return '#EF4444';
    return '#6B7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPerformanceLevel = (score) => {
    if (score >= 9) return { level: 'Excellent', color: '#10B981', icon: Trophy };
    if (score >= 8) return { level: 'Very Good', color: '#10B981', icon: Star };
    if (score >= 7) return { level: 'Good', color: '#F59E0B', icon: CheckCircle };
    if (score >= 5) return { level: 'Average', color: '#EF4444', icon: Target };
    return { level: 'Needs Improvement', color: '#6B7280', icon: AlertCircle };
  };

  // Event handlers
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
      case 'Profile':
        navigation.navigate('Profile');
        break;
      default:
        break;
    }
  }, [navigation]);

  const handleRetakeInterview = useCallback(() => {
    Alert.alert(
      'Retake Interview',
      'Are you sure you want to start a new interview session for this role?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Interview',
          onPress: () => {
            navigation.navigate('JobSelection', { 
              preselectedRole: interview?.jobRole 
            });
          },
        },
      ]
    );
  }, [navigation, interview]);

  const handleShareResults = useCallback(() => {
    Alert.alert(
      'Share Results',
      'Share your interview performance with others',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => console.log('Sharing results...') },
      ]
    );
  }, []);

  const handleDownloadReport = useCallback(() => {
    Alert.alert('Download Report', 'Feature coming soon!');
  }, []);

  const toggleQuestionExpansion = useCallback((questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  }, [expandedQuestion]);

  if (loading || !interview) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
        <Header 
          title="Interview Details" 
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Target size={48} color="#667eea" />
          <Text style={styles.loadingText}>Loading interview details...</Text>
        </View>
        <Footer activeTab="History" onTabPress={handleTabPress} />
      </View>
    );
  }

  const performanceLevel = getPerformanceLevel(interview.totalScore);
  const difficultyColor = getDifficultyColor(interview.difficulty);
  const scoreColor = getScoreColor(interview.totalScore);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      <Header 
        title="Interview Details" 
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={() => setShowFeedbackModal(true)}>
            <MessageSquare size={24} color="#ffffff" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header Section */}
          <LinearGradient
            colors={[scoreColor, `${scoreColor}80`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerSection}
          >
            <View style={styles.headerContent}>
              <View style={styles.scoreContainer}>
                <performanceLevel.icon size={32} color="#ffffff" />
                <Text style={styles.scoreValue}>{interview.totalScore.toFixed(1)}</Text>
                <Text style={styles.scoreMax}>/ {interview.maxScore}</Text>
              </View>
              <Text style={styles.performanceLevel}>{performanceLevel.level}</Text>
              <Text style={styles.roleName}>{interview.roleName}</Text>
              
              <View style={styles.metaInfo}>
                <View style={styles.metaItem}>
                  <Calendar size={16} color="#ffffff" />
                  <Text style={styles.metaText}>{formatDate(interview.completedAt)}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Clock size={16} color="#ffffff" />
                  <Text style={styles.metaText}>{interview.duration} minutes</Text>
                </View>
                <View style={styles.metaItem}>
                  <Target size={16} color="#ffffff" />
                  <Text style={[styles.metaText, { color: difficultyColor }]}>
                    {interview.difficulty}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* Quick Stats */}
          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <Brain size={20} color="#667eea" />
              <Text style={styles.statValue}>{Array.isArray(interview?.questions) ? interview.questions.length : 0}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statCard}>
              <Trophy size={20} color="#10B981" />
              <Text style={styles.statValue}>
                {interview.questions.filter(q => q.score >= 8).length}
              </Text>
              <Text style={styles.statLabel}>Excellent</Text>
            </View>
            <View style={styles.statCard}>
              <Clock size={20} color="#F59E0B" />
              <Text style={styles.statValue}>
                {Math.round(interview.questions.reduce((acc, q) => acc + q.timeSpent, 0) / interview.questions.length)}s
              </Text>
              <Text style={styles.statLabel}>Avg Time</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleRetakeInterview}>
              <RotateCcw size={18} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Retake Interview</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleShareResults}>
              <Share2 size={18} color="#667eea" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleDownloadReport}>
              <Download size={18} color="#667eea" />
            </TouchableOpacity>
          </View>

          {/* Questions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Question Analysis</Text>
            {Array.isArray(interview?.questions) && interview.questions.length > 0 ? (
              interview.questions.map((question, index) => (
                <View key={question.id} style={styles.questionCard}>
                  <TouchableOpacity 
                    style={styles.questionHeader}
                    onPress={() => toggleQuestionExpansion(question.id)}
                  >
                    <View style={styles.questionLeft}>
                      <View style={styles.questionNumber}>
                        <Text style={styles.questionNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.questionInfo}>
                        <Text style={styles.questionText} numberOfLines={2}>
                          {question.question}
                        </Text>
                        <View style={styles.questionMeta}>
                          <View style={[styles.scoreChip, { backgroundColor: getScoreColor(question.score) }]}>
                            <Text style={styles.scoreChipText}>{question.score.toFixed(1)}</Text>
                          </View>
                          <Text style={styles.timeText}>{formatDuration(question.timeSpent)}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.expandIcon}>
                      {expandedQuestion === question.id ? 
                        <ChevronUp size={20} color="#667eea" /> : 
                        <ChevronDown size={20} color="#667eea" />
                      }
                    </View>
                  </TouchableOpacity>

                  {expandedQuestion === question.id && (
                    <View style={styles.questionDetails}>
                      <View style={styles.answerSection}>
                        <Text style={styles.answerLabel}>Your Answer:</Text>
                        <Text style={styles.answerText}>{question.answer}</Text>
                      </View>

                      <View style={styles.feedbackSection}>
                        <Text style={styles.feedbackLabel}>AI Feedback:</Text>
                        <Text style={styles.feedbackText}>{question.feedback}</Text>
                      </View>

                      <View style={styles.insightsRow}>
                        <View style={styles.strengthsSection}>
                          <Text style={styles.insightLabel}>Strengths</Text>
                          {question.strengths.map((strength, idx) => (
                            <View key={idx} style={styles.insightItem}>
                              <CheckCircle size={14} color="#10B981" />
                              <Text style={styles.strengthText}>{strength}</Text>
                            </View>
                          ))}
                        </View>

                        <View style={styles.improvementsSection}>
                          <Text style={styles.insightLabel}>Improvements</Text>
                          {question.improvements.map((improvement, idx) => (
                            <View key={idx} style={styles.insightItem}>
                              <AlertCircle size={14} color="#F59E0B" />
                              <Text style={styles.improvementText}>{improvement}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )) 
            ) : (
              <Text>No questions found.</Text>
            )}
          </View>

          {/* Overall Feedback Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overall Performance</Text>
            <View style={styles.overallCard}>
              <Text style={styles.overallFeedback}>{interview.overallFeedback}</Text>
              
              <View style={styles.summaryGrid}>
                <View style={styles.summarySection}>
                  <Text style={styles.summaryTitle}>Key Strengths</Text>
                  {Array.isArray(interview.strengths) && interview.strengths.length > 0 ? (
                    interview.strengths.map((strength, index) => (
                      <View key={index} style={styles.summaryItem}>
                        <Star size={12} color="#10B981" />
                        <Text style={styles.summaryText}>{strength}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.summaryText}>No strengths found.</Text>
                  )}
                </View>

                <View style={styles.summarySection}>
                  <Text style={styles.summaryTitle}>Growth Areas</Text>
                  {Array.isArray(interview.improvementAreas) && interview.improvementAreas.length > 0 ? (
                    interview.improvementAreas.map((area, index) => (
                      <View key={index} style={styles.summaryItem}>
                        <TrendingUp size={12} color="#F59E0B" />
                        <Text style={styles.summaryText}>{area}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.summaryText}>No growth areas found.</Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Recommendations Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Recommendations</Text>
            <View style={styles.recommendationsCard}>
              <View style={styles.recommendationHeader}>
                <Lightbulb size={20} color="#667eea" />
                <Text style={styles.recommendationTitle}>Personalized Tips</Text>
              </View>
              {Array.isArray(interview.recommendations) && interview.recommendations.length > 0 ? (
                interview.recommendations.map((recommendation, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <View style={styles.recommendationBullet} />
                    <Text style={styles.recommendationText}>{recommendation}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.recommendationText}>No recommendations found.</Text>
              )}
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </Animated.View>
      </ScrollView>

      {/* Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detailed Feedback</Text>
              <TouchableOpacity onPress={() => setShowFeedbackModal(false)}>
                <XCircle size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalFeedback}>{interview.overallFeedback}</Text>
              <Text style={styles.modalSubtitle}>Next Steps:</Text>
              {interview.recommendations.map((rec, index) => (
                <Text key={index} style={styles.modalRecommendation}>• {rec}</Text>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Footer activeTab="History" onTabPress={handleTabPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffffff',
    marginHorizontal: 8,
  },
  scoreMax: {
    fontSize: 24,
    color: '#ffffff',
    opacity: 0.8,
  },
  performanceLevel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  roleName: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 20,
  },
  metaInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  metaText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 4,
    opacity: 0.9,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#667eea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  questionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  questionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  questionNumberText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  questionInfo: {
    flex: 1,
  },
  questionText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
    marginBottom: 8,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  scoreChipText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
    color: '#64748b',
  },
  expandIcon: {
    padding: 4,
  },
  questionDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  answerSection: {
    marginBottom: 16,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  answerText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
  },
  feedbackSection: {
    marginBottom: 16,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  insightsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  strengthsSection: {
    flex: 1,
  },
  improvementsSection: {
    flex: 1,
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  strengthText: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 6,
    flex: 1,
  },
  improvementText: {
    fontSize: 12,
    color: '#F59E0B',
    marginLeft: 6,
    flex: 1,
  },
  overallCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  overallFeedback: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  summarySection: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 8,
    flex: 1,
  },
  recommendationsCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recommendationHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#667eea',
    marginTop: 6,
    marginRight: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    flex: 1,
  },
  bottomSpacing: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalFeedback: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  modalRecommendation: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default InterviewDetails;