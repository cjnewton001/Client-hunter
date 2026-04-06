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

export interface FirestoreErrorInfo {
  error: string;
  operationType: string;
  path: string | null;
  authInfo: any;
}
