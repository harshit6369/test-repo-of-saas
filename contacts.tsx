import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import {
  Search,
  Filter,
  Upload,
  UserPlus,
  Building,
  MoreVertical,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Contact } from '@/types/contact';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function ContactsScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(true);
  const [updateExisting, setUpdateExisting] = useState<boolean>(false);

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      email: 'john.smith@example.com',
      firstName: 'John',
      lastName: 'Smith',
      company: 'Tech Corp',
      phone: '+1 234-567-8900',
      tags: ['customer', 'premium'],
      lists: ['Newsletter', 'Product Updates'],
      customFields: {},
      subscribed: true,
      createdAt: '2024-01-15',
      lastActivity: '2024-03-10',
    },
    {
      id: '2',
      email: 'sarah.johnson@example.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      company: 'Design Studio',
      phone: '+1 234-567-8901',
      tags: ['lead', 'webinar'],
      lists: ['Newsletter'],
      customFields: {},
      subscribed: true,
      createdAt: '2024-02-20',
      lastActivity: '2024-03-12',
    },
    {
      id: '3',
      email: 'mike.wilson@example.com',
      firstName: 'Mike',
      lastName: 'Wilson',
      company: 'Marketing Agency',
      tags: ['customer'],
      lists: ['Product Updates'],
      customFields: {},
      subscribed: false,
      createdAt: '2024-01-10',
    },
  ]);

  const [importedFileName, setImportedFileName] = useState<string | null>(null);
  const [parsedCount, setParsedCount] = useState<number>(0);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState<boolean>(false);

  const filteredContacts = useMemo(
    () =>
      contacts.filter((contact) =>
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      ),
    [contacts, searchQuery]
  );

  const toggleContactSelection = useCallback((id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  }, []);

  const simpleCsvParse = useCallback((text: string): string[][] => {
    const rows: string[][] = [];
    let current: string[] = [];
    let field = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];
      if (inQuotes) {
        if (char === '"' && next === '"') {
          field += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          field += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          current.push(field);
          field = '';
        } else if (char === '\n' || char === '\r') {
          if (char === '\r' && next === '\n') i++;
          current.push(field);
          field = '';
          if (current.length > 1 || (current.length === 1 && current[0].trim().length > 0)) {
            rows.push(current);
          }
          current = [];
        } else {
          field += char;
        }
      }
    }
    current.push(field);
    if (current.length > 1 || (current.length === 1 && current[0].trim().length > 0)) rows.push(current);
    return rows;
  }, []);

  const mapRowsToContacts = useCallback((rows: string[][]): { contacts: Contact[]; errors: string[] } => {
    if (rows.length === 0) return { contacts: [], errors: ['Empty CSV'] };
    const header = rows[0].map((h) => h.trim().toLowerCase());
    const idx = (name: string) => header.indexOf(name);
    const out: Contact[] = [];
    const errors: string[] = [];

    const emailIdx = idx('email');
    const fnIdx = idx('firstname') !== -1 ? idx('firstname') : idx('first_name');
    const lnIdx = idx('lastname') !== -1 ? idx('lastname') : idx('last_name');

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const get = (i: number) => (i >= 0 && i < row.length ? row[i] : '');
      const email = get(emailIdx).trim();
      if (!email) {
        errors.push(`Row ${r + 1}: missing email`);
        continue;
      }
      const firstName = fnIdx !== -1 ? get(fnIdx).trim() : '';
      const lastName = lnIdx !== -1 ? get(lnIdx).trim() : '';
      const company = (() => {
        const i = header.indexOf('company');
        return i !== -1 ? get(i).trim() : undefined;
      })();
      const phone = (() => {
        const i = header.indexOf('phone');
        return i !== -1 ? get(i).trim() : undefined;
      })();
      const tags = (() => {
        const i = header.indexOf('tags');
        const raw = i !== -1 ? get(i).trim() : '';
        return raw ? raw.split('|').flatMap((v) => v.split(',')).map((t) => t.trim()).filter(Boolean) : [];
      })();
      const lists = (() => {
        const i = header.indexOf('lists');
        const raw = i !== -1 ? get(i).trim() : '';
        return raw ? raw.split('|').flatMap((v) => v.split(',')).map((t) => t.trim()).filter(Boolean) : [];
      })();
      const subscribed = (() => {
        const i = header.indexOf('subscribed');
        const raw = i !== -1 ? get(i).trim().toLowerCase() : 'true';
        return raw === 'true' || raw === '1' || raw === 'yes';
      })();

      const c: Contact = {
        id: `${Date.now()}-${r}-${Math.random().toString(36).slice(2, 8)}`,
        email,
        firstName: firstName || 'Unknown',
        lastName: lastName || 'Unknown',
        company,
        phone,
        tags,
        lists,
        customFields: {},
        subscribed,
        createdAt: new Date().toISOString(),
      };
      out.push(c);
    }
    return { contacts: out, errors };
  }, []);

  const handleUploadFile = useCallback(async () => {
    console.log('[Contacts] Opening file picker');
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', 'application/csv', 'text/plain', 'application/octet-stream'],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if ((res as any).canceled) {
        console.log('[Contacts] Document picking canceled');
        return;
      }

      const asset = (res as any).assets?.[0];
      if (!asset) {
        Alert.alert('No file selected', 'Please choose a CSV file');
        return;
      }

      setIsParsing(true);
      setImportedFileName(asset.name ?? 'contacts.csv');

      const nameLower = (asset.name ?? '').toLowerCase();
      if (nameLower.endsWith('.xlsx') || nameLower.endsWith('.xls')) {
        Alert.alert('Excel not supported', 'Please export your spreadsheet as CSV and upload the CSV file.');
        setIsParsing(false);
        return;
      }
      setParseErrors([]);
      setParsedCount(0);

      let csvText: string | null = null;
      if (Platform.OS === 'web' && (asset as any).file) {
        const file: File = (asset as any).file as File;
        csvText = await file.text();
      } else if (asset.uri) {
        const encoding: FileSystem.ReadingOptions['encoding'] = FileSystem.EncodingType.UTF8 as unknown as FileSystem.ReadingOptions['encoding'];
        csvText = await FileSystem.readAsStringAsync(asset.uri, { encoding });
      }

      if (!csvText) {
        Alert.alert('Unable to read file', 'Please try again with a valid CSV file');
        setIsParsing(false);
        return;
      }

      const rows = simpleCsvParse(csvText);
      console.log('[Contacts] Parsed rows:', rows.length);
      const { contacts: newContacts, errors } = mapRowsToContacts(rows);

      let merged = [...contacts];
      const existingByEmail = new Map(merged.map((c) => [c.email.toLowerCase(), c] as const));

      newContacts.forEach((c) => {
        const key = c.email.toLowerCase();
        const exist = existingByEmail.get(key);
        if (exist) {
          if (removeDuplicates) {
            if (updateExisting) {
              const updated: Contact = { ...exist, ...c, id: exist.id, createdAt: exist.createdAt };
              merged = merged.map((m) => (m.id === exist.id ? updated : m));
            }
          } else {
            merged.push(c);
          }
        } else {
          merged.push(c);
        }
      });

      setContacts(merged);
      setParsedCount(newContacts.length);
      setParseErrors(errors);
      Alert.alert('File parsed', `Parsed ${newContacts.length} contacts${errors.length ? `, ${errors.length} issues` : ''}`);
    } catch (e: any) {
      console.error('[Contacts] File import error', e);
      Alert.alert('Import error', e?.message ?? 'Unknown error');
    } finally {
      setIsParsing(false);
    }
  }, [contacts, removeDuplicates, updateExisting, mapRowsToContacts, simpleCsvParse]);

  const handleImportContacts = useCallback(() => {
    console.log('Importing contacts with options:', { removeDuplicates, updateExisting });
    Alert.alert('Import Complete', `Imported ${parsedCount} contact${parsedCount === 1 ? '' : 's'}`);
    setShowImportModal(false);
    setImportedFileName(null);
    setParsedCount(0);
    setParseErrors([]);
  }, [parsedCount]);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    tags: '',
  });

  const handleAddContact = useCallback(() => {
    console.log('Opening add contact modal');
    setShowAddModal(true);
  }, []);
  
  const handleSaveNewContact = useCallback(() => {
    if (!newContact.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    
    const contact: Contact = {
      id: `contact_${Date.now()}`,
      email: newContact.email.trim(),
      firstName: newContact.firstName.trim() || 'Unknown',
      lastName: newContact.lastName.trim() || 'Unknown',
      company: newContact.company.trim() || undefined,
      phone: newContact.phone.trim() || undefined,
      tags: newContact.tags.split(',').map(t => t.trim()).filter(Boolean),
      lists: [],
      customFields: {},
      subscribed: true,
      createdAt: new Date().toISOString(),
    };
    
    setContacts(prev => [contact, ...prev]);
    setNewContact({ firstName: '', lastName: '', email: '', company: '', phone: '', tags: '' });
    setShowAddModal(false);
    Alert.alert('Contact Added', 'New contact has been added successfully!');
  }, [newContact]);

  const handleFilterContacts = useCallback(() => {
    console.log('Opening filter options');
    Alert.alert('Filters', 'Filters would open here');
  }, []);

  const renderContact = useCallback(
    ({ item }: { item: Contact }) => (
      <TouchableOpacity
        testID={`contact-${item.id}`}
        style={styles.contactCard}
        onPress={() => router.push({ pathname: '/contact/[id]', params: { id: item.id } })}
      >
        <TouchableOpacity
          testID={`contact-checkbox-${item.id}`}
          style={styles.checkbox}
          onPress={() => toggleContactSelection(item.id)}
        >
          {selectedContacts.includes(item.id) && <View style={styles.checkboxChecked} />}
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(item.firstName?.[0] ?? 'U')}
            {(item.lastName?.[0] ?? 'N')}
          </Text>
        </View>

        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.contactEmail}>{item.email}</Text>
          {!!item.company && (
            <View style={styles.companyRow}>
              <Building size={12} color="#9CA3AF" />
              <Text style={styles.companyText}>{item.company}</Text>
            </View>
          )}
          <View style={styles.tagsRow}>
            {item.tags.slice(0, 2).map((tag, index) => (
              <View key={`${item.id}-tag-${index}`} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {item.tags.length > 2 && (
              <Text style={styles.moreText}>+{item.tags.length - 2}</Text>
            )}
          </View>
        </View>

        <View style={styles.contactActions}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: item.subscribed ? '#10B981' : '#EF4444' },
            ]}
          />
          <TouchableOpacity>
            <MoreVertical size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    ),
    [selectedContacts, toggleContactSelection]
  );

  return (
    <View style={styles.container} testID="contacts-screen">
      <View style={styles.header}>
        <View style={styles.searchContainer} testID="search-bar">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            testID="search-input"
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilterContacts}>
          <Filter size={20} color="#6B46C1" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {filteredContacts.length} contacts • {selectedContacts.length} selected
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            testID="open-import-modal"
            style={styles.importButton}
            onPress={() => setShowImportModal(true)}
          >
            <Upload size={16} color="#6B46C1" />
            <Text style={styles.importButtonText}>Import</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
            <UserPlus size={16} color="#fff" />
            <Text style={styles.addButtonText} testID="add-contact-btn">Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        testID="contacts-list"
        data={filteredContacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={showImportModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowImportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent} testID="import-modal">
            <Text style={styles.modalTitle}>Import Contacts</Text>
            <Text style={styles.modalDescription}>
              Upload a CSV file with your contacts
            </Text>

            <TouchableOpacity testID="upload-csv" style={styles.uploadArea} onPress={handleUploadFile}>
              <Upload size={32} color="#6B46C1" />
              <Text style={styles.uploadText}>Click to upload CSV</Text>
              <Text style={styles.uploadSubtext}>CSV (max 10MB)</Text>
            </TouchableOpacity>

            {importedFileName && (
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>{importedFileName}</Text>
                <Text style={styles.fileMeta}>{isParsing ? 'Parsing…' : `Parsed: ${parsedCount}`}</Text>
                {parseErrors.length > 0 && (
                  <Text style={styles.fileError}>
                    {`${parseErrors.length} issue${parseErrors.length === 1 ? '' : 's'}`} (first: {parseErrors[0]})
                  </Text>
                )}
              </View>
            )}

            <View style={styles.importOptions}>
              <Text style={styles.optionTitle}>Import Options</Text>
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setRemoveDuplicates(!removeDuplicates)}
              >
                <View style={styles.optionCheckbox}>
                  {removeDuplicates && <View style={styles.checkboxChecked} />}
                </View>
                <Text style={styles.optionText}>Remove duplicates</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setUpdateExisting(!updateExisting)}
              >
                <View style={styles.optionCheckbox}>
                  {updateExisting && <View style={styles.checkboxChecked} />}
                </View>
                <Text style={styles.optionText}>Update existing contacts</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                testID="cancel-import"
                style={styles.cancelButton}
                onPress={() => setShowImportModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="confirm-import"
                style={[styles.confirmButton, (!importedFileName || isParsing) && styles.confirmButtonDisabled]}
                disabled={!importedFileName || isParsing}
                onPress={handleImportContacts}
              >
                <Text style={styles.confirmButtonText}>{isParsing ? 'Working…' : 'Import'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent} testID="add-contact-modal">
            <Text style={styles.modalTitle}>Add New Contact</Text>
            <Text style={styles.modalDescription}>
              Enter contact information
            </Text>

            <View style={styles.formContainer}>
              <View style={styles.formRow}>
                <TextInput
                  style={[styles.formInput, { flex: 1, marginRight: 8 }]}
                  value={newContact.firstName}
                  onChangeText={(text) => setNewContact(prev => ({ ...prev, firstName: text }))}
                  placeholder="First Name"
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  style={[styles.formInput, { flex: 1, marginLeft: 8 }]}
                  value={newContact.lastName}
                  onChangeText={(text) => setNewContact(prev => ({ ...prev, lastName: text }))}
                  placeholder="Last Name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <TextInput
                style={styles.formInput}
                value={newContact.email}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, email: text }))}
                placeholder="Email Address *"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.formInput}
                value={newContact.company}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, company: text }))}
                placeholder="Company"
                placeholderTextColor="#9CA3AF"
              />
              
              <TextInput
                style={styles.formInput}
                value={newContact.phone}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, phone: text }))}
                placeholder="Phone Number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
              
              <TextInput
                style={styles.formInput}
                value={newContact.tags}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, tags: text }))}
                placeholder="Tags (comma separated)"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                testID="cancel-add-contact"
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddModal(false);
                  setNewContact({ firstName: '', lastName: '', email: '', company: '', phone: '', tags: '' });
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="save-new-contact"
                style={[styles.confirmButton, !newContact.email.trim() && styles.confirmButtonDisabled]}
                disabled={!newContact.email.trim()}
                onPress={handleSaveNewContact}
              >
                <Text style={styles.confirmButtonText}>Add Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    height: 44,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  statsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6B46C1',
  },
  importButtonText: {
    fontSize: 14,
    color: '#6B46C1',
    fontWeight: '500' as const,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#6B46C1',
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500' as const,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#6B46C1',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6B46C120',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#6B46C1',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  companyText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#6B7280',
  },
  moreText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  contactActions: {
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#1F2937',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed' as const,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadText: {
    fontSize: 16,
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  importOptions: {
    marginBottom: 24,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1F2937',
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    color: '#4B5563',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#6B46C1',
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500' as const,
  },
  fileInfo: {
    marginBottom: 16,
  },
  fileName: {
    fontSize: 13,
    color: '#1F2937',
  },
  fileMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  fileError: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
  },
  formContainer: {
    marginBottom: 24,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#fff',
    marginBottom: 16,
  },
});
