import React, { useState } from 'react';
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
  Play,
  Pause,
  Plus,
  Zap,
  Mail,
  Clock,
  Filter,
  Settings,
} from 'lucide-react-native';

export default function WorkflowEditorScreen() {
  const { id } = useLocalSearchParams();
  
  // Check if this is a new workflow
  const isNewWorkflow = (id as string).startsWith('workflow_') || (id as string).startsWith('template_');
  
  const [workflow, setWorkflow] = useState({
    id: id as string,
    name: isNewWorkflow ? 'New Workflow' : 'Welcome Series',
    status: isNewWorkflow ? 'draft' : 'active',
    nodes: isNewWorkflow ? [
      { id: '1', type: 'trigger', name: 'New Trigger', description: 'Click to configure trigger' },
    ] : [
      { id: '1', type: 'trigger', name: 'New Subscriber', description: 'When someone subscribes to newsletter' },
      { id: '2', type: 'delay', name: 'Wait 1 hour', description: 'Delay for 1 hour' },
      { id: '3', type: 'action', name: 'Send Welcome Email', description: 'Send welcome email template' },
      { id: '4', type: 'condition', name: 'Check Engagement', description: 'If email was opened' },
      { id: '5', type: 'action', name: 'Send Follow-up', description: 'Send follow-up email' },
    ],
  });

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'trigger':
        return <Zap size={20} color="#fff" />;
      case 'action':
        return <Mail size={20} color="#fff" />;
      case 'condition':
        return <Filter size={20} color="#fff" />;
      case 'delay':
        return <Clock size={20} color="#fff" />;
      default:
        return <Settings size={20} color="#fff" />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'trigger':
        return '#6B46C1';
      case 'action':
        return '#14B8A6';
      case 'condition':
        return '#F59E0B';
      case 'delay':
        return '#9CA3AF';
      default:
        return '#6B7280';
    }
  };
  
  const addNode = (type: string, position: number) => {
    const newNode = {
      id: `node_${Date.now()}`,
      type,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      description: `Click to configure this ${type}`,
    };
    
    setWorkflow(prev => {
      const newNodes = [...prev.nodes];
      newNodes.splice(position, 0, newNode);
      return { ...prev, nodes: newNodes };
    });
    
    Alert.alert('Node Added', `${type.charAt(0).toUpperCase() + type.slice(1)} node has been added to your workflow.`);
  };

  return (
    <View style={styles.container}>
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
                <Text style={styles.statusText}>Paused</Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => {
            const newStatus = workflow.status === 'active' ? 'paused' : 'active';
            setWorkflow(prev => ({ ...prev, status: newStatus }));
            Alert.alert(
              'Workflow Status Changed',
              `Workflow is now ${newStatus === 'active' ? 'active' : 'paused'}`
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

      <ScrollView style={styles.canvas} showsVerticalScrollIndicator={false}>
        {workflow.nodes.map((node, index) => (
          <View key={node.id}>
            <TouchableOpacity 
              style={styles.node}
              onPress={() => {
                Alert.alert(
                  'Configure Node',
                  `Configure ${node.name}`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Edit', onPress: () => console.log('Edit node:', node.id) },
                    { text: 'Delete', style: 'destructive', onPress: () => {
                      setWorkflow(prev => ({
                        ...prev,
                        nodes: prev.nodes.filter(n => n.id !== node.id)
                      }));
                    }}
                  ]
                );
              }}
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
                onPress={() => {
                  Alert.alert('Node Settings', `Settings for ${node.name}`);
                }}
              >
                <Settings size={18} color="#6B7280" />
              </TouchableOpacity>
            </TouchableOpacity>
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
        
        <TouchableOpacity 
          style={styles.addFinalNode}
          onPress={() => {
            Alert.alert(
              'Add Final Step',
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
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B98120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPaused: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500' as const,
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
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 2,
  },
  nodeDescription: {
    fontSize: 13,
    color: '#6B7280',
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
  },
  addFinalNode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed' as const,
    borderColor: '#D1D5DB',
    padding: 16,
    marginTop: 8,
  },
  addFinalNodeText: {
    fontSize: 16,
    color: '#6B46C1',
    fontWeight: '500' as const,
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
});
