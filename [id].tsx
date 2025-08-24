import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Switch,
  Picker,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { 
  Play,
  Pause,
  Plus,
  Zap,
  Mail,
  Clock,
  Filter,
  Settings,
  X,
  Check,
  ChevronDown,
  Trash2,
  Edit3,
} from 'lucide-react-native';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  name: string;
  description: string;
  config?: {
    // Trigger configs
    event?: string;
    webhook_url?: string;
    
    // Action configs
    actionType?: string;
    subject?: string;
    template?: string;
    trackOpens?: boolean;
    url?: string;
    method?: string;
    tagName?: string;
    fieldName?: string;
    fieldValue?: string;
    
    // Condition configs
    condition?: string;
    expectedValue?: string;
    operator?: string;
    
    // Delay configs
    duration?: number;
    unit?: string;
    skipWeekends?: boolean;
    specificTime?: string;
  };
}

export default function WorkflowEditorScreen() {
  const { id } = useLocalSearchParams();
  
  const isNewWorkflow = (id as string).startsWith('workflow_') || (id as string).startsWith('template_');
  
  const [workflow, setWorkflow] = useState({
    id: id as string,
    name: isNewWorkflow ? 'New Workflow' : 'Welcome Email Series',
    status: isNewWorkflow ? 'draft' : 'active',
    nodes: isNewWorkflow ? [
      { 
        id: '1', 
        type: 'trigger' as const, 
        name: 'New Trigger', 
        description: 'Click to configure trigger',
        config: {}
    });
    ] : [
      { 
        id: '1', 
        type: 'trigger' as const, 
        name: 'New Subscriber', 
        description: 'When someone subscribes to newsletter',
        config: { event: 'subscriber_added' }
      },
      { 
        id: '2', 
        type: 'delay' as const, 
        name: 'Wait 1 Hour', 
        description: 'Delay for 1 hour',
        config: { duration: 1, unit: 'hour' }
      },
      { 
        id: '3', 
        type: 'action' as const, 
        name: 'Send Welcome Email', 
        description: 'Send welcome email to new subscriber',
        config: { 
          actionType: 'email', 
          subject: 'Welcome to our newsletter!', 
          template: 'welcome_email',
          trackOpens: true 
        }
      },
      { 
        id: '4', 
        type: 'condition' as const, 
        name: 'Email Opened?', 
        description: 'Check if welcome email was opened',
        config: { condition: 'email_opened', operator: 'equals', expectedValue: 'true' }
      },
      { 
        id: '5', 
        type: 'action' as const, 
        name: 'Send Follow-up', 
        description: 'Send follow-up email for engaged users',
        config: { 
          actionType: 'email', 
          subject: 'Thanks for reading!', 
          template: 'followup_email' 
        }
      },
    ],
  });

  const [showSettings, setShowSettings] = useState(false);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [nodeConfig, setNodeConfig] = useState<any>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Node configuration templates
  const triggerEvents = [
    { value: 'subscriber_added', label: 'New Subscriber' },
    { value: 'email_opened', label: 'Email Opened' },
    { value: 'link_clicked', label: 'Link Clicked' },
    { value: 'form_submitted', label: 'Form Submitted' },
    { value: 'tag_added', label: 'Tag Added' },
    { value: 'webhook_received', label: 'Webhook Received' },
  ];

  const actionTypes = [
    { value: 'email', label: 'Send Email' },
    { value: 'webhook', label: 'Call Webhook' },
    { value: 'add_tag', label: 'Add Tag' },
    { value: 'remove_tag', label: 'Remove Tag' },
    { value: 'update_field', label: 'Update Field' },
    { value: 'wait', label: 'Wait/Delay' },
  ];

  const conditionTypes = [
    { value: 'email_opened', label: 'Email Opened' },
    { value: 'email_clicked', label: 'Email Clicked' },
    { value: 'tag_exists', label: 'Has Tag' },
    { value: 'field_equals', label: 'Field Equals' },
    { value: 'date_passed', label: 'Date Passed' },
    { value: 'time_elapsed', label: 'Time Elapsed' },
  ];

  const timeUnits = [
    { value: 'minute', label: 'Minutes' },
    { value: 'hour', label: 'Hours' },
    { value: 'day', label: 'Days' },
    { value: 'week', label: 'Weeks' },
    { value: 'month', label: 'Months' },
  ];

  const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'trigger': return <Zap size={20} color="#fff" />;
      case 'action': return <Mail size={20} color="#fff" />;
      case 'condition': return <Filter size={20} color="#fff" />;
      case 'delay': return <Clock size={20} color="#fff" />;
      default: return <Settings size={20} color="#fff" />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'trigger': return '#6B46C1';
      case 'action': return '#14B8A6';
      case 'condition': return '#F59E0B';
      case 'delay': return '#9CA3AF';
      default: return '#6B7280';
    }
  };
  
  const addNode = (type: string, position: number) => {
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type: type as any,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      description: `Click to configure this ${type}`,
      config: getDefaultConfig(type),
    };
    
    setWorkflow(prev => {
      const newNodes = [...prev.nodes];
      newNodes.splice(position, 0, newNode);
      return { ...prev, nodes: newNodes };
    });
  };

  const getDefaultConfig = (type: string) => {
    switch (type) {
      case 'trigger': return { event: 'subscriber_added' };
      case 'action': return { actionType: 'email', subject: '', template: '' };
      case 'condition': return { condition: 'email_opened', operator: 'equals' };
      case 'delay': return { duration: 1, unit: 'hour' };
      default: return {};
    }
  };

  const openNodeSettings = (node: WorkflowNode) => {
    setSelectedNode(node);
    setNodeConfig({ ...node.config } || {});
    setShowSettings(true);
  };

  const saveNodeSettings = () => {
    if (!selectedNode) return;

    const updatedNode = {
      ...selectedNode,
      config: nodeConfig,
      name: generateNodeName(selectedNode.type, nodeConfig),
      description: generateNodeDescription(selectedNode.type, nodeConfig),
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === selectedNode.id ? updatedNode : node
      )
    }));

    setShowSettings(false);
    setSelectedNode(null);
    setNodeConfig({});
  };

  const deleteNode = (nodeId: string) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId)
    }));
    setShowSettings(false);
    setShowDeleteConfirm(false);
  };

  const generateNodeName = (type: string, config: any) => {
    switch (type) {
      case 'trigger':
        const triggerEvent = triggerEvents.find(e => e.value === config.event);
        return triggerEvent ? triggerEvent.label : 'New Trigger';
      
      case 'action':
        if (config.actionType === 'email') {
          return config.subject || 'Send Email';
        }
        const actionType = actionTypes.find(a => a.value === config.actionType);
        return actionType ? actionType.label : 'New Action';
      
      case 'condition':
        const conditionType = conditionTypes.find(c => c.value === config.condition);
        return conditionType ? `Check: ${conditionType.label}` : 'New Condition';
      
      case 'delay':
        return config.duration ? `Wait ${config.duration} ${config.unit}${config.duration > 1 ? 's' : ''}` : 'Wait';
      
      default:
        return 'New Node';
    }
  };

  const generateNodeDescription = (type: string, config: any) => {
    switch (type) {
      case 'trigger':
        const triggerEvent = triggerEvents.find(e => e.value === config.event);
        return triggerEvent ? `Triggers when ${triggerEvent.label.toLowerCase()}` : 'Click to configure trigger';
      
      case 'action':
        if (config.actionType === 'email') {
          return `Send: ${config.subject || 'Untitled Email'}`;
        }
        if (config.actionType === 'webhook') {
          return `Call: ${config.url || 'No URL set'}`;
        }
        if (config.actionType === 'add_tag') {
          return `Add tag: ${config.tagName || 'No tag specified'}`;
        }
        return 'Click to configure action';
      
      case 'condition':
        if (config.condition === 'field_equals') {
          return `If ${config.fieldName || 'field'} ${config.operator || 'equals'} ${config.expectedValue || 'value'}`;
        }
        return 'Click to configure condition';
      
      case 'delay':
        return config.duration ? `Delay for ${config.duration} ${config.unit}${config.duration > 1 ? 's' : ''}` : 'Click to configure delay';
      
      default:
        return 'Click to configure';
    }
  };

  const renderTriggerSettings = () => (
    <View style={styles.settingsSection}>
      <Text style={styles.settingsLabel}>Trigger Event</Text>
      <View style={styles.optionsContainer}>
        {triggerEvents.map(event => (
          <TouchableOpacity
            key={event.value}
            style={[
              styles.optionItem,
              nodeConfig.event === event.value && styles.optionItemSelected
            ]}
            onPress={() => setNodeConfig(prev => ({ ...prev, event: event.value }))}
          >
            <Text style={[
              styles.optionText,
              nodeConfig.event === event.value && styles.optionTextSelected
            ]}>
              {event.label}
            </Text>
            {nodeConfig.event === event.value && <Check size={16} color="#6B46C1" />}
          </TouchableOpacity>
        ))}
      </View>

      {nodeConfig.event === 'webhook_received' && (
        <>
          <Text style={styles.settingsLabel}>Webhook URL (for testing)</Text>
          <TextInput
            style={styles.textInput}
            value={nodeConfig.webhook_url || ''}
            onChangeText={(text) => setNodeConfig(prev => ({ ...prev, webhook_url: text }))}
            placeholder="https://your-webhook-endpoint.com"
            autoCapitalize="none"
          />
        </>
      )}
    </View>
  );

  const renderActionSettings = () => (
    <View style={styles.settingsSection}>
      <Text style={styles.settingsLabel}>Action Type</Text>
      <View style={styles.optionsContainer}>
        {actionTypes.map(action => (
          <TouchableOpacity
            key={action.value}
            style={[
              styles.optionItem,
              nodeConfig.actionType === action.value && styles.optionItemSelected
            ]}
            onPress={() => setNodeConfig(prev => ({ ...prev, actionType: action.value }))}
          >
            <Text style={[
              styles.optionText,
              nodeConfig.actionType === action.value && styles.optionTextSelected
            ]}>
              {action.label}
            </Text>
            {nodeConfig.actionType === action.value && <Check size={16} color="#6B46C1" />}
          </TouchableOpacity>
        ))}
      </View>

      {nodeConfig.actionType === 'email' && (
        <>
          <Text style={styles.settingsLabel}>Email Subject</Text>
          <TextInput
            style={styles.textInput}
            value={nodeConfig.subject || ''}
            onChangeText={(text) => setNodeConfig(prev => ({ ...prev, subject: text }))}
            placeholder="Enter email subject line"
          />

          <Text style={styles.settingsLabel}>Email Template</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={nodeConfig.template || ''}
            onChangeText={(text) => setNodeConfig(prev => ({ ...prev, template: text }))}
            placeholder="Enter your email content here..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <View style={styles.switchRow}>
            <Text style={styles.settingsLabel}>Track Email Opens</Text>
            <Switch
              value={nodeConfig.trackOpens || false}
              onValueChange={(value) => setNodeConfig(prev => ({ ...prev, trackOpens: value }))}
              trackColor={{ false: '#D1D5DB', true: '#6B46C1' }}
              thumbColor="#fff"
            />
          </View>
        </>
      )}

      {nodeConfig.actionType === 'webhook' && (
        <>
          <Text style={styles.settingsLabel}>Webhook URL</Text>
          <TextInput
            style={styles.textInput}
            value={nodeConfig.url || ''}
            onChangeText={(text) => setNodeConfig(prev => ({ ...prev, url: text }))}
            placeholder="https://api.example.com/webhook"
            autoCapitalize="none"
          />

          <Text style={styles.settingsLabel}>HTTP Method</Text>
          <View style={styles.optionsContainer}>
            {httpMethods.map(method => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.optionItem,
                  nodeConfig.method === method && styles.optionItemSelected
                ]}
                onPress={() => setNodeConfig(prev => ({ ...prev, method }))}
              >
                <Text style={[
                  styles.optionText,
                  nodeConfig.method === method && styles.optionTextSelected
                ]}>
                  {method}
                </Text>
                {nodeConfig.method === method && <Check size={16} color="#6B46C1" />}
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {(nodeConfig.actionType === 'add_tag' || nodeConfig.actionType === 'remove_tag') && (
        <>
          <Text style={styles.settingsLabel}>Tag Name</Text>
          <TextInput
            style={styles.textInput}
            value={nodeConfig.tagName || ''}
            onChangeText={(text) => setNodeConfig(prev => ({ ...prev, tagName: text }))}
            placeholder="Enter tag name"
          />
        </>
      )}

      {nodeConfig.actionType === 'update_field' && (
        <>
          <Text style={styles.settingsLabel}>Field Name</Text>
          <TextInput
            style={styles.textInput}
            value={nodeConfig.fieldName || ''}
            onChangeText={(text) => setNodeConfig(prev => ({ ...prev, fieldName: text }))}
            placeholder="Enter field name"
          />

          <Text style={styles.settingsLabel}>New Value</Text>
          <TextInput
            style={styles.textInput}
            value={nodeConfig.fieldValue || ''}
            onChangeText={(text) => setNodeConfig(prev => ({ ...prev, fieldValue: text }))}
            placeholder="Enter new field value"
          />
        </>
      )}
    </View>
  );

  const renderConditionSettings = () => (
    <View style={styles.settingsSection}>
      <Text style={styles.settingsLabel}>Condition Type</Text>
      <View style={styles.optionsContainer}>
        {conditionTypes.map(condition => (
          <TouchableOpacity
            key={condition.value}
            style={[
              styles.optionItem,
              nodeConfig.condition === condition.value && styles.optionItemSelected
            ]}
            onPress={() => setNodeConfig(prev => ({ ...prev, condition: condition.value }))}
          >
            <Text style={[
              styles.optionText,
              nodeConfig.condition === condition.value && styles.optionTextSelected
            ]}>
              {condition.label}
            </Text>
            {nodeConfig.condition === condition.value && <Check size={16} color="#6B46C1" />}
          </TouchableOpacity>
        ))}
      </View>

      {(nodeConfig.condition === 'field_equals' || nodeConfig.condition === 'tag_exists') && (
        <>
          <Text style={styles.settingsLabel}>
            {nodeConfig.condition === 'field_equals' ? 'Field Name' : 'Tag Name'}
          </Text>
          <TextInput
            style={styles.textInput}
            value={nodeConfig.fieldName || nodeConfig.tagName || ''}
            onChangeText={(text) => setNodeConfig(prev => ({ 
              ...prev, 
              [nodeConfig.condition === 'field_equals' ? 'fieldName' : 'tagName']: text 
            }))}
            placeholder={nodeConfig.condition === 'field_equals' ? 'Enter field name' : 'Enter tag name'}
          />

          {nodeConfig.condition === 'field_equals' && (
            <>
              <Text style={styles.settingsLabel}>Expected Value</Text>
              <TextInput
                style={styles.textInput}
                value={nodeConfig.expectedValue || ''}
                onChangeText={(text) => setNodeConfig(prev => ({ ...prev, expectedValue: text }))}
                placeholder="Enter expected value"
              />
            </>
          )}
        </>
      )}
    </View>
  );

  const renderDelaySettings = () => (
    <View style={styles.settingsSection}>
      <Text style={styles.settingsLabel}>Duration</Text>
      <TextInput
        style={styles.textInput}
        value={nodeConfig.duration ? nodeConfig.duration.toString() : ''}
        onChangeText={(text) => {
          const num = parseInt(text) || 1;
          setNodeConfig(prev => ({ ...prev, duration: num }));
        }}
        placeholder="Enter duration (e.g., 1, 5, 30)"
        keyboardType="numeric"
      />

      <Text style={styles.settingsLabel}>Time Unit</Text>
      <View style={styles.optionsContainer}>
        {timeUnits.map(unit => (
          <TouchableOpacity
            key={unit.value}
            style={[
              styles.optionItem,
              nodeConfig.unit === unit.value && styles.optionItemSelected
            ]}
            onPress={() => setNodeConfig(prev => ({ ...prev, unit: unit.value }))}
          >
            <Text style={[
              styles.optionText,
              nodeConfig.unit === unit.value && styles.optionTextSelected
            ]}>
              {unit.label}
            </Text>
            {nodeConfig.unit === unit.value && <Check size={16} color="#6B46C1" />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.settingsLabel}>Skip Weekends</Text>
        <Switch
          value={nodeConfig.skipWeekends || false}
          onValueChange={(value) => setNodeConfig(prev => ({ ...prev, skipWeekends: value }))}
          trackColor={{ false: '#D1D5DB', true: '#6B46C1' }}
          thumbColor="#fff"
        />
      </View>
    </View>
  );

  const renderSettingsModal = () => (
    <Modal
      visible={showSettings}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowSettings(false)}
          >
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>
            Configure {selectedNode?.type?.charAt(0).toUpperCase() + selectedNode?.type?.slice(1)}
          </Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.headerButton, styles.deleteButton]}
              onPress={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={20} color="#EF4444" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveNodeSettings}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {selectedNode?.type === 'trigger' && renderTriggerSettings()}
          {selectedNode?.type === 'action' && renderActionSettings()}
          {selectedNode?.type === 'condition' && renderConditionSettings()}
          {selectedNode?.type === 'delay' && renderDelaySettings()}
        </ScrollView>
      </View>

      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>Delete Node?</Text>
            <Text style={styles.deleteModalText}>
              Are you sure you want to delete this {selectedNode?.type} node? This action cannot be undone.
            </Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={styles.deleteModalCancel}
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text style={styles.deleteModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteModalDelete}
                onPress={() => selectedNode && deleteNode(selectedNode.id)}
              >
                <Text style={styles.deleteModalDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.workflowName}>{workflow.name}</Text>
          <View style={styles.statusContainer}>
            {workflow.status === 'active' ? (
              <View style={styles.statusActive}>
                <Play size={12} color="#10B981" />
                <Text style={styles.statusText}>Active</Text>
              </View>
            ) : (
              <View style={styles.statusPaused}>
                <Pause size={12} color="#F59E0B" />
                <Text style={styles.statusText}>Draft</Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => {
            const newStatus = workflow.status === 'active' ? 'draft' : 'active';
            setWorkflow(prev => ({ ...prev, status: newStatus }));
            Alert.alert(
              'Workflow Status Changed',
              `Workflow is now ${newStatus === 'active' ? 'active and running' : 'paused'}`
            );
          }}
        >
          {workflow.status === 'active' ? (
            <Pause size={20} color="#fff" />
          ) : (
            <Play size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Canvas */}
      <ScrollView style={styles.canvas} showsVerticalScrollIndicator={false}>
        {workflow.nodes.map((node, index) => (
          <View key={node.id}>
            <TouchableOpacity 
              style={styles.node}
              onPress={() => openNodeSettings(node)}
              activeOpacity={0.7}
            >
              <View style={[styles.nodeIcon, { backgroundColor: getNodeColor(node.type) }]}>
                {getNodeIcon(node.type)}
              </View>
              <View style={styles.nodeContent}>
                <Text style={styles.nodeName}>{node.name}</Text>
                <Text style={styles.nodeDescription}>{node.description}</Text>
              </View>
              <TouchableOpacity 
                style={styles.nodeSettings}
                onPress={() => openNodeSettings(node)}
              >
                <Settings size={18} color="#6B7280" />
              </TouchableOpacity>
            </TouchableOpacity>
            
            {/* Connection line with add button */}
            {index < workflow.nodes.length - 1 && (
              <View style={styles.connectionContainer}>
                <View style={styles.connection} />
                <TouchableOpacity 
                  style={styles.addNodeButton}
                  onPress={() => {
                    Alert.alert(
                      'Add Node',
                      'What type of node would you like to add?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Action', onPress: () => addNode('action', index + 1) },
                        { text: 'Condition', onPress: () => addNode('condition', index + 1) },
                        { text: 'Delay', onPress: () => addNode('delay', index + 1) },
                      ]
                    );
                  }}
                >
                  <Plus size={16} color="#6B46C1" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        
        {/* Add final node button */}
        <TouchableOpacity 
          style={styles.addFinalNode}
          onPress={() => {
            Alert.alert(
              'Add Step',
              'What type of step would you like to add?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Action', onPress: () => addNode('action', workflow.nodes.length) },
                { text: 'Condition', onPress: () => addNode('condition', workflow.nodes.length) },
                { text: 'Delay', onPress: () => addNode('delay', workflow.nodes.length) },
              ]
            );
          }}
        >
          <Plus size={20} color="#6B46C1" />
          <Text style={styles.addFinalNodeText}>Add Step</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity 
          style={styles.toolbarButton}
          onPress={() => addNode('trigger', workflow.nodes.length)}
        >
          <Zap size={20} color="#6B46C1" />
          <Text style={styles.toolbarButtonText}>Trigger</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.toolbarButton}
          onPress={() => addNode('action', workflow.nodes.length)}
        >
          <Mail size={20} color="#14B8A6" />
          <Text style={styles.toolbarButtonText}>Action</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.toolbarButton}
          onPress={() => addNode('condition', workflow.nodes.length)}
        >
          <Filter size={20} color="#F59E0B" />
          <Text style={styles.toolbarButtonText}>Condition</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.toolbarButton}
          onPress={() => addNode('delay', workflow.nodes.length)}
        >
          <Clock size={20} color="#9CA3AF" />
          <Text style={styles.toolbarButtonText}>Delay</Text>
        </TouchableOpacity>
      </View>

      {renderSettingsModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerInfo: {
    flex: 1,
  },
  workflowName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusPaused: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  toggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6B46C1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    flex: 1,
    padding: 20,
  },
  node: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nodeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nodeContent: {
    flex: 1,
  },
  nodeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  nodeDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  nodeSettings: {
    padding: 8,
  },
  connectionContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  connection: {
    width: 2,
    height: 40,
    backgroundColor: '#D1D5DB',
  },
  addNodeButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#6B46C1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addFinalNode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    padding: 16,
    marginTop: 8,
    gap: 8,
  },
  addFinalNodeText: {
    fontSize: 16,
    color: '#6B46C1',
    fontWeight: '500',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  toolbarButton: {
    alignItems: 'center',
    gap: 4,
  },
  toolbarButtonText: {
    fontSize: 12,
    color: '#4B5563',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  headerButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 8,
  },
  saveButton: {
    backgroundColor: '#6B46C1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionItemSelected: {
    backgroundColor: '#EDE9FE',
    borderColor: '#6B46C1',
  },
  optionText: {
    fontSize: 16,
    color: '#6B7280',
  },
  optionTextSelected: {
    color: '#6B46C1',
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  
  // Delete Modal Styles
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  deleteModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  deleteModalText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  deleteModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteModalCancel: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteModalCancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
  },
  deleteModalDelete: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteModalDeleteText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
