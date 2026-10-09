import { AxiosAdapter } from 'axios';
import { respond } from './data';

export const demoAdapter: AxiosAdapter = async (config) => {
    await new Promise(resolve => setTimeout(resolve, 80));
    let body = config.data;
    if (typeof body === 'string' && !config.url?.includes('/files/write')) {
        try { body = JSON.parse(body); } catch { body = {}; }
    }
    try {
        const data = respond(config.url || '', config.method || 'get', body || {}, config.params || {});
        return { data, status: 200, statusText: 'OK', headers: {}, config, request: { url: config.url } };
    } catch (cause) {
        const error: any = new Error(cause instanceof Error ? cause.message : 'Demo operation unavailable');
        error.response = { status: 422, data: { errors: [{ detail: error.message }] } };
        throw error;
    }
};
