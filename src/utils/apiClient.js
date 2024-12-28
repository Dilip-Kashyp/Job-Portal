const BASE_URL = "140.245.217.140/api/v1";

export async function apiClient({
  url,
  method = "GET",
  body = null,
  headers = {},
}) {
  try {
    const token = localStorage.getItem("token");

    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Client Error:", error.message);
    throw error;
  }
}
