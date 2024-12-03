export interface SupportRequest {
  id: string;
  username: string;
  title: string;
  problem: string;
  answer?: string;
  status: 'Todo' | 'InProgress' | 'Done';
  dateCreation: string;
  dateModification: string;
}