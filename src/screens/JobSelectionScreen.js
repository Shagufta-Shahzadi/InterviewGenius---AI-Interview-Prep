// src/screens/JobSelectionScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

const JobSelectionScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      // Jab bhi screen focus ho, selection reset ho jaye
      setSelectedJob(null);
    }, [])
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const jobRoles = [
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      description: 'Full-stack development, algorithms, system design, and technical problem solving',
      icon: 'code-slash',
      color: '#3B82F6',
      questionCount: 12,
      difficulty: 'Intermediate',
      skills: ['Programming', 'Problem Solving', 'System Design']
    },
    {
      id: 'frontend-developer',
      title: 'Frontend Developer',
      description: 'React, Angular, Vue.js, HTML/CSS, and user interface development',
      icon: 'desktop',
      color: '#06B6D4',
      questionCount: 10,
      difficulty: 'Intermediate',
      skills: ['React', 'JavaScript', 'CSS', 'HTML']
    },
    {
      id: 'backend-developer',
      title: 'Backend Developer',
      description: 'Server-side development, APIs, databases, and microservices architecture',
      icon: 'server',
      color: '#10B981',
      questionCount: 11,
      difficulty: 'Intermediate',
      skills: ['Node.js', 'Python', 'Databases', 'APIs']
    },
    {
      id: 'fullstack-developer',
      title: 'Full Stack Developer',
      description: 'Complete web application development from frontend to backend',
      icon: 'layers',
      color: '#8B5CF6',
      questionCount: 15,
      difficulty: 'Expert',
      skills: ['React', 'Node.js', 'MongoDB', 'System Design']
    },
    {
      id: 'mobile-developer',
      title: 'Mobile App Developer',
      description: 'iOS, Android, React Native, Flutter mobile application development',
      icon: 'phone-portrait',
      color: '#F59E0B',
      questionCount: 10,
      difficulty: 'Intermediate',
      skills: ['React Native', 'Flutter', 'iOS', 'Android']
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      description: 'Machine learning, statistical analysis, data modeling, and predictive analytics',
      icon: 'analytics',
      color: '#EF4444',
      questionCount: 12,
      difficulty: 'Expert',
      skills: ['Python', 'Machine Learning', 'Statistics', 'SQL']
    },
    {
      id: 'data-analyst',
      title: 'Data Analyst',
      description: 'Data analysis, visualization, business intelligence, and reporting',
      icon: 'bar-chart',
      color: '#10B981',
      questionCount: 8,
      difficulty: 'Beginner',
      skills: ['SQL', 'Excel', 'Tableau', 'Power BI']
    },
    {
      id: 'devops-engineer',
      title: 'DevOps Engineer',
      description: 'CI/CD, cloud infrastructure, containerization, and deployment automation',
      icon: 'git-branch',
      color: '#6366F1',
      questionCount: 11,
      difficulty: 'Expert',
      skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins']
    },
    {
      id: 'cloud-engineer',
      title: 'Cloud Engineer',
      description: 'AWS, Azure, GCP cloud services, infrastructure, and scalable solutions',
      icon: 'cloud',
      color: '#0EA5E9',
      questionCount: 10,
      difficulty: 'Intermediate',
      skills: ['AWS', 'Azure', 'Terraform', 'Cloud Architecture']
    },
    {
      id: 'cybersecurity-specialist',
      title: 'Cybersecurity Specialist',
      description: 'Security protocols, penetration testing, risk assessment, and threat analysis',
      icon: 'shield-checkmark',
      color: '#DC2626',
      questionCount: 9,
      difficulty: 'Expert',
      skills: ['Penetration Testing', 'Security Protocols', 'Risk Analysis']
    },
    {
      id: 'qa-engineer',
      title: 'QA Engineer',
      description: 'Test automation, manual testing, quality assurance, and bug tracking',
      icon: 'checkmark-circle',
      color: '#059669',
      questionCount: 8,
      difficulty: 'Beginner',
      skills: ['Test Automation', 'Selenium', 'Manual Testing', 'JIRA']
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      description: 'Product strategy, roadmap planning, stakeholder management, and market analysis',
      icon: 'briefcase',
      color: '#7C3AED',
      questionCount: 12,
      difficulty: 'Expert',
      skills: ['Strategy', 'Leadership', 'Analytics', 'Market Research']
    },
    {
      id: 'ui-ux-designer',
      title: 'UI/UX Designer',
      description: 'User experience design, interface design, prototyping, and user research',
      icon: 'color-palette',
      color: '#F59E0B',
      questionCount: 9,
      difficulty: 'Intermediate',
      skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems']
    },
    {
      id: 'system-administrator',
      title: 'System Administrator',
      description: 'Server management, network administration, system maintenance, and troubleshooting',
      icon: 'settings',
      color: '#64748B',
      questionCount: 8,
      difficulty: 'Intermediate',
      skills: ['Linux', 'Windows Server', 'Networking', 'Troubleshooting']
    },
    {
      id: 'database-administrator',
      title: 'Database Administrator',
      description: 'Database design, optimization, backup/recovery, and performance tuning',
      icon: 'library',
      color: '#0891B2',
      questionCount: 9,
      difficulty: 'Intermediate',
      skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Performance Tuning']
    },
    {
      id: 'machine-learning-engineer',
      title: 'ML Engineer',
      description: 'Machine learning models, deep learning, AI algorithms, and model deployment',
      icon: 'bulb',
      color: '#EC4899',
      questionCount: 13,
      difficulty: 'Expert',
      skills: ['TensorFlow', 'PyTorch', 'Python', 'Deep Learning']
    },
    {
      id: 'blockchain-developer',
      title: 'Blockchain Developer',
      description: 'Smart contracts, DApps, cryptocurrency, and distributed ledger technology',
      icon: 'link',
      color: '#F97316',
      questionCount: 10,
      difficulty: 'Expert',
      skills: ['Solidity', 'Web3', 'Smart Contracts', 'Ethereum']
    },
    {
      id: 'game-developer',
      title: 'Game Developer',
      description: 'Game programming, Unity, Unreal Engine, gameplay mechanics, and optimization',
      icon: 'game-controller',
      color: '#8B5CF6',
      questionCount: 11,
      difficulty: 'Intermediate',
      skills: ['Unity', 'C#', 'Game Design', 'Graphics Programming']
    },
    {
      id: 'embedded-systems-engineer',
      title: 'Embedded Systems Engineer',
      description: 'Microcontrollers, IoT devices, firmware development, and hardware integration',
      icon: 'hardware-chip',
      color: '#059669',
      questionCount: 10,
      difficulty: 'Expert',
      skills: ['C/C++', 'Microcontrollers', 'IoT', 'RTOS']
    },
    {
      id: 'network-engineer',
      title: 'Network Engineer',
      description: 'Network design, routing protocols, network security, and infrastructure management',
      icon: 'wifi',
      color: '#0EA5E9',
      questionCount: 9,
      difficulty: 'Intermediate',
      skills: ['Cisco', 'Routing', 'Switching', 'Network Security']
    },
    {
      id: 'solutions-architect',
      title: 'Solutions Architect',
      description: 'System architecture, technical leadership, scalable solutions, and integration',
      icon: 'construct',
      color: '#7C2D12',
      questionCount: 14,
      difficulty: 'Expert',
      skills: ['Architecture Design', 'Microservices', 'Scalability', 'Leadership']
    },
    {
      id: 'technical-lead',
      title: 'Technical Lead',
      description: 'Team leadership, code reviews, technical decisions, and project management',
      icon: 'people',
      color: '#BE185D',
      questionCount: 13,
      difficulty: 'Expert',
      skills: ['Leadership', 'Code Review', 'Mentoring', 'Project Management']
    },
    {
      id: 'software-architect',
      title: 'Software Architect',
      description: 'Software design patterns, system architecture, technology selection, and best practices',
      icon: 'library-outline',
      color: '#1E40AF',
      questionCount: 15,
      difficulty: 'Expert',
      skills: ['Design Patterns', 'Architecture', 'System Design', 'Best Practices']
    },
    {
      id: 'site-reliability-engineer',
      title: 'Site Reliability Engineer',
      description: 'System reliability, monitoring, incident response, and performance optimization',
      icon: 'pulse',
      color: '#DC2626',
      questionCount: 11,
      difficulty: 'Expert',
      skills: ['Monitoring', 'Incident Response', 'Automation', 'Performance']
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role.id);
  };

  const handleContinue = () => {
    if (!selectedRole) {
      Alert.alert(
        'Role Required',
        'Please select a job role to continue with your interview practice.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    const selectedJobData = jobRoles.find(role => role.id === selectedRole);
    
    setLoading(true);
    
    // Navigate to interview screen with a slight delay to show loading state
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Interview', {
        jobRole: selectedRole,
        jobData: selectedJobData
      });
    }, 800); // Reduced loading time for better UX
  };

  const JobRoleCard = ({ role, isSelected }) => (
    <TouchableOpacity
      style={[
        styles.roleCard,
        isSelected && { ...styles.selectedCard, borderColor: role.color }
      ]}
      onPress={() => handleRoleSelect(role)}
      activeOpacity={0.8}
    >
      <View style={styles.roleHeader}>
        <View style={[styles.iconContainer, { backgroundColor: role.color + '15' }]}>
          <Icon name={role.icon} size={28} color={role.color} />
        </View>
        <View style={styles.roleInfo}>
          <Text style={styles.roleTitle}>{role.title}</Text>
          <Text style={styles.roleDifficulty}>{role.difficulty} Level</Text>
        </View>
        {isSelected && (
          <View style={[styles.checkIcon, { backgroundColor: role.color }]}>
            <Icon name="checkmark" size={16} color="white" />
          </View>
        )}
      </View>
      
      <Text style={styles.roleDescription}>{role.description}</Text>
      
      <View style={styles.roleDetails}>
        <View style={styles.detailItem}>
          <Icon name="help-circle-outline" size={16} color="#64748B" />
          <Text style={styles.detailText}>{role.questionCount} Questions</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="time-outline" size={16} color="#64748B" />
          <Text style={styles.detailText}>20-30 min</Text>
        </View>
      </View>

      <View style={styles.skillsContainer}>
        {role.skills.map((skill, index) => (
          <View key={index} style={[styles.skillTag, { borderColor: role.color + '30' }]}>
            <Text style={[styles.skillText, { color: role.color }]}>{skill}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Icon name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Choose Your Job</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>What position are you interviewing for?</Text>
          <Text style={styles.introSubtitle}>
            Select the job role that matches your interview preparation needs. 
            Each role has tailored questions to help you practice effectively.
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{jobRoles.length}</Text>
              <Text style={styles.statLabel}>Job Roles</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>250+</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15-30</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
          </View>
        </View>

        <View style={styles.rolesContainer}>
          {jobRoles.map((role) => (
            <JobRoleCard
              key={role.id}
              role={role}
              isSelected={selectedRole === role.id}
            />
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedRole && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!selectedRole || loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.continueButtonText}>Preparing Interview...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.continueButtonText}>Start Interview</Text>
              <Icon name="arrow-forward" size={20} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>
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
    marginLeft:40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  introSection: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  rolesContainer: {
    paddingHorizontal: 20,
  },
  roleCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 2,
    shadowColor: '#3B82F6',
    shadowOpacity: 0.2,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  roleDifficulty: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleDescription: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 16,
  },
  roleDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
    fontWeight: '500',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default JobSelectionScreen;