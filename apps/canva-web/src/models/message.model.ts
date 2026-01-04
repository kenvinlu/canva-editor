export interface MessageReply {
  id: string;
  content: string;
  senderName: string;
  senderEmail: string;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  content: string;
  messageStatus: 'unread' | 'read';
  replies?: MessageReply[];
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  subject: string;
  content: string;
}

export interface SendReplyRequest {
  messageId: string;
  content: string;
}

export interface MessageListResponse {
  messages: Message[];
  total: number;
  page: number;
  pageSize: number;
}
