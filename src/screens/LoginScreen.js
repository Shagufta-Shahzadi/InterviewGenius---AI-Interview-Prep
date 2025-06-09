import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { signInWithEmailAndPassword, signInWithPhoneNumber, signInWithCredential } from 'firebase/auth';
import { auth } from '../services/firebase';
import Icon from 'react-native-vector-icons/Ionicons';

// Login Screen Component
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [verificationId, setVerificationId] = useState(null);
  const [codeSent, setCodeSent] = useState(false);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone number validation
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  // Handle email login
  const handleEmailLogin = async () => {
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log('User logged in successfully:', userCredential.user.email);
      navigation.replace('Home');
    } catch (error) {
      console.error('Login error:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle phone login - send verification code
  const handlePhoneLogin = async () => {
    setError('');

    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number with country code (e.g., +1234567890)');
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

  // Verify phone code
  const verifyPhoneCode = async () => {
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
      console.log('Phone login successful:', userCredential.user.phoneNumber);
      navigation.replace('Home');
    } catch (error) {
      console.error('Code verification error:', error);
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle authentication errors
  const handleAuthError = (error) => {
    switch (error.code) {
      case 'auth/user-not-found':
        setError('No account found with this email address');
        break;
      case 'auth/wrong-password':
        setError('Incorrect password. Please try again');
        break;
      case 'auth/invalid-email':
        setError('Invalid email address format');
        break;
      case 'auth/user-disabled':
        setError('This account has been disabled');
        break;
      case 'auth/too-many-requests':
        setError('Too many failed attempts. Please try again later');
        break;
      case 'auth/network-request-failed':
        setError('Network error. Please check your connection');
        break;
      case 'auth/invalid-phone-number':
        setError('Invalid phone number');
        break;
      case 'auth/quota-exceeded':
        setError('SMS quota exceeded. Please try again later');
        break;
      default:
        setError('Authentication failed. Please try again');
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address first');
      return;
    }
    
    Alert.alert(
      'Password Reset', 
      'Password reset functionality will be implemented here',
      [{ text: 'OK' }]
    );
  };

  // Handle main action based on current state
  const handleMainAction = () => {
    if (loginMethod === 'email') {
      handleEmailLogin();
    } else if (loginMethod === 'phone' && !codeSent) {
      handlePhoneLogin();
    } else if (loginMethod === 'phone' && codeSent) {
      verifyPhoneCode();
    }
  };

  // Get button text based on current state
  const getButtonText = () => {
    if (loginMethod === 'email') return 'Log in';
    if (loginMethod === 'phone' && !codeSent) return 'Send Code';
    if (loginMethod === 'phone' && codeSent) return 'Verify Code';
    return 'Log in';
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
            <Text style={styles.title}>Log in Account</Text>
            <Text style={styles.subtitle}>Hello, welcome back to our account</Text>

            {/* Login Method Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, loginMethod === 'email' && styles.toggleButtonActive]}
                onPress={() => {
                  setLoginMethod('email');
                  setCodeSent(false);
                  setError('');
                }}
              >
                <Icon name="mail-outline" size={20} color={loginMethod === 'email' ? '#fff' : '#8B5CF6'} />
                <Text style={[styles.toggleText, loginMethod === 'email' && styles.toggleTextActive]}>
                  Email
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.toggleButton, loginMethod === 'phone' && styles.toggleButtonActive]}
                onPress={() => {
                  setLoginMethod('phone');
                  setCodeSent(false);
                  setError('');
                }}
              >
                <Icon name="call-outline" size={20} color={loginMethod === 'phone' ? '#fff' : '#8B5CF6'} />
                <Text style={[styles.toggleText, loginMethod === 'phone' && styles.toggleTextActive]}>
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email Login Form */}
            {loginMethod === 'email' && (
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
              </>
            )}

            {/* Phone Login Form */}
            {loginMethod === 'phone' && (
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

            {/* Remember Me - Only for email login */}
            {loginMethod === 'email' && (
              <View style={styles.rememberContainer}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                  disabled={loading}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Icon name="checkmark" size={14} color="#fff" />}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>
              </View>
            )}

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
            {loginMethod === 'phone' && codeSent && (
              <TouchableOpacity 
                style={styles.resendButton}
                onPress={() => {
                  setCodeSent(false);
                  setVerificationCode('');
                  handlePhoneLogin();
                }}
                disabled={loading}
              >
                <Text style={styles.resendButtonText}>Resend Code</Text>
              </TouchableOpacity>
            )}

            {/* Forgot Password - Only for email login */}
            {loginMethod === 'email' && (
              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
                disabled={loading}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Signup')}
                disabled={loading}
              >
                <Text style={styles.signupLink}>Sign up</Text>
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
  forgotPassword: {
    alignItems: 'center',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#8B5CF6',
    fontSize: 14,
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

export default LoginScreen;