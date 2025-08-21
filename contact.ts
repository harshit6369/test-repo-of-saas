export interface Contact {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  tags: string[];
  lists: string[];
  customFields: Record<string, any>;
  subscribed: boolean;
  createdAt: string;
  lastActivity?: string;
}

export interface ContactList {
  id: string;
  name: string;
  contactCount: number;
  createdAt: string;
}
