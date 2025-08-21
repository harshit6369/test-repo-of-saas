import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TrendingUp, 
  Users, 
  Mail, 
  MousePointer,
  ArrowUp,
  ArrowDown,
  Activity,
  DollarSign,
} from 'lucide-react-native';
import { useAuth } from '@/providers/auth-provider';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Contacts',
      value: '12,543',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: '#6B46C1',
    },
    {
      title: 'Emails Sent',
      value: '45,678',
      change: '+8.2%',
      trend: 'up',
      icon: Mail,
      color: '#14B8A6',
    },
    {
      title: 'Open Rate',
      value: '68.4%',
      change: '-2.1%',
      trend: 'down',
      icon: MousePointer,
      color: '#F59E0B',
    },
    {
      title: 'Revenue',
      value: '$24,567',
      change: '+18.7%',
      trend: 'up',
      icon: DollarSign,
      color: '#10B981',
    },
  ];

  const recentCampaigns = [
    { name: 'Summer Sale 2024', sent: '2,345', openRate: '72%', status: 'sent' },
    { name: 'Product Launch', sent: '5,678', openRate: '65%', status: 'active' },
    { name: 'Newsletter #45', sent: '8,901', openRate: '58%', status: 'scheduled' },
  ];

  const activities = [
    { action: 'New subscriber', detail: 'john.doe@example.com', time: '2 min ago' },
    { action: 'Campaign sent', detail: 'Summer Sale 2024', time: '1 hour ago' },
    { action: 'Workflow triggered', detail: 'Welcome Series', time: '3 hours ago' },
    { action: 'Payment received', detail: '$99 - Pro Plan', time: '5 hours ago' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#6B46C1', '#4F46E5']}
        style={styles.header}
      >
        <Text style={styles.greeting}>Welcome back, {user?.name}!</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</Text>
      </LinearGradient>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <TouchableOpacity key={index} style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
                <stat.icon size={20} color={stat.color} />
              </View>
              <View style={styles.trendContainer}>
                {stat.trend === 'up' ? (
                  <ArrowUp size={16} color="#10B981" />
                ) : (
                  <ArrowDown size={16} color="#EF4444" />
                )}
                <Text style={[
                  styles.changeText,
                  { color: stat.trend === 'up' ? '#10B981' : '#EF4444' }
                ]}>
                  {stat.change}
                </Text>
              </View>
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statTitle}>{stat.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Campaigns</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        {recentCampaigns.map((campaign, index) => (
          <View key={index} style={styles.campaignCard}>
            <View style={styles.campaignInfo}>
              <Text style={styles.campaignName}>{campaign.name}</Text>
              <View style={styles.campaignStats}>
                <Text style={styles.campaignStat}>Sent: {campaign.sent}</Text>
                <Text style={styles.campaignStat}>Open: {campaign.openRate}</Text>
              </View>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: 
                campaign.status === 'sent' ? '#10B98120' :
                campaign.status === 'active' ? '#6B46C120' :
                '#F59E0B20'
              }
            ]}>
              <Text style={[
                styles.statusText,
                { color: 
                  campaign.status === 'sent' ? '#10B981' :
                  campaign.status === 'active' ? '#6B46C1' :
                  '#F59E0B'
                }
              ]}>
                {campaign.status}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Activity size={20} color="#6B46C1" />
        </View>
        {activities.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={styles.activityDot} />
            <View style={styles.activityContent}>
              <Text style={styles.activityAction}>{activity.action}</Text>
              <Text style={styles.activityDetail}>{activity.detail}</Text>
            </View>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>
        ))}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Mail size={24} color="#fff" />
            <Text style={styles.actionButtonText}>New Campaign</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Users size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Import Contacts</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    marginTop: -20,
  },
  statCard: {
    width: (width - 30) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginLeft: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#1F2937',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1F2937',
  },
  seeAll: {
    fontSize: 14,
    color: '#6B46C1',
    fontWeight: '500' as const,
  },
  campaignCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  campaignInfo: {
    flex: 1,
  },
  campaignName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 4,
  },
  campaignStats: {
    flexDirection: 'row',
    gap: 16,
  },
  campaignStat: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6B46C1',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#1F2937',
  },
  activityDetail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  quickActions: {
    padding: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#6B46C1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500' as const,
  },
});
