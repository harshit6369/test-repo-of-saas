export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent' | 'active';
  recipientCount: number;
  openRate: number;
  clickRate: number;
  sentAt?: string;
  scheduledFor?: string;
  createdAt: string;
  template: string;
  tags: string[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  content: string;
  variables: string[];
}
