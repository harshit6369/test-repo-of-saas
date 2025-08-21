import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  Send,
  Users,
  MousePointer,
  BarChart3,
  Clock,
  Edit,
  Copy,
  Trash2,
  Save,
  X,
  Eye,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  
  // Check if this is a new campaign
  const isNewCampaign = (id as string).startsWith('campaign_');
  
  const [campaignData, setCampaignData] = useState({
    id: id as string,
    name: isNewCampaign ? 'New Campaign' : 'Summer Sale 2024',
    subject: isNewCampaign ? '' : '☀️ Hot Summer Deals - Up to 50% Off!',
    status: isNewCampaign ? 'draft' : 'sent',
    recipientCount: isNewCampaign ? 0 : 12543,
    openRate: isNewCampaign ? 0 : 68.4,
    clickRate: isNewCampaign ? 0 : 12.3,
    bounceRate: isNewCampaign ? 0 : 2.1,
    unsubscribeRate: isNewCampaign ? 0 : 0.5,
    sentAt: isNewCampaign ? null : '2024-03-10T10:00:00Z',
    template: isNewCampaign ? 'basic' : 'promotional',
    previewText: isNewCampaign ? '' : 'Don\'t miss out on our biggest sale of the summer!',
    fromName: 'FramefyInFlow Team',
    fromEmail: 'hello@framefy.com',
    content: isNewCampaign ? '' : '<h1>Summer Sale!</h1><p>Get up to 50% off on all products!</p>',
  });
  
  // Auto-enable editing for new campaigns
  useEffect(() => {
    if (isNewCampaign) {
      setIsEditing(true);
    }
  }, [isNewCampaign]);

  const stats = [
    { label: 'Sent', value: campaignData.recipientCount.toLocaleString(), icon: Send },
    { label: 'Opens', value: `${campaignData.openRate}%`, icon: MousePointer },
    { label: 'Clicks', value: `${campaignData.clickRate}%`, icon: BarChart3 },
    { label: 'Bounces', value: `${campaignData.bounceRate}%`, icon: Users },
  ];

  const handleSaveCampaign = () => {
    console.log('Saving campaign:', campaignData);
    setIsEditing(false);
    Alert.alert('Campaign Saved', 'Your campaign has been saved successfully!');
  };
  
  const handleSendCampaign = () => {
    console.log('Sending campaign:', campaignData.id);
    Alert.alert(
      'Send Campaign',
      `Send "${campaignData.name}" to ${campaignData.recipientCount || 'selected'} recipients?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send', onPress: () => {
          setCampaignData(prev => ({ ...prev, status: 'sent', sentAt: new Date().toISOString() }));
          Alert.alert('Campaign Sent!', 'Your campaign is being sent to recipients.');
        }}
      ]
    );
  };

  const handleDuplicateCampaign = () => {
    console.log('Duplicating campaign:', campaignData.id);
    const newId = `campaign_${Date.now()}`;
    router.push(`/campaign/${newId}` as any);
  };

  const handleEditCampaign = () => {
    setIsEditing(true);
  };

  const handleDeleteCampaign = () => {
    console.log('Deleting campaign:', campaignData.id);
    Alert.alert(
      'Delete Campaign',
      'Are you sure you want to delete this campaign?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          router.back();
          Alert.alert('Campaign Deleted', 'Campaign has been deleted.');
        }}
      ]
    );
  };
  
  const handlePreviewCampaign = () => {
    setShowPreview(true);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#6B46C1', '#4F46E5']}
        style={styles.header}
      >
        {isEditing ? (
          <View>
            <TextInput
              style={styles.editInput}
              value={campaignData.name}
              onChangeText={(text) => setCampaignData(prev => ({ ...prev, name: text }))}
              placeholder="Campaign Name"
              placeholderTextColor="rgba(255,255,255,0.7)"
            />
            <TextInput
              style={styles.editInput}
              value={campaignData.subject}
              onChangeText={(text) => setCampaignData(prev => ({ ...prev, subject: text }))}
              placeholder="Email Subject Line"
              placeholderTextColor="rgba(255,255,255,0.7)"
            />
            <TextInput
              style={styles.editInput}
              value={campaignData.previewText}
              onChangeText={(text) => setCampaignData(prev => ({ ...prev, previewText: text }))}
              placeholder="Preview Text"
              placeholderTextColor="rgba(255,255,255,0.7)"
            />
          </View>
        ) : (
          <View>
            <Text style={styles.campaignName}>{campaignData.name}</Text>
            <Text style={styles.campaignSubject}>{campaignData.subject}</Text>
            <View style={styles.statusBadge}>
              <Clock size={14} color="#fff" />
              <Text style={styles.statusText}>
                {campaignData.status === 'sent' && campaignData.sentAt
                  ? `Sent ${new Date(campaignData.sentAt).toLocaleDateString()}`
                  : `Status: ${campaignData.status}`}
              </Text>
            </View>
          </View>
        )}
      </LinearGradient>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <stat.icon size={20} color="#6B46C1" />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {isEditing ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email Content</Text>
          <TextInput
            style={styles.contentEditor}
            value={campaignData.content}
            onChangeText={(text) => setCampaignData(prev => ({ ...prev, content: text }))}
            placeholder="Write your email content here...

You can use HTML tags for formatting:
<h1>Heading</h1>
<p>Paragraph</p>
<a href='#'>Link</a>
<strong>Bold</strong>
<em>Italic</em>"
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
          />
          <View style={styles.editActions}>
            <TouchableOpacity 
              style={styles.previewButton}
              onPress={handlePreviewCampaign}
            >
              <Eye size={16} color="#6B46C1" />
              <Text style={styles.previewButtonText}>Preview</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveCampaign}
            >
              <Save size={16} color="#fff" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.actions}>
          {campaignData.status === 'draft' && (
            <TouchableOpacity 
              style={styles.primaryAction}
              onPress={handleSendCampaign}
            >
              <Send size={20} color="#fff" />
              <Text style={styles.primaryActionText}>Send</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.secondaryAction}
            onPress={handleDuplicateCampaign}
          >
            <Copy size={20} color="#6B46C1" />
            <Text style={styles.secondaryActionText}>Duplicate</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryAction}
            onPress={handleEditCampaign}
          >
            <Edit size={20} color="#6B46C1" />
            <Text style={styles.secondaryActionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.dangerAction}
            onPress={handleDeleteCampaign}
          >
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Campaign Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>From Name</Text>
          <Text style={styles.detailValue}>{campaignData.fromName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>From Email</Text>
          <Text style={styles.detailValue}>{campaignData.fromEmail}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Template</Text>
          <Text style={styles.detailValue}>{campaignData.template}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Preview Text</Text>
          <Text style={styles.detailValue}>{campaignData.previewText || 'No preview text'}</Text>
        </View>
      </View>

      {!isNewCampaign && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Metrics</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>8,579</Text>
                <Text style={styles.metricLabel}>Unique Opens</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>1,542</Text>
                <Text style={styles.metricLabel}>Total Clicks</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>263</Text>
                <Text style={styles.metricLabel}>Bounces</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>63</Text>
                <Text style={styles.metricLabel}>Unsubscribes</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Links Clicked</Text>
            <View style={styles.linkItem}>
              <Text style={styles.linkUrl}>framefy.com/summer-sale</Text>
              <Text style={styles.linkClicks}>542 clicks</Text>
            </View>
            <View style={styles.linkItem}>
              <Text style={styles.linkUrl}>framefy.com/products</Text>
              <Text style={styles.linkClicks}>389 clicks</Text>
            </View>
            <View style={styles.linkItem}>
              <Text style={styles.linkUrl}>framefy.com/contact</Text>
              <Text style={styles.linkClicks}>234 clicks</Text>
            </View>
          </View>
        </>
      )}
      
      <Modal
        visible={showPreview}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={styles.previewModal}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Email Preview</Text>
            <TouchableOpacity onPress={() => setShowPreview(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.previewContent}>
            <View style={styles.emailPreview}>
              <Text style={styles.emailSubject}>{campaignData.subject}</Text>
              <Text style={styles.emailFrom}>From: {campaignData.fromName} &lt;{campaignData.fromEmail}&gt;</Text>
              <Text style={styles.emailPreviewText}>{campaignData.previewText}</Text>
              <View style={styles.emailBody}>
                <Text style={styles.emailBodyText}>{campaignData.content || 'No content yet. Add some content to see the preview.'}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  campaignName: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginBottom: 8,
  },
  campaignSubject: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    lineHeight: 22,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500' as const,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    marginTop: -30,
  },
  statCard: {
    width: (width - 30) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#1F2937',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  primaryAction: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#6B46C1',
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500' as const,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#6B46C1',
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  secondaryActionText: {
    color: '#6B46C1',
    fontSize: 16,
    fontWeight: '500' as const,
  },
  dangerAction: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500' as const,
    flex: 1,
    textAlign: 'right',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  linkUrl: {
    fontSize: 14,
    color: '#6B46C1',
    flex: 1,
  },
  linkClicks: {
    fontSize: 14,
    color: '#6B7280',
  },
  editInput: {
    fontSize: 18,
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 8,
    marginBottom: 12,
  },
  contentEditor: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    minHeight: 200,
    fontSize: 14,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6B46C1',
  },
  previewButtonText: {
    color: '#6B46C1',
    fontSize: 16,
    fontWeight: '500' as const,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#6B46C1',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500' as const,
  },
  previewModal: {
    flex: 1,
    backgroundColor: '#fff',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1F2937',
  },
  previewContent: {
    flex: 1,
  },
  emailPreview: {
    padding: 16,
  },
  emailSubject: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 8,
  },
  emailFrom: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  emailPreviewText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic' as const,
    marginBottom: 16,
  },
  emailBody: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emailBodyText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
});
