import { setLocalStorageValue } from './localStorage';
import { apiFetch } from './apiFetch';

export async function handleAuthMutation(
  endpoint: string,
  data: Record<string, any>
) {
  const response = await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const accessToken = response.data?.accessToken;
  const refreshToken = response.data?.refreshToken;
  if (accessToken && refreshToken) {
    setLocalStorageValue("accessToken", accessToken);
    setLocalStorageValue("refreshToken", refreshToken);
  }

  return response;
}
