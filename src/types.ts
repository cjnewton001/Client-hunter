import { Timestamp } from 'firebase/firestore';

export type BusinessStatus = 'Not Contacted' | 'Contacted' | 'Interested' | 'Closed';

export interface Activity {
  date: Timestamp;
  type: 'Call' | 'Email' | 'Meeting' | 'Note';
  content: string;
}

export interface Business {
  id?: string;
  name: string;
  rating?: number;
  reviews?: number;
  phoneNumber?: string;
  address?: string;
  status: BusinessStatus;
  notes?: string;
  dateAdded: Timestamp;
  ownerUid: string;
  aiScore?: number;
  aiSummary?: string;
  aiOutreach?: string;
  nextContactDate?: Timestamp;
  activities?: Activity[];
}

export interface UserSettings {
  aiTone: 'Professional' | 'Friendly' | 'Aggressive' | 'Consultative';
  autoAnalyze: boolean;
  focusKeywords: string;
  followUpThreshold: number;
  emailAlerts: boolean;
  accentColor: string;
  customStatuses: string[];
  activityTypes: string[];
}

export const DEFAULT_SETTINGS: UserSettings = {
  aiTone: 'Professional',
  autoAnalyze: true,
  focusKeywords: '',
  followUpThreshold: 3,
  emailAlerts: true,
  accentColor: '#4f46e5', // Indigo-600
  customStatuses: ['Not Contacted', 'Contacted', 'Interested', 'Closed'],
  activityTypes: ['Call', 'Email', 'Meeting', 'Note'],
};

export interface FirestoreErrorInfo {
  error: string;
  operationType: string;
  path: string | null;
  authInfo: any;
}
