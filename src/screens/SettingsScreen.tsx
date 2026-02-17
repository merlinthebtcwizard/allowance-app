// Settings Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Parent, Child } from '../types';

interface SettingsScreenProps {
  parent: Parent | null;
  child: Child | null;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ parent, child, onBack }) => {
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(false);
  const [faceId, setFaceId] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {parent?.name?.charAt(0) || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{parent?.name || 'Parent'}</Text>
            <Text style={styles.profileEmail}>{parent?.email || 'parent@example.com'}</Text>
            <Text style={styles.profileTier}>
              {parent?.subscriptionTier === 'premium' ? '⭐ Pro Plan' : 'Free Plan'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Edit Profile</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Payment Methods</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Subscription</Text>
          <View style={styles.menuRight}>
            <Text style={styles.menuValue}>Pro</Text>
            <Text style={styles.menuArrow}>→</Text>
          </View>
>
        
        <TouchableOpacity style={        </TouchableOpacitystyles.menuItem}>
          <Text style={styles.menuText}>Security</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.toggleItem}>
          <View>
            <Text style={styles.menuText}>Push Notifications</Text>
            <Text style={styles.toggleDesc}>Receive alerts for transactions</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
            thumbColor="#FFF"
          />
        </View>
        
        <View style={styles.toggleItem}>
          <View>
            <Text style={styles.menuText}>Location Services</Text>
            <Text style={styles.toggleDesc}>For card security features</Text>
          </View>
          <Switch
            value={location}
            onValueChange={setLocation}
            trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
            thumbColor="#FFF"
          />
        </View>
        
        <View style={styles.toggleItem}>
          <View>
            <Text style={styles.menuText}>Face ID / Touch ID</Text>
            <Text style={styles.toggleDesc}>Unlock app with biometrics</Text>
          </View>
          <Switch
            value={faceId}
            onValueChange={setFaceId}
            trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
            thumbColor="#FFF"
          />
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Help Center</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Contact Us</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Terms of Service</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#F44336' }]}>Danger Zone</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={styles.menuText}>Log Out</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
          <Text style={[styles.menuText, { color: '#F44336' }]}>Delete Account</Text>
          <Text style={[styles.menuArrow, { color: '#F44336' }]}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Version */}
      <View style={styles.footer}>
        <Text style={styles.version}>Allowance App v0.1.0</Text>
        <Text style={styles.copyright}>© 2026 Allowance App</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
  },
  backButton: {
    fontSize: 16,
    color: '#4CAF50',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    backgroundColor: '#FFF',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  profileTier: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuValue: {
    fontSize: 14,
    color: '#4CAF50',
    marginRight: 8,
  },
  menuArrow: {
    fontSize: 16,
    color: '#CCC',
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  toggleDesc: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  version: {
    fontSize: 12,
    color: '#888',
  },
  copyright: {
    fontSize: 11,
    color: '#CCC',
    marginTop: 4,
  },
});

export default SettingsScreen;
