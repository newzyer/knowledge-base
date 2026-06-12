export interface UserInfo {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginForm {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export interface Document {
  id: number;
  userID?: number;
  title: string;
  content: string;
  summary?: string;
  categoryID?: number | null;
  category?: {
    id?: number;
    name: string;
  } | null;
  tags?: Array<{ id?: number; name: string }>;
  viewCount?: number;
  status?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  parentID?: number | null;
  icon?: string;
  sortOrder?: number;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  documentCount?: number;
}

export interface DocumentListResponse {
  data: {
    list: Document[];
    total: number;
    page?: number;
    pageSize?: number;
  };
}

export interface SearchResponse {
  data: {
    list: Array<
      Document & {
        category_name?: string;
      }
    >;
    total: number;
    page?: number;
    pageSize?: number;
  };
}

export interface ChatMessage {
  id?: number;
  userID?: number;
  sessionID?: string;
  role?: "user" | "assistant";
  content?: string;
  question?: string;
  answer?: string;
  references?: Array<{ id: number; title: string; content: string }>;
  createdAt?: string;
}

export interface ChatSession {
  id: number;
  sessionID: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  description?: string;
}

export interface UsageStats {
  totalTokens: number;
  totalRequests: number;
  todayTokens: number;
  todayRequests: number;
}

export interface UsageLog {
  id: number;
  tokens: number;
  model: string;
  createdAt: string;
}
