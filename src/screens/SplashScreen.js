import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Easing, // Make sure Easing is imported from react-native
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhase, setCurrentPhase] = useState(0); // 0: intro, 1: main, 2: outro

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.1)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(50)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;
  const finalFadeAnim = useRef(new Animated.Value(1)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setHidden(true);
    startFullAnimationSequence();

    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  const startFullAnimationSequence = () => {
    // Phase 1: Entrance (0-3 seconds)
    startEntranceAnimation();
    
    // Phase 2: Main Animation (3-7 seconds)
    setTimeout(() => {
      setCurrentPhase(1);
      startMainAnimation();
    }, 3000);
    
    // Phase 3: Exit Animation (7-10 seconds)
    setTimeout(() => {
      setCurrentPhase(2);
      startExitAnimation();
    }, 7000);
    
    // Navigate after 10 seconds
    setTimeout(() => {
      navigateToNext();
    }, 10000);
  };

  const startEntranceAnimation = () => {
    // Background gradient animation
    Animated.timing(backgroundAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Particle system activation
    Animated.timing(particleAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // Logo entrance with dramatic effect
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Text entrance
    setTimeout(() => {
      Animated.spring(textSlideAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, 1500);
  };

  const startMainAnimation = () => {
    // Logo scale down to normal size
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Continuous logo rotation
    Animated.loop(
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulsing effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation for particles
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startExitAnimation = () => {
    // Dramatic exit sequence
    Animated.parallel([
      // Logo grows and fades
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 1500,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      // Everything fades out
      Animated.timing(finalFadeAnim, {
        toValue: 0,
        duration: 2000,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      // Text slides down
      Animated.timing(textSlideAnim, {
        toValue: 100,
        duration: 1800,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const navigateToNext = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      const userToken = await AsyncStorage.getItem('userToken');

      // Check if user has completed onboarding and has valid token
      if (onboardingCompleted === 'true' && userToken) {
        navigation.replace('Login');
      } else {
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Error checking app state:', error);
      navigation.replace('Login');
    }
  };

  // Animation interpolations
  const logoRotateInterpolate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const particleRotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backgroundColorInterpolate = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Animated Background */}
      <Animated.View style={[styles.backgroundContainer, { opacity: backgroundColorInterpolate }]}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb', '#ff6b9d']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Enhanced Particle System */}
      <Animated.View 
        style={[
          styles.particlesContainer,
          {
            opacity: particleAnim,
            transform: [{ rotate: particleRotateInterpolate }],
          },
        ]}
      >
        {[...Array(30)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                transform: [
                  {
                    translateY: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, (Math.random() - 0.5) * 100],
                    }),
                  },
                  {
                    translateX: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, (Math.random() - 0.5) * 50],
                    }),
                  },
                  {
                    scale: pulseAnim.interpolate({
                      inputRange: [1, 1.15],
                      outputRange: [0.5 + Math.random() * 0.5, 1 + Math.random() * 0.5],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Main Content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: finalFadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Enhanced Logo Container */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { rotate: logoRotateInterpolate },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.logoInner,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            {/* Animated Logo - Replace with your actual logo */}
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoEmoji}>🎯</Text>
              <Animated.View
                style={[
                  styles.logoGlow,
                  {
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.15],
                      outputRange: [0.3, 0.8],
                    }),
                  },
                ]}
              />
            </View>
          </Animated.View>
        </Animated.View>

        {/* App Name with Enhanced Animation */}
        <Animated.Text
          style={[
            styles.appName,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: textSlideAnim },
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [1, 1.15],
                    outputRange: [1, 1.02],
                  }),
                },
              ],
            },
          ]}
        >
          InterviewGenius
        </Animated.Text>

        {/* Enhanced Tagline */}
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.9],
              }),
              transform: [
                {
                  translateY: textSlideAnim.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, 25],
                  }),
                },
              ],
            },
          ]}
        >
          Master Your Interview Skills with AI Power
        </Animated.Text>

        {/* Enhanced Loading Animation */}
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: textSlideAnim }],
            },
          ]}
        >
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={[
                styles.loadingDot,
                {
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [1, 1.15],
                        outputRange: [
                          1 + (index * 0.1),
                          1.3 + (index * 0.1),
                        ],
                      }),
                    },
                  ],
                  opacity: rotateAnim.interpolate({
                    inputRange: [0, 0.33, 0.66, 1],
                    outputRange: [
                      index === 0 ? 1 : 0.3,
                      index === 1 ? 1 : 0.3,
                      index === 2 ? 1 : 0.3,
                      index === 0 ? 1 : 0.3,
                    ],
                  }),
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* Phase Indicator */}
        <Animated.View
          style={[
            styles.phaseContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.phaseText}>
            {currentPhase === 0 && "Initializing..."}
            {currentPhase === 1 && "Loading AI Engine..."}
            {currentPhase === 2 && "Ready to Launch!"}
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Enhanced Bottom Branding */}
      <Animated.View
        style={[
          styles.bottomContainer,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.7],
            }),
            transform: [
              {
                translateY: textSlideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 30],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <Text style={styles.brandText}>AI-Powered Interview Training</Text>
        <View style={styles.brandAccent} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 1.5,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
  },
  logoInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 45,
    textAlign: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    top: -10,
    left: -10,
    zIndex: -1,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 60,
    paddingHorizontal: 30,
    lineHeight: 26,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontWeight: '300',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    marginHorizontal: 6,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  phaseContainer: {
    marginTop: 20,
  },
  phaseText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontStyle: 'italic',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    width: '100%',
  },
  versionText: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    opacity: 0.8,
  },
  brandText: {
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    fontWeight: '500',
    marginBottom: 10,
  },
  brandAccent: {
    width: 40,
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 1,
    opacity: 0.6,
  },
});

export default SplashScreen;