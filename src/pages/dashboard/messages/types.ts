export type MessageStatus = "unread" | "read" | "archived";

export interface MessageItem {
  id: string;
  sender: string;
  subtitle: string;
  source: string;
  snippet: string;
  email?: string;
  subject?: string;
  content?: string;
  date: string;
  status: MessageStatus;
  createdAt?: string;
  isNew?: boolean;
}

export type MessageFilterTab = "all" | "unread" | "read" | "archived";

export interface MessagesApiResponse {
  readonly success: boolean;
  readonly unreadCount: number;
  readonly newlyReceivedCount?: number;
  readonly total: number;
  readonly data: readonly MessageItem[];
}

export interface UnreadCountApiResponse {
  readonly success: boolean;
  readonly unreadCount: number;
  readonly newlyReceivedCount?: number;
  readonly timestamp?: string;
}

export interface SendReplyPayload {
  readonly recipient?: string;
  readonly content?: string;
  readonly replyContent?: string;
  readonly recipientEmail?: string;
}
