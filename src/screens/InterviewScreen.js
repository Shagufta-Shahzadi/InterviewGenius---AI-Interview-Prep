import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import fallbackQuestions from '../data/fallbackQuestions'; // Import questions data

const { width, height } = Dimensions.get('window');

const InterviewScreen = ({ navigation, route }) => {
  const { jobRole, jobData } = route?.params || {};
  
  // State management
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeStarted, setTimeStarted] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Animation refs
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const questionAnimation = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);
  const textInputRef = useRef(null);

  // Keyboard event listeners - Simplified and fixed
  useEffect(() => {
    const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardDidShow = Keyboard.addListener(keyboardShowEvent, (event) => {
      setKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates.height);
    });
    
    const keyboardDidHide = Keyboard.addListener(keyboardHideEvent, () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  // Initialize interview
  useEffect(() => {
    // Get questions for the selected jobRole from fallbackQuestions
    const normalizedRole = (jobRole || '').toLowerCase().replace(/[-_\s]/g, '-');
    const roleQuestions = fallbackQuestions[normalizedRole] || fallbackQuestions['software-engineer'];

    setQuestions(roleQuestions);
    const initialAnswers = new Array(roleQuestions.length).fill('');
    setAnswers(initialAnswers);
    setCurrentAnswer(''); // Reset current answer
    setTimeStarted(new Date());

    // Start timer
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    setLoading(false);

    // Animate progress bar
    Animated.timing(progressAnimation, {
      toValue: (1 / (roleQuestions.length || 1)) * 100,
      duration: 800,
      useNativeDriver: false,
    }).start();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [jobRole]);

  // Update progress animation when question changes
  useEffect(() => {
    if (questions.length > 0) {
      Animated.timing(progressAnimation, {
        toValue: ((currentQuestionIndex + 1) / questions.length) * 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentQuestionIndex, questions.length]);

  // Load answer when question changes - Fixed to prevent conflicts
  useEffect(() => {
    setCurrentAnswer(answers[currentQuestionIndex] || '');
  }, [currentQuestionIndex]);

  // Reset state when jobRole or jobData changes
  useEffect(() => {
    // Reset state
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCurrentAnswer('');
    setTimeElapsed(0);
    setShowHint(false);

    // Clear any previous timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start new timer
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    // Cleanup on unmount or job change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [route?.params?.jobRole, route?.params?.jobData]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer input - Optimized with useCallback
  const handleAnswerChange = useCallback((text) => {
    setCurrentAnswer(text);
    // Update answers array immediately
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = text;
      return newAnswers;
    });
  }, [currentQuestionIndex]);

  // Navigate to next question - Fixed keyboard handling
  const handleNext = useCallback(() => {
    if (currentAnswer.trim().length < 10) {
      Alert.alert(
        'Answer Too Short',
        'Please provide a more detailed answer (at least 10 characters) before proceeding.',
        [{ 
          text: 'OK', 
          style: 'default'
        }]
      );
      return;
    }

    // Save current answer before moving
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = currentAnswer;
      return newAnswers;
    });

    // Animate question transition
    Animated.sequence([
      Animated.timing(questionAnimation, {
        toValue: -width,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(questionAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowHint(false);
      // Focus on next question's input after a slight delay
      setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      }, 250);
    } else {
      handleSubmitInterview();
    }
  }, [currentAnswer, currentQuestionIndex, questions.length]);

  // Navigate to previous question - Fixed
  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      // Save current answer before moving
      setAnswers(prevAnswers => {
        const newAnswers = [...prevAnswers];
        newAnswers[currentQuestionIndex] = currentAnswer;
        return newAnswers;
      });
      
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowHint(false);
      
      // Focus on previous question's input after a slight delay
      setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      }, 250);
    }
  }, [currentAnswer, currentQuestionIndex]);

  // Submit interview confirmation
  const handleSubmitInterview = () => {
    Alert.alert(
      'Submit Interview',
      'Are you sure you want to submit your interview? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          style: 'default',
          onPress: submitInterview,
        },
      ]
    );
  };

  // Submit interview and navigate to results
  const submitInterview = async () => {
  setIsSubmitting(true);
  
  try {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Save final answer
    const finalAnswers = [...answers];
    finalAnswers[currentQuestionIndex] = currentAnswer;

    // Prepare comprehensive interview data
    const interviewData = {
      jobRole,
      jobData,
      questions: questions.map((q, index) => ({
        id: index,
        question: q.question,
        type: q.type,
        hint: q.hint,
        answer: finalAnswers[index] || '',
        answerLength: (finalAnswers[index] || '').length,
      })),
      answers: finalAnswers,
      totalQuestions: questions.length,
      answeredQuestions: finalAnswers.filter(answer => answer.trim().length > 0).length,
      duration: timeElapsed,
      startTime: timeStarted,
      endTime: new Date(),
      completionPercentage: Math.round(((currentQuestionIndex + 1) / questions.length) * 100),
    };

    // Simulate API call for processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Navigate to ResultScreen with comprehensive data
    navigation.navigate('Result', {  // Changed from replace to navigate
      interviewData: { ...interviewData },
      jobData: { ...jobData }
    });

  } catch (error) {
    console.error('Interview submission error:', error);
    Alert.alert(
      'Submission Error', 
      'Failed to submit interview. Please check your connection and try again.',
      [
        {
          text: 'Retry',
          onPress: submitInterview
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setIsSubmitting(false)
        }
      ]
    );
  }
};

  // Handle back navigation with confirmation
  const handleBackPress = () => {
    Alert.alert(
      'Exit Interview',
      'Your progress will be lost. Are you sure you want to exit?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save Draft & Exit',
          onPress: saveDraftAndExit,
        },
        {
          text: 'Exit Without Saving',
          style: 'destructive',
          onPress: () => {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            navigation.goBack();
          },
        },
      ]
    );
  };

  // Save draft functionality
  const saveDraftAndExit = () => {
    // Save current answer before exiting
    const finalAnswers = [...answers];
    finalAnswers[currentQuestionIndex] = currentAnswer;
    
    const draftData = {
      jobRole,
      jobData,
      currentQuestionIndex,
      answers: finalAnswers,
      timeElapsed,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Draft saved:', draftData);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    navigation.goBack();
  };

  // Skip to results (for testing or incomplete interviews)
  const skipToResults = () => {
    Alert.alert(
      'Skip to Results',
      'This will submit your interview with current answers. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: submitInterview }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingIcon, { opacity: progressAnimation }]}>
            <Icon name="document-text-outline" size={48} color="#6366F1" />
          </Animated.View>
          <Text style={styles.loadingText}>Preparing your interview...</Text>
          <Text style={styles.loadingSubtext}>Getting ready for {jobData?.title}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{jobData?.title}</Text>
          <Text style={styles.headerSubtitle}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.timerContainer}>
            <Icon name="time-outline" size={16} color="#FFFFFF" />
            <Text style={styles.timerText}>{formatTime(timeElapsed)}</Text>
          </View>
          
          {/* Optional: Skip to results button for testing */}
          {__DEV__ && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={skipToResults}
            >
              <Icon name="fast-forward-outline" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: progressAnimation.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                })
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{progress}% Complete</Text>
      </View>

      {/* Main Content - Adjusted for fixed buttons */}
      <View style={styles.mainContainer}>
        <ScrollView 
          style={styles.scrollableContent}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Question Section */}
          <Animated.View 
            style={[
              styles.questionContainer,
              { transform: [{ translateX: questionAnimation }] }
            ]}
          >
            <View style={styles.questionHeader}>
              <View style={[styles.questionTypeTag, {
                backgroundColor: currentQuestion?.type === 'technical' ? '#3B82F6' : '#10B981'
              }]}>
                <Text style={styles.questionTypeText}>
                  {currentQuestion?.type === 'technical' ? 'Technical' : 'Behavioral'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.hintButton}
                onPress={() => setShowHint(!showHint)}
              >
                <Icon name="help-circle-outline" size={20} color="#6366F1" />
                <Text style={styles.hintButtonText}>Hint</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.questionText}>{currentQuestion?.question}</Text>

            {showHint && (
              <View style={styles.hintContainer}>
                <Icon name="bulb-outline" size={16} color="#F59E0B" />
                <Text style={styles.hintText}>{currentQuestion?.hint}</Text>
              </View>
            )}
          </Animated.View>

          {/* Answer Section */}
          <View style={styles.answerContainer}>
            <Text style={styles.answerLabel}>Your Answer:</Text>
            <TextInput
              ref={textInputRef}
              style={styles.answerInput}
              value={currentAnswer}
              onChangeText={handleAnswerChange}
              placeholder="Type your detailed answer here..."
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              blurOnSubmit={false}
              returnKeyType="default"
              keyboardType="default"
              autoCorrect={true}
              spellCheck={true}
              scrollEnabled={true}
            />
            
            <View style={styles.answerStats}>
              <Text style={styles.characterCount}>
                {currentAnswer.length} characters
              </Text>
              <Text style={[
                styles.answerQuality,
                { color: currentAnswer.length < 50 ? '#EF4444' : 
                         currentAnswer.length < 100 ? '#F59E0B' : '#10B981' }
              ]}>
                {currentAnswer.length < 50 ? 'Too short' : 
                 currentAnswer.length < 100 ? 'Good length' : 'Great detail!'}
              </Text>
            </View>

            {/* Navigation Buttons - Inside Answer Container */}
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  styles.previousButton,
                  currentQuestionIndex === 0 && styles.disabledButton
                ]}
                onPress={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <Icon name="chevron-back" size={20} color={currentQuestionIndex === 0 ? "#94A3B8" : "#6366F1"} />
                <Text style={[
                  styles.navButtonText,
                  { color: currentQuestionIndex === 0 ? "#94A3B8" : "#6366F1" }
                ]}>
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navButton,
                  styles.nextButton,
                  isSubmitting && styles.disabledButton
                ]}
                onPress={handleNext}
                disabled={isSubmitting}
              >
                <Text style={styles.nextButtonText}>
                  {isSubmitting ? 'Submitting...' : isLastQuestion ? 'Submit Interview' : 'Next Question'}
                </Text>
                {!isSubmitting && (
                  <Icon 
                    name={isLastQuestion ? "checkmark" : "chevron-forward"} 
                    size={20} 
                    color="white" 
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const InterviewScreenWithLayout = (props) => <InterviewScreen {...props} />;

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
  loadingIcon: {
    marginBottom: 16,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#6366F1',
    borderBottomWidth: 0.5,
    borderBottomColor: '#818CF8',
    marginTop: 25,
    height: 90,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#E0E7FF',
    textAlign: 'center',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  skipButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollableContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 20,
  },
  questionContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionTypeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  questionTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
  },
  hintButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
    marginLeft: 4,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 26,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  hintText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
  answerContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  answerInput: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
    textAlignVertical: 'top',
    minHeight: 120,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  answerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 12,
  },
  characterCount: {
    fontSize: 12,
    color: '#64748B',
  },
  answerQuality: {
    fontSize: 12,
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 120,
  },
  previousButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#6366F1',
    flex: 1,
  },
  nextButton: {
    backgroundColor: '#6366F1',
    flex: 2,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginRight: 8,
  },
});

export default InterviewScreenWithLayout;