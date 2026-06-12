import request from "./request";
import type {
  LoginForm,
  RegisterForm,
  UserInfo,
  Document,
  Category,
  DocumentListResponse,
  SearchResponse,
} from "./types.ts";

export async function login(
  data: LoginForm,
): Promise<{ data: { token: string; user: UserInfo } }> {
  return request.post("/auth/login", data);
}

export async function register(
  data: RegisterForm,
): Promise<{ data: UserInfo }> {
  return request.post("/auth/register", data);
}

export async function getProfile(): Promise<{ data: UserInfo }> {
  return request.get("/user/profile");
}

export async function updateProfile(
  data: Partial<UserInfo>,
): Promise<{ data: UserInfo }> {
  return request.put("/user/profile", data);
}

export async function changePassword(data: {
  oldPassword: string;
  newPassword: string;
}): Promise<void> {
  return request.put("/user/password", data);
}

export async function getDocuments(params: {
  page?: number;
  pageSize?: number;
  categoryID?: number;
  keyword?: string;
}): Promise<DocumentListResponse> {
  return request.get("/documents", { params });
}

export async function getDocument(
  id: number | string,
): Promise<{ data: Document }> {
  return request.get(`/documents/${id}`);
}

export async function createDocument(
  data: Omit<Document, "id" | "createdAt" | "updatedAt">,
): Promise<{ data: Document }> {
  return request.post("/documents", data);
}

export async function updateDocument(
  id: number | string,
  data: Partial<Document>,
): Promise<{ data: Document }> {
  return request.put(`/documents/${id}`, data);
}

export async function deleteDocument(id: number | string): Promise<void> {
  return request.delete(`/documents/${id}`);
}

export async function importDocument(
  formData: FormData,
): Promise<{ data: Document }> {
  return request.post("/documents/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function exportMarkdown(id: number | string): Promise<Blob> {
  return request.get(`/documents/${id}/export/markdown`, {
    responseType: "blob",
  });
}

export async function getCategories(): Promise<{ data: Category[] }> {
  return request.get("/categories");
}

export async function createCategory(
  data: Omit<Category, "id">,
): Promise<{ data: Category }> {
  return request.post("/categories", data);
}

export async function updateCategory(
  id: number | string,
  data: Partial<Category>,
): Promise<{ data: Category }> {
  return request.put(`/categories/${id}`, data);
}

export async function deleteCategory(id: number | string): Promise<void> {
  return request.delete(`/categories/${id}`);
}

export async function searchDocuments(params: {
  keyword: string;
  page?: number;
  pageSize?: number;
  categoryID?: number;
}): Promise<SearchResponse> {
  return request.get("/search", { params });
}

export async function rebuildSearchIndex(): Promise<void> {
  return request.post("/search/rebuild");
}
