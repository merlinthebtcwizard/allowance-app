// Allowance App - Main Entry Point
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import api from './api';
import { ChildDashboard, CardScreen, ParentDashboard } from './screens';
import { Parent, Child } from './types';
import { formatDollars } from './utils';

// Screen types
type Screen = 'parent' | 'child' | 'card';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('child');
  const [parent, setParent] = useState<Parent | null>(null);
  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [parentData, childData] = await Promise.all([
      api.getParent(),
      api.getChild(),
    ]);
    setParent(parentData);
    setChild(childData);
    setLoading(false);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'card':
        return <CardScreen onBack={() => setCurrentScreen('child')} />;
      case 'parent':
        if (!parent) return <View><Text>Loading...</Text></View>;
        return <ParentDashboard parent={parent} onAddChild={() => {}} />;
      case 'child':
      default:
        if (!child) return <View><Text>Loading...</Text></View>;
        return <ChildDashboard child={child} onViewCard={() => setCurrentScreen('card')} />;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appName}>Allowance</Text>
          {parent && (
            <TouchableOpacity 
              style={styles.switchButton}
              onPress={() => setCurrentScreen(currentScreen === 'parent' ? 'child' : 'parent')}
            >
              <Text style={styles.switchButtonText}>
                {currentScreen === 'parent' ? '👶 Kid View' : '👨 Parent View'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {child && currentScreen === 'child' && (
          <View style={styles.balanceBadge}>
            <Text style={styles.balanceBadgeText}>{formatDollars(child.balance)}</Text>
          </View>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'child' && styles.tabActive]}
          onPress={() => setCurrentScreen('child')}
        >
          <Text style={[styles.tabText, currentScreen === 'child' && styles.tabTextActive]}>
            {currentScreen === 'parent' ? 'Dashboard' : 'Home'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLeft: {
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  switchButton: {
    marginTop: 4,
  },
  switchButtonText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  balanceBadge: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  balanceBadgeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 12,
    color: '#888',
  },
  tabTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default App;
