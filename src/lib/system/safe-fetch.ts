export interface SafeFetchOptions extends RequestInit {
  timeout?: number;
}

export interface SafeFetchResult<T> {
  data: T | null;
  error: Error | null;
  status: number;
  ok: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function safeFetch<T>(
  url: string,
  options?: SafeFetchOptions
): Promise<SafeFetchResult<T>> {
  const { timeout = 30000, ...fetchOptions } = options || {};
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Response is not JSON
      }

      return {
        data: null,
        error: new Error(errorMessage),
        status: response.status,
        ok: false,
      };
    }

    const data = await response.json();
    
    return {
      data,
      error: null,
      status: response.status,
      ok: true,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        return {
          data: null,
          error: new Error('Request timed out. Please try again.'),
          status: 0,
          ok: false,
        };
      }
      
      return {
        data: null,
        error: err,
        status: 0,
        ok: false,
      };
    }

    return {
      data: null,
      error: new Error('An unexpected error occurred'),
      status: 0,
      ok: false,
    };
  }
}

export async function safeFetchArray<T>(
  url: string,
  options?: SafeFetchOptions
): Promise<SafeFetchResult<T[]>> {
  const result = await safeFetch<T[]>(url, options);
  
  if (!result.ok) {
    return result;
  }

  if (!Array.isArray(result.data)) {
    return {
      ...result,
      data: [],
      error: new Error('Invalid response: expected array'),
      ok: false,
    };
  }

  return result;
}

export function createSafeFetchWithDefaults(defaults: SafeFetchOptions) {
  return <T>(url: string, options?: SafeFetchOptions): Promise<SafeFetchResult<T>> => {
    return safeFetch<T>(url, { ...defaults, ...options });
  };
}