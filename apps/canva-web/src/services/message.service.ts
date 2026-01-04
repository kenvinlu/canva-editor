import type {
  Message,
  MessageListResponse,
  SendMessageRequest,
  SendReplyRequest,
} from '@canva-web/src/models/message.model';
import {
  $nextDelete,
  $nextFetch,
  $nextPatch,
  $nextPost,
} from './base-request.service';

export class MessageService {
  static async getMessages(params?: {
    page?: number;
    pageSize?: number;
    status?: 'read' | 'unread';
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.status) searchParams.append('status', params.status);

    const url = `/messages${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return $nextFetch<MessageListResponse>(url);
  }

  static async sendMessage(data: SendMessageRequest) {
    return $nextPost<{ success: boolean; message: Message }>('/messages/send', data);
  }

  static async deleteMessage(id: string) {
    return $nextDelete<{ success: boolean; messageId: string }>(`/messages/${id}`);
  }

  static async markAsRead(id: string) {
    return $nextPatch<{ success: boolean; messageId: string }>(`/messages/${id}`, { messageStatus: 'read' });
  }

  static async markAsUnread(id: string) {
    return $nextPatch<{ success: boolean; messageId: string }>(`/messages/${id}`, { messageStatus: 'unread' });
  }

  static async sendReplyMessage(data: SendReplyRequest) {
    return $nextPost<Message>(`/messages/${data.messageId}/reply`, {
      content: data.content,
    });
  }

  static async getMessage(id: string) {
    return $nextFetch<Message>(`/messages/${id}`);
  }
}
