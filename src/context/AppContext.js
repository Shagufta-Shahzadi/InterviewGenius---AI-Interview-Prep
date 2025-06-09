// src/context/AppContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state
const initialState = {
  // User state
  user: {
    id: null,
    name: '',
    email: '',
    isAuthenticated: false,
    totalInterviews: 0,
    averageScore: 0,
  },
  
  // Interview state
  currentInterview: {
    jobRole: '',
    questions: [],
    answers: [],
    startTime: null,
    isActive: false,
  },
  
  // App state
  loading: false,
  error: null,
  token: null,
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  START_INTERVIEW: 'START_INTERVIEW',
  UPDATE_INTERVIEW: 'UPDATE_INTERVIEW',
  END_INTERVIEW: 'END_INTERVIEW',
  SET_TOKEN: 'SET_TOKEN',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ActionTypes.SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };

    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: {
          ...action.payload.user,
          isAuthenticated: true,
        },
        token: action.payload.token,
        loading: false,
        error: null,
      };

    case ActionTypes.LOGOUT:
      return {
        ...initialState,
      };

    case ActionTypes.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };

    case ActionTypes.START_INTERVIEW:
      return {
        ...state,
        currentInterview: {
          jobRole: action.payload.jobRole,
          questions: action.payload.questions,
          answers: [],
          startTime: new Date().toISOString(),
          isActive: true,
        },
      };

    case ActionTypes.UPDATE_INTERVIEW:
      return {
        ...state,
        currentInterview: {
          ...state.currentInterview,
          ...action.payload,
        },
      };

    case ActionTypes.END_INTERVIEW:
      return {
        ...state,
        currentInterview: {
          jobRole: '',
          questions: [],
          answers: [],
          startTime: null,
          isActive: false,
        },
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load stored auth data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Load stored authentication data
  const loadStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        const user = JSON.parse(userData);
        dispatch({
          type: ActionTypes.LOGIN_SUCCESS,
          payload: {
            user,
            token,
          },
        });
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    }
  };

  // Action creators
  const setLoading = (loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  const loginSuccess = async (userData, token) => {
    try {
      // Store in AsyncStorage
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      // Update state
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: {
          user: userData,
          token,
        },
      });
    } catch (error) {
      console.error('Error storing auth data:', error);
      setError('Failed to save login data');
    }
  };

  const logout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');

      // Update state
      dispatch({ type: ActionTypes.LOGOUT });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = (userData) => {
    dispatch({
      type: ActionTypes.UPDATE_USER,
      payload: userData,
    });
  };

  const startInterview = (jobRole, questions) => {
    dispatch({
      type: ActionTypes.START_INTERVIEW,
      payload: {
        jobRole,
        questions,
      },
    });
  };

  const updateInterview = (data) => {
    dispatch({
      type: ActionTypes.UPDATE_INTERVIEW,
      payload: data,
    });
  };

  const endInterview = () => {
    dispatch({ type: ActionTypes.END_INTERVIEW });
  };

  const setToken = (token) => {
    dispatch({ type: ActionTypes.SET_TOKEN, payload: token });
  };

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Actions
    setLoading,
    setError,
    clearError,
    loginSuccess,
    logout,
    updateUser,
    startInterview,
    updateInterview,
    endInterview,
    setToken,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export { AppContext, AppProvider, useAppContext };