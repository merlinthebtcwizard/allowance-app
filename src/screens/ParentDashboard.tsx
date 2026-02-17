// Parent Dashboard Screen
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import api from '../api';
import { Parent, Child, AllowanceSchedule } from '../types';
import { formatDollars, formatDate } from '../utils';

interface ParentDashboardProps {
  parent: Parent;
  onAddChild: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ parent, onAddChild }) => {
  const [children, setChildren] = useState<Child[]>(parent.children || []);
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [allowanceAmount, setAllowanceAmount] = useState('');
  const [allowanceFrequency, setAllowanceFrequency] = useState<AllowanceSchedule['frequency']>('weekly');
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const handleAddChild = async () => {
    if (!newChildName.trim()) return;
    const child = await api.addChild(newChildName.trim());
    setChildren([...children, child]);
    setNewChildName('');
    setShowAddChild(false);
    Alert.alert('Success', `${child.name} has been added!`);
  };

  const handleSetAllowance = async () => {
    if (!selectedChild || !allowanceAmount) return;
    const amount = Math.round(parseFloat(allowanceAmount) * 100); // Convert to cents
    await api.setAllowance(amount, allowanceFrequency);
    Alert.alert('Success', `Allowance set for ${selectedChild.name}!`);
    setAllowanceAmount('');
    setSelectedChild(null);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active Kids</Text>
          <Text style={styles.statValue}>{children.length}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Monthly Spend</Text>
          <Text style={styles.statValue}>$0.00</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Subscription</Text>
          <Text style={styles.statValue}>{parent.subscriptionTier === 'premium' ? 'Pro' : 'Free'}</Text>
        </View>
      </View>

      {/* Children List */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Kids</Text>
          <TouchableOpacity onPress={() => setShowAddChild(!showAddChild)}>
            <Text style={styles.addButton}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {showAddChild && (
          <View style={styles.addChildForm}>
            <TextInput
              style={styles.input}
              placeholder="Child's name"
              value={newChildName}
              onChangeText={setNewChildName}
              autoCapitalize="words"
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAddChild}>
              <Text style={styles.submitButtonText}>Add Child</Text>
            </TouchableOpacity>
          </View>
        )}

        {children.map((child) => (
          <TouchableOpacity key={child.id} style={styles.childCard}>
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childBalance}>{formatDollars(child.balance)}</Text>
            </View>
            <View style={styles.childStatus}>
              <View style={[styles.statusBadge, child.cardStatus === 'active' ? styles.statusActive : styles.statusPending]}>
                <Text style={styles.statusBadgeText}>{child.cardStatus}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {children.length === 0 && (
          <Text style={styles.emptyText}>No children added yet. Tap "+ Add" to get started.</Text>
        )}
      </View>

      {/* Set Allowance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Set Allowance</Text>
        
        <Text style={styles.inputLabel}>Select Child</Text>
        <View style={styles.childSelector}>
          {children.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={[styles.childChip, selectedChild?.id === child.id && styles.childChipSelected]}
              onPress={() => setSelectedChild(child)}
            >
              <Text style={[styles.childChipText, selectedChild?.id === child.id && styles.childChipTextSelected]}>
                {child.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedChild && (
          <>
            <Text style={styles.inputLabel}>Amount ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="50.00"
              value={allowanceAmount}
              onChangeText={setAllowanceAmount}
              keyboardType="decimal-pad"
            />

            <Text style={styles.inputLabel}>Frequency</Text>
            <View style={styles.frequencySelector}>
              {(['weekly', 'biweekly', 'monthly'] as const).map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[styles.frequencyChip, allowanceFrequency === freq && styles.frequencyChipSelected]}
                  onPress={() => setAllowanceFrequency(freq)}
                >
                  <Text style={[styles.frequencyChipText, allowanceFrequency === freq && styles.frequencyChipTextSelected]}>
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, !allowanceAmount && styles.submitButtonDisabled]} 
              onPress={handleSetAllowance}
              disabled={!allowanceAmount}
            >
              <Text style={styles.submitButtonText}>Set Allowance</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Funding */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Funding</Text>
        <TouchableOpacity style={styles.fundingButton}>
          <Text style={styles.fundingButtonText}>+ Add Funds</Text>
        </TouchableOpacity>
        <Text style={styles.fundingNote}>
          Connect your bank account or Lightning wallet to fund allowances.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  statsRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  addButton: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  addChildForm: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  childCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  childBalance: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  childStatus: {},
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#E8F5E9',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    paddingVertical: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
    marginTop: 8,
  },
  childSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  childChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  childChipSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  childChipText: {
    fontSize: 14,
    color: '#666',
  },
  childChipTextSelected: {
    color: '#FFF',
  },
  frequencySelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  frequencyChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  frequencyChipSelected: {
    backgroundColor: '#1A1A2E',
  },
  frequencyChipText: {
    fontSize: 14,
    color: '#666',
  },
  frequencyChipTextSelected: {
    color: '#FFF',
  },
  fundingButton: {
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  fundingButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fundingNote: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
});

export default ParentDashboard;
