
export interface EmailData {
  recipients: string[];
  subject: string;
  body: string;
}

export interface Feedback {
  type: 'success' | 'error';
  message: string;
}
