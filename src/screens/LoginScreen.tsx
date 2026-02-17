import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import api from '../api';

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (mode === 'signup' && !name) {
      setError('Please enter your name');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      if (mode === 'login') {
        await api.login(email, password);
      } else {
        // For MVP, signup just logs in (mock API)
        await api.login(email, password);
      }
      
      onLoginSuccess(email);
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Logo/Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>💳</Text>
          <Text style={styles.title}>Allowance</Text>
          <Text style={styles.subtitle}>
            {mode === 'login' 
              ? 'Welcome back!' 
              : 'Smart money for smart kids'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {mode === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {mode === 'login' ? 'Log In' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchModeButton}
            onPress={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
            }}
          >
            <Text style={styles.switchModeText}>
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Log in'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* MVP Notice */}
        <View style={styles.mvpNotice}>
          <Text style={styles.mvpNoticeText}>
            🚧 MVP Mode: Use any email/password to demo
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1A1A2E',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchModeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchModeText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  mvpNotice: {
    marginTop: 32,
    padding: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    alignItems: 'center',
  },
  mvpNoticeText: {
    color: '#856404',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default LoginScreen;
