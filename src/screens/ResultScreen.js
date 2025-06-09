// src/screens/ResultScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Animated,
  Dimensions,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ResultScreen = ({ navigation, route }) => {
  const { interviewData, jobData } = route?.params || {};

  // State management
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [expandedFeedback, setExpandedFeedback] = useState({});

  // Animation refs
  const scoreAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  // Process interview results and generate AI analysis
  useEffect(() => {
    processInterviewResults();
  }, []);

  const processInterviewResults = async () => {
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate mock AI analysis based on interview data
      const processedResult = generateAIAnalysis(interviewData);
      
      setResult(processedResult);
      setLoading(false);

      // Animate score reveal
      Animated.sequence([
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scoreAnimation, {
          toValue: processedResult.totalScore,
          duration: 1500,
          useNativeDriver: false,
        }),
      ]).start();
    } catch (error) {
      console.error('Error processing results:', error);
      setLoading(false);
    }
  };

  // Generate AI analysis based on interview responses
  const generateAIAnalysis = (data) => {
    const { questions, answers, duration, totalQuestions, answeredQuestions } = data;
    
    // Calculate completion rate
    const completionRate = (answeredQuestions / totalQuestions) * 100;
    
    // Analyze answer quality
    const scores = questions.map((q, index) => {
      const answer = answers[index] || '';
      const wordCount = answer.trim().split(/\s+/).length;
      const charCount = answer.length;
      
      // Simple scoring algorithm based on answer length and completeness
      let score = 0;
      
      if (charCount > 500) score += 3;
      else if (charCount > 200) score += 2;
      else if (charCount > 50) score += 1;
      
      if (wordCount > 80) score += 2;
      else if (wordCount > 40) score += 1;
      
      // Question type bonus
      if (q.type === 'technical' && charCount > 300) score += 2;
      if (q.type === 'behavioral' && wordCount > 50) score += 1;
      
      // Ensure score is between 1-10
      score = Math.min(Math.max(score + Math.random() * 3 + 2, 1), 10);
      
      return {
        questionIndex: index,
        score: Number(score.toFixed(1)),
        feedback: generateQuestionFeedback(q, answer, score)
      };
    });

    // Calculate overall score
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
    
    // Generate percentile based on score
    const percentile = Math.min(Math.max(Math.round(totalScore * 8 + Math.random() * 20), 15), 95);

    return {
      totalScore: Number(totalScore.toFixed(1)),
      maxScore: 10,
      scores,
      duration,
      percentile,
      completionRate: Math.round(completionRate),
      overallFeedback: generateOverallFeedback(totalScore, completionRate, duration),
      strengths: generateStrengths(scores, totalScore),
      improvements: generateImprovements(scores, totalScore),
      jobRole: data.jobRole,
      totalQuestions,
      answeredQuestions
    };
  };

  // Generate feedback for individual questions
  const generateQuestionFeedback = (question, answer, score) => {
    const feedbacks = {
      high: [
        "Excellent response! You demonstrated strong understanding and provided comprehensive details.",
        "Great answer! Your explanation was clear, well-structured, and showed deep knowledge.",
        "Outstanding! You covered all key aspects and provided relevant examples.",
        "Impressive response! Your answer shows excellent problem-solving skills."
      ],
      medium: [
        "Good response overall. Consider adding more specific examples to strengthen your answer.",
        "Solid answer! You could enhance it by providing more detailed explanations.",
        "Nice work! Try to elaborate more on the practical applications or examples.",
        "Good foundation! Adding more context would make your response even stronger."
      ],
      low: [
        "Your answer needs more detail. Try to provide specific examples and explanations.",
        "Consider expanding your response with more comprehensive information.",
        "Good start, but your answer would benefit from more depth and examples.",
        "Try to provide more detailed explanations and real-world applications."
      ]
    };

    let category = 'low';
    if (score >= 7) category = 'high';
    else if (score >= 5) category = 'medium';

    const categoryFeedbacks = feedbacks[category];
    return categoryFeedbacks[Math.floor(Math.random() * categoryFeedbacks.length)];
  };

  // Generate overall feedback
  const generateOverallFeedback = (score, completionRate, duration) => {
    if (score >= 8.5) {
      return "Outstanding performance! You demonstrated excellent knowledge and communication skills throughout the interview. Your responses were comprehensive, well-structured, and showed deep understanding of the subject matter. Keep up the great work!";
    } else if (score >= 7.0) {
      return "Strong performance overall! You showed good understanding and provided solid answers. With some additional preparation and more detailed examples, you'll be even more impressive in future interviews.";
    } else if (score >= 5.0) {
      return "Decent attempt! You have a good foundation but there's room for improvement. Focus on providing more detailed answers with specific examples. Practice explaining concepts more clearly and comprehensively.";
    } else {
      return "You've made a good start, but there's significant room for improvement. Focus on studying the fundamentals more thoroughly and practice articulating your thoughts clearly. Consider preparing more examples and practicing mock interviews.";
    }
  };

  // Generate strengths based on performance
  const generateStrengths = (scores, totalScore) => {
    const strengths = [];
    
    if (totalScore >= 7) {
      strengths.push("Strong communication skills");
      strengths.push("Good technical understanding");
    }
    
    if (scores.some(s => s.score >= 8)) {
      strengths.push("Excellent performance on specific questions");
    }
    
    strengths.push("Completed the interview process");
    
    if (totalScore >= 6) {
      strengths.push("Demonstrated problem-solving abilities");
    }

    return strengths.slice(0, 3); // Return top 3 strengths
  };

  // Generate improvement areas
  const generateImprovements = (scores, totalScore) => {
    const improvements = [];
    
    if (totalScore < 7) {
      improvements.push("Provide more detailed and comprehensive answers");
    }
    
    if (scores.some(s => s.score < 5)) {
      improvements.push("Strengthen knowledge in weak areas");
    }
    
    improvements.push("Practice explaining concepts with examples");
    
    if (totalScore < 8) {
      improvements.push("Improve answer structure and clarity");
    }

    return improvements.slice(0, 3); // Return top 3 improvements
  };

  // Handle back navigation
  const handleBackPress = () => {
    Alert.alert(
      'Leave Results',
      'Are you sure you want to go back?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => navigation.goBack() }
      ]
    );
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 8.5) return '#10B981';
    if (score >= 7.0) return '#F59E0B';
    return '#EF4444';
  };

  // Get performance level
  const getPerformanceLevel = (score) => {
    if (score >= 8.5) return { text: 'Excellent', color: '#10B981' };
    if (score >= 7.0) return { text: 'Good', color: '#F59E0B' };
    if (score >= 5.0) return { text: 'Average', color: '#F97316' };
    return { text: 'Needs Improvement', color: '#EF4444' };
  };

  // Toggle feedback expansion
  const toggleFeedback = (index) => {
    setExpandedFeedback((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Share results
  const shareResults = async () => {
    try {
      const shareText = `🎯 Interview Results\n\nJob Role: ${jobData?.title}\nScore: ${result?.totalScore}/10\nPerformance: ${getPerformanceLevel(result?.totalScore).text}\n\nCompleted on ${new Date().toLocaleDateString()}`;

      await Share.share({
        message: shareText,
        title: 'My Interview Results',
      });
    } catch (error) {
      console.error('Error sharing results:', error);
    }
  };

  // Retake interview
  const retakeInterview = () => {
    Alert.alert(
      'Retake Interview',
      'Are you sure you want to start a new interview for this role?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Retake',
          onPress: () => {
            navigation.navigate('Interview', {
              jobRole: interviewData.jobRole,
              jobData: jobData
            });
          },
        },
      ]
    );
  };

  // Jab interview complete ho:
  const saveInterviewToHistory = async (interviewData) => {
    try {
      const existing = await AsyncStorage.getItem('interviewHistory');
      const history = existing ? JSON.parse(existing) : [];
      history.unshift(interviewData); // latest on top
      await AsyncStorage.setItem('interviewHistory', JSON.stringify(history));
    } catch (e) {
      console.log('Failed to save interview history', e);
    }
  };

  useEffect(() => {
    if (result && interviewData) {
      // Interview result ko history me save karo
      saveInterviewToHistory({
        ...result,
        createdAt: new Date().toISOString(),
        jobRole: interviewData.jobRole,
        difficulty: interviewData.difficulty || 'Intermediate',
        questionsCount: interviewData.totalQuestions,
        duration: interviewData.duration,
        id: interviewData.id || Date.now().toString(), // unique id
      });
    }
  }, [result]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[styles.loadingSpinner, { opacity: fadeAnimation }]}
          >
            <Icon name="analytics-outline" size={48} color="#6366F1" />
          </Animated.View>
          <Text style={styles.loadingText}>Analyzing your performance...</Text>
          <Text style={styles.loadingSubtext}>
            Our AI is evaluating your responses
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!result) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.loadingText}>Error processing results</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const performance = getPerformanceLevel(result?.totalScore);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />

      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Icon name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Interview Result</Text>
          </View>
          
          <TouchableOpacity
            style={styles.shareButton}
            onPress={shareResults}
          >
            <Icon name="share-outline" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overall Score Card */}
        <Animated.View style={[styles.scoreCard, { opacity: fadeAnimation }]}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Overall Performance</Text>
            <View style={styles.dateContainer}>
              <Icon name="calendar-outline" size={14} color="#64748B" />
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.scoreDisplay}>
            <Animated.Text
              style={[
                styles.scoreValue,
                { color: getScoreColor(result?.totalScore) },
              ]}
            >
              {result?.totalScore}
            </Animated.Text>
            <Text style={styles.scoreMax}>/ {result?.maxScore}</Text>
          </View>

          <View
            style={[styles.performanceTag, { backgroundColor: performance.color }]}
          >
            <Text style={styles.performanceText}>{performance.text}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="time-outline" size={16} color="#64748B" />
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>{formatDuration(result?.duration)}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Icon name="people-outline" size={16} color="#64748B" />
              <Text style={styles.statLabel}>Percentile</Text>
              <Text style={styles.statValue}>{result?.percentile}%</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Icon name="checkmark-circle-outline" size={16} color="#64748B" />
              <Text style={styles.statLabel}>Completed</Text>
              <Text style={styles.statValue}>{result?.answeredQuestions}/{result?.totalQuestions}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Individual Question Scores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Question-wise Performance</Text>

          {result?.scores.map((item, index) => (
            <View key={index} style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <View style={styles.questionInfo}>
                  <Text style={styles.questionNumber}>Question {index + 1}</Text>
                  <Text
                    style={[styles.questionScore, { color: getScoreColor(item.score) }]}
                  >
                    {item.score}/10
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => toggleFeedback(index)}
                  style={styles.expandButton}
                >
                  <Icon
                    name={expandedFeedback[index] ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(item.score / 10) * 100}%`,
                      backgroundColor: getScoreColor(item.score),
                    },
                  ]}
                />
              </View>

              {expandedFeedback[index] && (
                <View style={styles.feedbackContainer}>
                  <Text style={styles.feedbackText}>{item.feedback}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Overall Feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Feedback</Text>
          <View style={styles.feedbackCard}>
            <Text style={styles.overallFeedback}>{result?.overallFeedback}</Text>
          </View>
        </View>

        {/* Strengths & Improvements */}
        <View style={styles.section}>
          <View style={styles.insightsContainer}>
            {/* Strengths */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Icon name="checkmark-circle" size={20} color="#10B981" />
                <Text style={[styles.insightTitle, { color: '#10B981' }]}>Strengths</Text>
              </View>
              {result?.strengths.map((strength, index) => (
                <View key={index} style={styles.insightItem}>
                  <View style={[styles.insightDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.insightText}>{strength}</Text>
                </View>
              ))}
            </View>

            {/* Areas for Improvement */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Icon name="trending-up" size={20} color="#F59E0B" />
                <Text style={[styles.insightTitle, { color: '#F59E0B' }]}>Improve</Text>
              </View>
              {result?.improvements.map((improvement, index) => (
                <View key={index} style={styles.insightItem}>
                  <View style={[styles.insightDot, { backgroundColor: '#F59E0B' }]} />
                  <Text style={styles.insightText}>{improvement}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={retakeInterview}
            activeOpacity={0.8}
          >
            <Icon name="refresh-outline" size={20} color="#6366F1" />
            <Text style={styles.retakeButtonText}>Retake Interview</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.8}
          >
            <Icon name="home-outline" size={20} color="white" />
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingSpinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 40,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '800',
  },
  scoreMax: {
    fontSize: 24,
    color: '#64748B',
    fontWeight: '600',
    marginLeft: 4,
  },
  performanceTag: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  performanceText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  questionScore: {
    fontSize: 16,
    fontWeight: '700',
  },
  expandButton: {
    padding: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  feedbackContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  feedbackCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  overallFeedback: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  insightsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  insightCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  insightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
    gap: 8,
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  homeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    gap: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ResultScreen;