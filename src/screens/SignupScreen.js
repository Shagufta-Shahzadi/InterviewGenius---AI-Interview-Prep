import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { createUserWithEmailAndPassword, updateProfile, signInWithPhoneNumber, signInWithCredential } from 'firebase/auth';
import { auth } from '../services/firebase';
import Icon from 'react-native-vector-icons/Ionicons';

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupMethod, setSignupMethod] = useState('email'); // 'email' or 'phone'
  const [verificationId, setVerificationId] = useState(null);
  const [codeSent, setCodeSent] = useState(false);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength validation
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
    return passwordRegex.test(password);
  };

  // Phone number validation
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  // Handle authentication errors
  const handleAuthError = (error) => {
    let errorMessage = 'An error occurred. Please try again.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered. Please use a different email or sign in.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak. Please choose a stronger password.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address. Please check and try again.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'This sign-up method is not enabled. Please contact support.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many attempts. Please try again later.';
        break;
      case 'auth/invalid-phone-number':
        errorMessage = 'Invalid phone number. Please enter a valid phone number.';
        break;
      case 'auth/quota-exceeded':
        errorMessage = 'SMS quota exceeded. Please try again later.';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'An account already exists with this email using a different sign-in method.';
        break;
      default:
        errorMessage = error.message || 'An unexpected error occurred.';
    }
    
    setError(errorMessage);
  };

  // Handle email signup
  const handleEmailSignup = async () => {
    setError('');

    // Validation
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters long');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must contain at least one letter and one number');
      return;
    }

    if (!confirmPassword) {
      setError('Please confirm your password');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to Terms & Conditions');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email.trim(), 
        password
      );

      await updateProfile(userCredential.user, {
        displayName: fullName.trim(),
      });

      console.log('User created successfully:', userCredential.user.email);
      
      Alert.alert(
        'Account Created!',
        'Your account has been created successfully. Welcome to InterviewGenius!',
        [
          {
            text: 'Get Started',
            onPress: () => navigation.replace('Home'),
          },
        ]
      );
      
    } catch (error) {
      console.error('Signup error:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle phone signup - send verification code
  const handlePhoneSignup = async () => {
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number with country code (e.g., +1234567890)');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to Terms & Conditions');
      return;
    }

    setLoading(true);

    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber.trim());
      setVerificationId(confirmation.verificationId);
      setCodeSent(true);
      setError('');
      Alert.alert('Verification Code Sent', 'Please check your phone for the verification code');
    } catch (error) {
      console.error('Phone auth error:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Verify phone code for signup
  const verifyPhoneCodeSignup = async () => {
    setError('');

    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      const credential = auth.PhoneAuthProvider.credential(verificationId, verificationCode);
      const userCredential = await signInWithCredential(auth, credential);
      
      // Update profile with full name
      await updateProfile(userCredential.user, {
        displayName: fullName.trim(),
      });

      console.log('Phone signup successful:', userCredential.user.phoneNumber);
      
      Alert.alert(
        'Account Created!',
        'Your account has been created successfully. Welcome to InterviewGenius!',
        [
          {
            text: 'Get Started',
            onPress: () => navigation.replace('Home'),
          },
        ]
      );
    } catch (error) {
      console.error('Code verification error:', error);
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form when switching signup methods
  const switchSignupMethod = (method) => {
    setSignupMethod(method);
    setError('');
    setCodeSent(false);
    setVerificationCode('');
    setVerificationId(null);
  };

  // Handle main action based on current state
  const handleMainAction = () => {
    if (signupMethod === 'email') {
      handleEmailSignup();
    } else if (signupMethod === 'phone' && !codeSent) {
      handlePhoneSignup();
    } else if (signupMethod === 'phone' && codeSent) {
      verifyPhoneCodeSignup();
    }
  };

  // Get button text based on current state
  const getButtonText = () => {
    if (signupMethod === 'email') return 'Sign up';
    if (signupMethod === 'phone' && !codeSent) return 'Send Code';
    if (signupMethod === 'phone' && codeSent) return 'Verify Code';
    return 'Sign up';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>IG</Text>
              </View>
              <Text style={styles.appName}>INTERVIEWGENIUS</Text>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Hello, welcome to our community</Text>

            {/* Signup Method Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, signupMethod === 'email' && styles.toggleButtonActive]}
                onPress={() => switchSignupMethod('email')}
              >
                <Icon name="mail-outline" size={20} color={signupMethod === 'email' ? '#fff' : '#8B5CF6'} />
                <Text style={[styles.toggleText, signupMethod === 'email' && styles.toggleTextActive]}>
                  Email
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.toggleButton, signupMethod === 'phone' && styles.toggleButtonActive]}
                onPress={() => switchSignupMethod('phone')}
              >
                <Icon name="call-outline" size={20} color={signupMethod === 'phone' ? '#fff' : '#8B5CF6'} />
                <Text style={[styles.toggleText, signupMethod === 'phone' && styles.toggleTextActive]}>
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Full Name Input - Always visible */}
            <View style={styles.inputContainer}>
              <Icon name="person-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setError('');
                }}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>

            {/* Email Signup Form */}
            {signupMethod === 'email' && (
              <>
                <View style={styles.inputContainer}>
                  <Icon name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="username@gmail.com"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!loading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setError('');
                    }}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    editable={!loading}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Icon 
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                      size={20} 
                      color="#999" 
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#999"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setError('');
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="password"
                    editable={!loading}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Icon 
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                      size={20} 
                      color="#999" 
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Phone Signup Form */}
            {signupMethod === 'phone' && (
              <>
                {!codeSent ? (
                  <View style={styles.inputContainer}>
                    <Icon name="call-outline" size={20} color="#999" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="+1234567890"
                      placeholderTextColor="#999"
                      value={phoneNumber}
                      onChangeText={(text) => {
                        setPhoneNumber(text);
                        setError('');
                      }}
                      keyboardType="phone-pad"
                      autoComplete="tel"
                      editable={!loading}
                    />
                  </View>
                ) : (
                  <View style={styles.inputContainer}>
                    <Icon name="keypad-outline" size={20} color="#999" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter 6-digit code"
                      placeholderTextColor="#999"
                      value={verificationCode}
                      onChangeText={(text) => {
                        setVerificationCode(text);
                        setError('');
                      }}
                      keyboardType="numeric"
                      maxLength={6}
                      editable={!loading}
                    />
                  </View>
                )}
              </>
            )}

            {/* Error Message */}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* Terms & Conditions */}
            <View style={styles.rememberContainer}>
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setAgreeTerms(!agreeTerms)}
                disabled={loading}
              >
                <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                  {agreeTerms && <Icon name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={styles.rememberText}>
                  I agree to Terms & Conditions
                </Text>
              </TouchableOpacity>
            </View>

            {/* Main Action Button */}
            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
              onPress={handleMainAction}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>{getButtonText()}</Text>
              )}
            </TouchableOpacity>

            {/* Resend Code Button - Only shown during phone verification */}
            {signupMethod === 'phone' && codeSent && (
              <TouchableOpacity 
                style={styles.resendButton}
                onPress={() => {
                  setCodeSent(false);
                  setVerificationCode('');
                  handlePhoneSignup();
                }}
                disabled={loading}
              >
                <Text style={styles.resendButtonText}>Resend Code</Text>
              </TouchableOpacity>
            )}

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            {/* Sign In Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Already have an account? </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Login')}
                disabled={loading}
              >
                <Text style={styles.signupLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  toggleTextActive: {
    color: '#fff',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 50,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  rememberContainer: {
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#8B5CF6',
  },
  rememberText: {
    fontSize: 14,
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonDisabled: {
    backgroundColor: '#C4B5FD',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    alignItems: 'center',
    marginBottom: 15,
  },
  resendButtonText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    color: '#999',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  error: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default SignUpScreen;