// Child Dashboard Screen
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import api from '../api';
import { Child, Card, Transaction } from '../types';
import { formatDollars, formatRelativeTime } from '../utils';

interface ChildDashboardProps {
  child: Child;
  onViewCard: () => void;
}

export const ChildDashboard: React.FC<ChildDashboardProps> = ({ child, onViewCard }) => {
  const [card, setCard] = useState<Card | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [cardData, txData] = await Promise.all([
      api.getCard(),
      api.getTransactions(5),
    ]);
    setCard(cardData);
    setTransactions(txData);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>{formatDollars(child.balance)}</Text>
        <View style={styles.cardStatus}>
          <View style={[styles.statusDot, { backgroundColor: card?.status === 'active' ? '#4CAF50' : '#FF9800' }]} />
          <Text style={styles.statusText}>
            {card?.status === 'active' ? 'Card Active' : 'Card Frozen'}
          </Text>
        </View>
      </View>

      {/* Virtual Card Button */}
      <TouchableOpacity style={styles.cardButton} onPress={onViewCard}>
        <View style={styles.cardButtonContent}>
          <Text style={styles.cardButtonLabel}>Virtual Card</Text>
          <Text style={styles.cardButtonArrow}>→</Text>
        </View>
        <Text style={styles.cardButtonNumber}>•••• {card?.lastFour}</Text>
      </TouchableOpacity>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {transactions.map((tx) => (
          <View key={tx.id} style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionDesc}>{tx.description}</Text>
              <Text style={styles.transactionTime}>
                {formatRelativeTime(tx.timestamp)}
              </Text>
            </View>
            <Text style={[
              styles.transactionAmount,
              { color: tx.amount > 0 ? '#4CAF50' : '#333' }
            ]}>
              {tx.amount > 0 ? '+' : ''}{formatDollars(tx.amount)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  balanceCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: 'bold',
  },
  cardStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#888',
    fontSize: 12,
  },
  cardButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardButtonArrow: {
    fontSize: 20,
    color: '#888',
  },
  cardButtonNumber: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 14,
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
});

export default ChildDashboard;
