import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { 
  Plus,
  Send,
  Clock,
  CheckCircle,
  BarChart3,
  MousePointer,
  Users,
  Calendar,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { EmailCampaign } from '@/types/campaign';

export default function CampaignsScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'sent' | 'scheduled'>('all');

  const mockCampaigns: EmailCampaign[] = [
    {
      id: '1',
      name: 'Summer Sale 2024',
      subject: '☀️ Hot Summer Deals - Up to 50% Off!',
      status: 'sent',
      recipientCount: 12543,
      openRate: 68.4,
      clickRate: 12.3,
      sentAt: '2024-03-10T10:00:00Z',
      createdAt: '2024-03-08',
      template: 'promotional',
      tags: ['sale', 'summer'],
    },
    {
      id: '2',
      name: 'Product Launch Announcement',
      subject: '🚀 Introducing Our Latest Innovation',
      status: 'scheduled',
      recipientCount: 8976,
      openRate: 0,
      clickRate: 0,
      scheduledFor: '2024-03-15T14:00:00Z',
      createdAt: '2024-03-09',
      template: 'announcement',
      tags: ['product', 'launch'],
    },
    {
      id: '3',
      name: 'Monthly Newsletter',
      subject: '📰 Your March Updates & Insights',
      status: 'draft',
      recipientCount: 0,
      openRate: 0,
      clickRate: 0,
      createdAt: '2024-03-11',
      template: 'newsletter',
      tags: ['newsletter', 'monthly'],
    },
  ];

  const filteredCampaigns = activeTab === 'all' 
    ? mockCampaigns 
    : mockCampaigns.filter(c => c.status === activeTab);

  const handleCreateCampaign = () => {
    console.log('Creating new campaign');
    // Generate a new campaign ID
    const newCampaignId = `campaign_${Date.now()}`;
    // Navigate to the campaign editor with the new ID
    router.push(`/campaign/${newCampaignId}` as any);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle size={16} color="#10B981" />;
      case 'scheduled':
        return <Clock size={16} color="#F59E0B" />;
      case 'draft':
        return <Clock size={16} color="#9CA3AF" />;
      default:
        return <Send size={16} color="#6B46C1" />;
    }
  };

  const renderCampaign = ({ item }: { item: EmailCampaign }) => (
    <TouchableOpacity
      style={styles.campaignCard}
      onPress={() => router.push(`/campaign/${item.id}` as any)}
    >
      <View style={styles.campaignHeader}>
        <View style={styles.campaignTitleRow}>
          <Text style={styles.campaignName}>{item.name}</Text>
          <View style={styles.statusBadge}>
            {getStatusIcon(item.status)}
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.campaignSubject}>{item.subject}</Text>
      </View>

      <View style={styles.campaignStats}>
        <View style={styles.stat}>
          <Users size={14} color="#6B7280" />
          <Text style={styles.statValue}>{item.recipientCount.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Recipients</Text>
        </View>
        <View style={styles.stat}>
          <MousePointer size={14} color="#6B7280" />
          <Text style={styles.statValue}>{item.openRate}%</Text>
          <Text style={styles.statLabel}>Open Rate</Text>
        </View>
        <View style={styles.stat}>
          <BarChart3 size={14} color="#6B7280" />
          <Text style={styles.statValue}>{item.clickRate}%</Text>
          <Text style={styles.statLabel}>Click Rate</Text>
        </View>
      </View>

      <View style={styles.campaignFooter}>
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.campaignDate}>
          {item.status === 'sent' && item.sentAt
            ? `Sent ${new Date(item.sentAt).toLocaleDateString()}`
            : item.status === 'scheduled' && item.scheduledFor
            ? `Scheduled for ${new Date(item.scheduledFor).toLocaleDateString()}`
            : `Created ${new Date(item.createdAt).toLocaleDateString()}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {(['all', 'draft', 'sent', 'scheduled'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredCampaigns}
        renderItem={renderCampaign}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Send size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No campaigns yet</Text>
            <Text style={styles.emptyDescription}>
              Create your first email campaign to get started
            </Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={handleCreateCampaign}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#6B46C120',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  activeTabText: {
    color: '#6B46C1',
  },
  listContent: {
    padding: 16,
  },
  campaignCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  campaignHeader: {
    marginBottom: 16,
  },
  campaignTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  campaignName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1F2937',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  statusText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500' as const,
    textTransform: 'capitalize' as const,
  },
  campaignSubject: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  campaignStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  campaignFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#6B7280',
  },
  campaignDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#4B5563',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6B46C1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
