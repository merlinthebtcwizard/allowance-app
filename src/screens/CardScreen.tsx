// Virtual Card Screen
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import api from '../api';
import { Card } from '../types';
import { formatCardNumber } from '../utils';

interface CardScreenProps {
  onBack: () => void;
}

export const CardScreen: React.FC<CardScreenProps> = ({ onBack }) => {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCard();
  }, []);

  const loadCard = async () => {
    const data = await api.getCard();
    setCard(data);
    setLoading(false);
  };

  const handleFreezeToggle = async () => {
    Alert.alert(
      card?.status === 'active' ? 'Freeze Card?' : 'Unfreeze Card?',
      card?.status === 'active' 
        ? 'This will temporarily disable the card for purchases.'
        : 'This will re-enable the card for purchases.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: card?.status === 'active' ? 'Freeze' : 'Unfreeze',
          onPress: async () => {
            await api.toggleCardFreeze();
            loadCard();
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Card Display */}
      <View style={[styles.card, card?.status === 'frozen' && styles.cardFrozen]}>
        <Text style={styles.cardType}>VIRTUAL CARD</Text>
        <Text style={styles.cardNumber}>
          {formatCardNumber(card?.virtualCardNumber || '')}
        </Text>
        <View style={styles.cardDetails}>
          <View>
            <Text style={styles.cardLabel}>VALID THRU</Text>
            <Text style={styles.cardValue}>{card?.expiryDate}</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>CVV</Text>
            <Text style={styles.cardValue}>{card?.cvv}</Text>
          </View>
        </View>
        <View style={styles.cardStatus}>
          <View style={[styles.statusBadge, { backgroundColor: card?.status === 'active' ? '#4CAF50' : '#FF9800' }]}>
            <Text style={styles.statusBadgeText}>
              {card?.status === 'active' ? 'ACTIVE' : 'FROZEN'}
            </Text>
          </View>
        </View>
      </View>

      {/* Card Actions */}
      <TouchableOpacity 
        style={[styles.actionButton, card?.status === 'active' ? styles.freezeButton : styles.unfreezeButton]}
        onPress={handleFreezeToggle}
      >
        <Text style={styles.actionButtonText}>
          {card?.status === 'active' ? 'Freeze Card' : 'Unfreeze Card'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Card Info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>How to use</Text>
        <Text style={styles.infoText}>
          Use this virtual card for online purchases and tap-to-pay where Visa is accepted.
        </Text>
        <Text style={[styles.infoText, { marginTop: 8 }]}>
          Funds are drawn automatically from your allowance balance.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  cardFrozen: {
    opacity: 0.7,
  },
  cardType: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 16,
  },
  cardNumber: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 3,
    marginBottom: 20,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardLabel: {
    color: '#888',
    fontSize: 10,
    marginBottom: 4,
  },
  cardValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  cardStatus: {
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  freezeButton: {
    backgroundColor: '#FF9800',
  },
  unfreezeButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    padding: 12,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
  infoSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default CardScreen;
