import axios from 'axios';
import { Server } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getServers(): Promise<Server[]> {
  const response = await api.get('/api/servers');
  return response.data.data;
}

export async function getServer(id: string): Promise<Server> {
  const response = await api.get(`/api/servers/${id}`);
  return response.data.data;
}

export async function createServer(data: { hostname: string; ipAddress: string; tags?: string[] }) {
  const response = await api.post('/api/servers', data);
  return response.data.data;
}

export async function deleteServer(id: string) {
  await api.delete(`/api/servers/${id}`);
}

export async function getMetrics(serverId: string, start?: string, end?: string) {
  const response = await api.get(`/api/metrics/${serverId}`, {
    params: { start, end },
  });
  return response.data.data;
}

export { api };
