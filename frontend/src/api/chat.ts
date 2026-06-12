import request from "./request.ts";
import { useUserStore } from "@/stores/user.ts";
import type {
  ChatMessage,
  ChatSession,
  Document,
  UsageStats,
  UsageLog,
} from "./types.ts";

export interface StreamReference {
  documentID: number;
  documentName: string;
  score: number;
}

export interface ModelsResponse {
  providers: string[];
  models: Record<string, string[]>;
  currentProvider: string;
  currentModel: string;
}

export interface AskStreamCallbacks {
  onMessage?: (content: string) => void;
  onDone?: (sessionID: string) => void;
  onError?: (error: Error) => void;
  onReferences?: (references: StreamReference[]) => void;
}

export const chatAPI = {
  ask(data: {
    question: string;
    sessionID?: string;
    model?: string;
    documentIDs?: Array<number | string>;
  }): Promise<{ sessionID: string; answer: string }> {
    return request.post("/chat/ask", data);
  },

  askStream(
    data: {
      question: string;
      sessionID?: string;
      model?: string;
      documentIDs?: Array<number | string> | null;
    },
    callbacks: AskStreamCallbacks,
  ): void {
    const userStore = useUserStore();
    // const baseURL = import.meta.env.DEV ? '/api' : './api'
    const baseURL = "/api";

    fetch(`${baseURL}/chat/ask/stream`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Empty response body");
        }
        const decoder = new TextDecoder();
        let sessionID = "";
        let buffer = "";

        const read = (): void => {
          reader
            .read()
            .then(({ done, value }) => {
              if (done) {
                callbacks.onDone?.(sessionID);
                return;
              }

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                if (!line.startsWith("data:")) continue;
                const dataStr = line.slice(5).trim();
                if (!dataStr) continue;

                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.type === "references" && parsed.references) {
                    callbacks.onReferences?.(parsed.references);
                  } else {
                    if (parsed.content) {
                      callbacks.onMessage?.(parsed.content);
                    }
                  }
                  if (parsed.sessionID) {
                    sessionID = parsed.sessionID;
                  }
                } catch {
                  // 忽略解析错误
                }
              }

              read();
            })
            .catch((err) => {
              callbacks.onError?.(err);
            });
        };

        read();
      })
      .catch((err) => {
        callbacks.onError?.(err);
      });
  },

  getSessions(): Promise<{ sessions: ChatSession[] }> {
    return request.get("/chat/sessions");
  },

  getSession(
    sessionID: string,
  ): Promise<{ session: ChatSession; messages: ChatMessage[] }> {
    return request.get(`/chat/sessions/${sessionID}`);
  },

  deleteSession(sessionID: string): Promise<void> {
    return request.delete(`/chat/sessions/${sessionID}`);
  },

  indexDocument(documentID: number | string): Promise<void> {
    return request.post(`/documents/${documentID}/index`);
  },

  getModels(): Promise<ModelsResponse> {
    return request.get("/models");
  },

  selectModel(data: { provider: string; model: string }): Promise<void> {
    return request.post("/models/select", data);
  },

  getUsageStats(params: {
    startDate?: string;
    endDate?: string;
  }): Promise<{ data: UsageStats }> {
    return request.get("/chat/usage/stats", { params });
  },

  getUsageLogs(params: {
    page?: number;
    size?: number;
  }): Promise<{ data: UsageLog[]; total: number }> {
    return request.get("/chat/usage/logs", { params });
  },
};

export const documentAPI = {
  async getList(params?: {
    page?: number;
    size?: number;
    categoryId?: number;
    keyword?: string;
  }): Promise<{ documents: Document[]; total: number }> {
    const res = await request.get("/documents", { params });
    const list = res?.data?.list || [];
    const total = res?.data?.total || 0;
    return {
      documents: list,
      total,
    };
  },

  get(id: number | string): Promise<{ data: Document }> {
    return request.get(`/documents/${id}`);
  },

  create(
    data: Omit<Document, "id" | "createdAt" | "updatedAt">,
  ): Promise<{ data: Document }> {
    return request.post("/documents", data);
  },

  update(
    id: number | string,
    data: Partial<Document>,
  ): Promise<{ data: Document }> {
    return request.put(`/documents/${id}`, data);
  },

  delete(id: number | string): Promise<void> {
    return request.delete(`/documents/${id}`);
  },

  import(formData: FormData): Promise<{ data: Document }> {
    return request.post("/documents/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  exportMarkdown(id: number | string): Promise<Blob> {
    return request.get(`/documents/${id}/export/markdown`, {
      responseType: "blob",
    });
  },

  createIndex(id: number | string): Promise<void> {
    return request.post(`/documents/${id}/index`);
  },
};
