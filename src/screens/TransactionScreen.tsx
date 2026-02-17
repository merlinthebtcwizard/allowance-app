// Transaction History Screen
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import api from '../api';
import { Transaction } from '../types';
import { formatDollars, formatRelativeTime } from '../utils';

interface TransactionScreenProps {
  onBack: () => void;
}

export const TransactionScreen: React.FC<TransactionScreenProps> = ({ onBack }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'deposit' | 'spending'>('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const data = await api.getTransactions(50);
    setTransactions(data);
    setLoading(false);
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Text style={styles.transactionIconText}>
          {item.type === 'deposit' ? '💰' : item.type === 'allowance' ? '📅' : '💳'}
        </Text>
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDesc}>{item.description}</Text>
        <Text style={styles.transactionTime}>
          {formatRelativeTime(item.timestamp)}
        </Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        { color: item.amount > 0 ? '#4CAF50' : '#333' }
      ]}>
        {item.amount > 0 ? '+' : ''}{formatDollars(Math.abs(item.amount))}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Activity</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['all', 'deposit', 'spending'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions yet</Text>
        }
      />

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Deposits</Text>
          <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
            {formatDollars(transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0))}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Spent</Text>
          <Text style={styles.summaryValue}>
            {formatDollars(Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)))}
          </Text>
        </View>
      </View>
    </View>
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
  filterRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#1A1A2E',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#FFF',
  },
  list: {
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  transactionTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    paddingVertical: 40,
  },
  summary: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TransactionScreen;
