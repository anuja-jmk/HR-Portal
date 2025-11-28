
export class HTTPUtils {
    // Use relative base path so Vite proxy can forward /api requests to the HR backend.
    private static BASE_URL = '/api';

    private static async request<T>(endpoint: string, method: string, body?: any, isForm = false): Promise<T> {
        const headers: HeadersInit = {};

        const config: RequestInit = {
            method,
            headers,
            credentials: 'include', // Important for cookies
        };

        if (body) {
            if (isForm && body instanceof FormData) {
                // Let the browser set Content-Type including boundary
                config.body = body as any;
            } else {
                headers['Content-Type'] = 'application/json';
                config.body = JSON.stringify(body);
            }
        }

        const response = await fetch(`${this.BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`HTTP Error: ${response.status} ${text}`);
        }

        // Try to parse JSON, but return empty object for 204
        if (response.status === 204) {
            // @ts-ignore
            return {} as T;
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            return response.json();
        }

        // If not JSON, return text as any
        // @ts-ignore
        return response.text() as any as T;
    }

    static async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, 'GET');
    }

    static async post<T>(endpoint: string, body: any): Promise<T> {
        return this.request<T>(endpoint, 'POST', body);
    }

    static async put<T>(endpoint: string, body: any): Promise<T> {
        return this.request<T>(endpoint, 'PUT', body);
    }

    static async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, 'DELETE');
    }

    static async postForm<T>(endpoint: string, form: FormData): Promise<T> {
        return this.request<T>(endpoint, 'POST', form, true);
    }

    static async putForm<T>(endpoint: string, form: FormData): Promise<T> {
        return this.request<T>(endpoint, 'PUT', form, true);
    }
}
