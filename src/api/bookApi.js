import axios from "axios";

const DEFAULT_BASE_URL = "http://localhost:8080/api/books";
const BASE_URL = import.meta.env.VITE_BOOK_API_BASE_URL || DEFAULT_BASE_URL;
const ACCESS_TOKEN_KEY = "odm_accessToken";
const MOCK_ACCESS_TOKEN = "mock-jwt-access-token";
const DEFAULT_API_BASE_URL = "http://localhost:8080";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

const bookClient = axios.create({
  baseURL: BASE_URL,
});

const aiClient = axios.create({
  baseURL: API_BASE_URL,
});

const createRequestUrl = (path, params) => bookClient.getUri({ url: path, params });

const getAuthHeaders = () => {
  if (typeof window === "undefined") return undefined;

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!accessToken || accessToken === MOCK_ACCESS_TOKEN) return undefined;

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

const requireAuthHeaders = (requestUrl) => {
  const headers = getAuthHeaders();
  if (headers) return headers;

  const error = new Error("로그인이 필요합니다.");
  error.requestUrl = requestUrl;
  error.status = 401;
  error.body = { message: "로그인이 필요합니다." };
  throw error;
};

const getAiTextResponse = (data) => {
  if (typeof data === "string") return data;
  if (!data || typeof data !== "object") return "";

  if (data.data !== undefined) {
    const nestedValue = getAiTextResponse(data.data);
    if (nestedValue) return nestedValue;
  }

  const value = data.coreContent ?? data.summary ?? data.content ?? data.description ?? data.text ?? data.message;
  return typeof value === "string" ? value : "";
};

export const isValidIsbn13 = (isbn13) => /^\d{13}$/.test(String(isbn13 ?? "").trim());

const logApiSuccess = (label, requestUrl, response, keyword) => {
  console.group(label);
  if (keyword) {
    console.log("Keyword:", keyword);
  }
  console.log("Request URL:", requestUrl);
  console.log("Response Status:", response.status);
  console.log("Response Body:", response.data);
  console.groupEnd();
};

const logApiError = (label, requestUrl, error, keyword) => {
  const status = error.response?.status ?? "NO_RESPONSE";
  const body = error.response?.data ?? error.message;

  console.group(label);
  if (keyword) {
    console.log("Keyword:", keyword);
  }
  console.error("Request URL:", requestUrl);
  console.error("Response Status:", status);
  console.error("Response Body:", body);
  console.error("Error Message:", error.message);
  console.groupEnd();

  error.requestUrl = requestUrl;
  error.status = status;
  error.body = body;
  throw error;
};

export const normalizeBookList = (data) => {
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    if (data.success === true && Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.item)) return data.item;
    if (Array.isArray(data.books)) return data.books;
    if (Array.isArray(data.items)) return data.items;
  }

  return [];
};

export const normalizeBookDetail = (data) => {
  if (data && typeof data === "object" && data.success === true && data.data) {
    return data.data;
  }

  if (data && typeof data === "object" && data.data && !Array.isArray(data.data)) {
    return data.data;
  }

  return data;
};

export const getApiErrorMessage = (error) => {
  const status = error?.status ?? error?.response?.status;
  const requestUrl = error?.requestUrl ?? error?.config?.url;
  const responseBody = error?.body ?? error?.response?.data;
  const serverMessage =
    typeof responseBody === "string"
      ? responseBody
      : responseBody?.message || responseBody?.error || error?.message;

  return [
    "도서를 불러오지 못했습니다.",
    status ? `상태코드: ${status}` : null,
    serverMessage ? `메시지: ${serverMessage}` : null,
    requestUrl ? `요청 URL: ${requestUrl}` : null,
  ]
    .filter(Boolean)
    .join(" ");
};

export const getAiErrorMessage = (error, fallbackMessage) => {
  const status = error?.status ?? error?.response?.status;
  const requestUrl = error?.requestUrl ?? error?.config?.url;
  const responseBody = error?.body ?? error?.response?.data;
  const serverMessage =
    typeof responseBody === "string"
      ? responseBody
      : responseBody?.message || responseBody?.error || error?.message;

  return [
    fallbackMessage,
    status ? `상태코드: ${status}` : null,
    serverMessage ? `메시지: ${serverMessage}` : null,
    requestUrl ? `요청 URL: ${requestUrl}` : null,
  ]
    .filter(Boolean)
    .join(" ");
};

export const getBestSellerBooks = async () => {
  const requestUrl = createRequestUrl("/bestsellers");

  try {
    const response = await bookClient.get("/bestsellers");
    logApiSuccess("[BOOK API]", requestUrl, response);
    return response.data;
  } catch (error) {
    logApiError("[BOOK API]", requestUrl, error);
  }
};

export const searchBooks = async (keyword) => {
  const params = { keyword };
  const requestUrl = createRequestUrl("/search", params);

  try {
    const response = await bookClient.get("/search", { params });
    logApiSuccess("[SEARCH API]", requestUrl, response, keyword);
    return response.data;
  } catch (error) {
    logApiError("[SEARCH API]", requestUrl, error, keyword);
  }
};

export const getBookDetail = async (isbn13) => {
  const normalizedIsbn13 = String(isbn13 ?? "").trim();

  if (!isValidIsbn13(normalizedIsbn13)) {
    const error = new Error("ISBN13은 13자리 숫자여야 합니다.");
    error.requestUrl = normalizedIsbn13 ? createRequestUrl(`/${normalizedIsbn13}`) : "";
    error.status = "INVALID_ISBN13";
    error.body = { message: "ISBN13 없음" };
    throw error;
  }

  const requestUrl = createRequestUrl(`/${normalizedIsbn13}`);

  try {
    const response = await bookClient.get(`/${normalizedIsbn13}`);
    logApiSuccess("[BOOK API]", requestUrl, response);
    return response.data;
  } catch (error) {
    logApiError("[BOOK API]", requestUrl, error);
  }
};

export const getBookSummary = async (isbn13) => {
  const normalizedIsbn13 = String(isbn13 ?? "").trim();

  if (!isValidIsbn13(normalizedIsbn13)) {
    const error = new Error("ISBN13? 13?먮━ ?レ옄?ъ빞 ?⑸땲??");
    error.requestUrl = `${API_BASE_URL}/api/ai/book-summary`;
    error.status = "INVALID_ISBN13";
    error.body = { message: "ISBN13 ?놁쓬" };
    throw error;
  }

  const requestUrl = `${API_BASE_URL}/api/ai/book-summary`;

  try {
    const response = await aiClient.post("/api/ai/book-summary", { isbn13: normalizedIsbn13 }, { headers: requireAuthHeaders(requestUrl) });
    logApiSuccess("[AI BOOK SUMMARY API]", requestUrl, response);
    console.log("[AI SUMMARY RAW RESPONSE]", response.data);
    console.log("[AI SUMMARY PARSED TEXT]", getAiTextResponse(response.data));
    return getAiTextResponse(response.data);
  } catch (error) {
    logApiError("[AI BOOK SUMMARY API]", requestUrl, error);
  }
};

export const generateRecruitmentPost = async ({ bookTitle, author, publisher, description, category }) => {
  const normalizedBookTitle = String(bookTitle ?? "").trim();

  if (!normalizedBookTitle) {
    const error = new Error("bookTitle is required.");
    error.requestUrl = `${API_BASE_URL}/api/ai/recruitment-post`;
    error.status = "INVALID_BOOK_TITLE";
    error.body = { message: "bookTitle is required." };
    throw error;
  }

  const requestUrl = `${API_BASE_URL}/api/ai/recruitment-post`;
  const payload = {
    bookTitle: normalizedBookTitle,
    author: String(author ?? "").trim(),
    publisher: String(publisher ?? "").trim(),
    description: String(description ?? "").trim(),
    category: String(category ?? "").trim(),
  };

  try {
    const response = await aiClient.post("/api/ai/recruitment-post", payload, { headers: requireAuthHeaders(requestUrl) });
    logApiSuccess("[AI RECRUITMENT POST API]", requestUrl, response);
    return getAiTextResponse(response.data);
  } catch (error) {
    logApiError("[AI RECRUITMENT POST API]", requestUrl, error);
  }
};
