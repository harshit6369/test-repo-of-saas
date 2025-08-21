import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { 
  Workflow as WorkflowIcon,
  Plus,
  Play,
  Pause,
  Edit,
  Zap,
  Clock,
  Mail,
  Users,
  Filter,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Workflow } from '@/types/workflow';

export default function AutomationScreen() {
  const mockWorkflows: Workflow[] = [
    {
      id: '1',
      name: 'Welcome Series',
      status: 'active',
      nodes: [
        { id: '1', type: 'trigger', name: 'New Subscriber', config: {}, position: { x: 0, y: 0 } },
        { id: '2', type: 'delay', name: 'Wait 1 hour', config: { duration: 3600 }, position: { x: 0, y: 100 } },
        { id: '3', type: 'action', name: 'Send Welcome Email', config: {}, position: { x: 0, y: 200 } },
      ],
      connections: [
        { from: '1', to: '2' },
        { from: '2', to: '3' },
      ],
      createdAt: '2024-03-01',
      lastModified: '2024-03-10',
    },
    {
      id: '2',
      name: 'Abandoned Cart Recovery',
      status: 'paused',
      nodes: [
        { id: '1', type: 'trigger', name: 'Cart Abandoned', config: {}, position: { x: 0, y: 0 } },
        { id: '2', type: 'delay', name: 'Wait 24 hours', config: { duration: 86400 }, position: { x: 0, y: 100 } },
        { id: '3', type: 'condition', name: 'Check if purchased', config: {}, position: { x: 0, y: 200 } },
      ],
      connections: [
        { from: '1', to: '2' },
        { from: '2', to: '3' },
      ],
      createdAt: '2024-02-15',
      lastModified: '2024-03-05',
    },
  ];

  const handleCreateWorkflow = () => {
    console.log('Creating new workflow');
    // Generate a new workflow ID
    const newWorkflowId = `workflow_${Date.now()}`;
    // Navigate to the workflow editor with the new ID
    router.push(`/workflow/${newWorkflowId}` as any);
  };

  const handleUseTemplate = (templateName: string) => {
    console.log('Using template:', templateName);
    // Generate a new workflow ID with template info
    const newWorkflowId = `template_${templateName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    // Navigate to the workflow editor with the template-based ID
    router.push(`/workflow/${newWorkflowId}` as any);
  };

  const handleEditWorkflow = (workflowId: string) => {
    console.log('Editing workflow:', workflowId);
    // Navigate to the workflow editor
    router.push(`/workflow/${workflowId}` as any);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'trigger':
        return <Zap size={16} color="#6B46C1" />;
      case 'action':
        return <Mail size={16} color="#14B8A6" />;
      case 'condition':
        return <Filter size={16} color="#F59E0B" />;
      case 'delay':
        return <Clock size={16} color="#9CA3AF" />;
      default:
        return <WorkflowIcon size={16} color="#6B7280" />;
    }
  };

  const renderWorkflow = (workflow: Workflow) => (
    <TouchableOpacity
      key={workflow.id}
      style={styles.workflowCard}
      onPress={() => router.push(`/workflow/${workflow.id}` as any)}
    >
      <View style={styles.workflowHeader}>
        <View style={styles.workflowInfo}>
          <Text style={styles.workflowName}>{workflow.name}</Text>
          <View style={styles.statusContainer}>
            {workflow.status === 'active' ? (
              <Play size={14} color="#10B981" />
            ) : (
              <Pause size={14} color="#F59E0B" />
            )}
            <Text style={[
              styles.statusText,
              { color: workflow.status === 'active' ? '#10B981' : '#F59E0B' }
            ]}>
              {workflow.status}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => handleEditWorkflow(workflow.id)}
        >
          <Edit size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.nodesPreview}>
        {workflow.nodes.map((node, index) => (
          <View key={node.id} style={styles.nodePreviewContainer}>
            <View style={styles.nodePreview}>
              {getNodeIcon(node.type)}
              <Text style={styles.nodePreviewText}>{node.name}</Text>
            </View>
            {index < workflow.nodes.length - 1 && (
              <View style={styles.nodeConnection} />
            )}
          </View>
        ))}
      </View>

      <View style={styles.workflowFooter}>
        <Text style={styles.workflowDate}>
          Modified {new Date(workflow.lastModified).toLocaleDateString()}
        </Text>
        <View style={styles.workflowStats}>
          <View style={styles.statItem}>
            <Users size={12} color="#9CA3AF" />
            <Text style={styles.statText}>1.2k enrolled</Text>
          </View>
          <View style={styles.statItem}>
            <Mail size={12} color="#9CA3AF" />
            <Text style={styles.statText}>3.4k sent</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Automation Workflows</Text>
          <Text style={styles.headerDescription}>
            Create automated email sequences and customer journeys
          </Text>
        </View>

        <View style={styles.templates}>
          <Text style={styles.sectionTitle}>Quick Start Templates</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity 
              style={styles.templateCard}
              onPress={() => handleUseTemplate('Welcome Series')}
            >
              <View style={styles.templateIcon}>
                <Users size={24} color="#6B46C1" />
              </View>
              <Text style={styles.templateName}>Welcome Series</Text>
              <Text style={styles.templateDescription}>3 emails</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.templateCard}
              onPress={() => handleUseTemplate('Re-engagement')}
            >
              <View style={styles.templateIcon}>
                <Mail size={24} color="#14B8A6" />
              </View>
              <Text style={styles.templateName}>Re-engagement</Text>
              <Text style={styles.templateDescription}>4 emails</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.templateCard}
              onPress={() => handleUseTemplate('Lead Nurture')}
            >
              <View style={styles.templateIcon}>
                <Zap size={24} color="#F59E0B" />
              </View>
              <Text style={styles.templateName}>Lead Nurture</Text>
              <Text style={styles.templateDescription}>5 emails</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.workflows}>
          <Text style={styles.sectionTitle}>Your Workflows</Text>
          {mockWorkflows.map(renderWorkflow)}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={handleCreateWorkflow}
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#1F2937',
    marginBottom: 4,
  },
  headerDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  templates: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 16,
  },
  templateCard: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  templateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#1F2937',
    marginBottom: 2,
    textAlign: 'center',
  },
  templateDescription: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  workflows: {
    padding: 20,
    paddingTop: 0,
  },
  workflowCard: {
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
  workflowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  workflowInfo: {
    flex: 1,
  },
  workflowName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500' as const,
    textTransform: 'capitalize' as const,
  },
  editButton: {
    padding: 8,
  },
  nodesPreview: {
    marginBottom: 16,
  },
  nodePreviewContainer: {
    marginBottom: 8,
  },
  nodePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
  },
  nodePreviewText: {
    fontSize: 14,
    color: '#4B5563',
  },
  nodeConnection: {
    width: 2,
    height: 16,
    backgroundColor: '#E5E7EB',
    marginLeft: 24,
    marginVertical: 2,
  },
  workflowFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workflowDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  workflowStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#9CA3AF',
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
