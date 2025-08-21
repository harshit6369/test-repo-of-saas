import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { 
  Mail,
  Phone,
  Building,
  Calendar,
  Tag,
  Activity,
  Edit,
  Trash2,
} from 'lucide-react-native';

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams();

  const contact = {
    id: id as string,
    email: 'john.smith@example.com',
    firstName: 'John',
    lastName: 'Smith',
    company: 'Tech Corp',
    phone: '+1 234-567-8900',
    tags: ['customer', 'premium', 'newsletter'],
    lists: ['Newsletter', 'Product Updates'],
    subscribed: true,
    createdAt: '2024-01-15',
    lastActivity: '2024-03-10',
    customFields: {
      'Job Title': 'Marketing Manager',
      'Industry': 'Technology',
      'Lead Source': 'Website',
    },
  };

  const activities = [
    { action: 'Email opened', campaign: 'Summer Sale 2024', date: '2024-03-10' },
    { action: 'Link clicked', campaign: 'Product Launch', date: '2024-03-08' },
    { action: 'Form submitted', form: 'Contact Form', date: '2024-03-05' },
  ];

  const handleSendEmail = () => {
    console.log('Sending email to:', contact.email);
    Alert.alert('Send Email', 'Email composer would open here');
  };

  const handleEditContact = () => {
    console.log('Editing contact:', contact.id);
    Alert.alert('Edit Contact', 'Contact editor would open here');
  };

  const handleDeleteContact = () => {
    console.log('Deleting contact:', contact.id);
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Contact deleted') }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {contact.firstName[0]}{contact.lastName[0]}
          </Text>
        </View>
        <Text style={styles.name}>
          {contact.firstName} {contact.lastName}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: contact.subscribed ? '#10B98120' : '#EF444420' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: contact.subscribed ? '#10B981' : '#EF4444' }
          ]}>
            {contact.subscribed ? 'Subscribed' : 'Unsubscribed'}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleSendEmail}
        >
          <Mail size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Send Email</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.secondaryActionButton}
          onPress={handleEditContact}
        >
          <Edit size={20} color="#6B46C1" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.secondaryActionButton}
          onPress={handleDeleteContact}
        >
          <Trash2 size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoRow}>
          <Mail size={16} color="#6B7280" />
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{contact.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Phone size={16} color="#6B7280" />
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{contact.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Building size={16} color="#6B7280" />
          <Text style={styles.infoLabel}>Company</Text>
          <Text style={styles.infoValue}>{contact.company}</Text>
        </View>
        <View style={styles.infoRow}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.infoLabel}>Created</Text>
          <Text style={styles.infoValue}>
            {new Date(contact.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Fields</Text>
        {Object.entries(contact.customFields).map(([key, value]) => (
          <View key={key} style={styles.customField}>
            <Text style={styles.customFieldLabel}>{key}</Text>
            <Text style={styles.customFieldValue}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tags & Lists</Text>
        <View style={styles.tagsContainer}>
          {contact.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Tag size={12} color="#6B46C1" />
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.listsTitle}>Lists</Text>
        {contact.lists.map((list, index) => (
          <View key={index} style={styles.listItem}>
            <View style={styles.listDot} />
            <Text style={styles.listText}>{list}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {activities.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <Activity size={16} color="#6B46C1" />
            <View style={styles.activityContent}>
              <Text style={styles.activityAction}>{activity.action}</Text>
              <Text style={styles.activityDetail}>
                {activity.campaign || activity.form}
              </Text>
            </View>
            <Text style={styles.activityDate}>
              {new Date(activity.date).toLocaleDateString()}
            </Text>
          </View>
        ))}
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
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6B46C120',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600' as const,
    color: '#6B46C1',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#1F2937',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#6B46C1',
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500' as const,
  },
  secondaryActionButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500' as const,
  },
  customField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  customFieldLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  customFieldValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500' as const,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#6B46C120',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    color: '#6B46C1',
    fontWeight: '500' as const,
  },
  listsTitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#4B5563',
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  listDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
  },
  listText: {
    fontSize: 14,
    color: '#1F2937',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
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
  activityDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
