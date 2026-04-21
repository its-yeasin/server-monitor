'use client';

import { useEffect, useState } from 'react';
import { Server } from '@server-monitor/types';
import ServerCard from '@/components/ServerCard';
import Header from '@/components/Header';
import { getServers } from '@/lib/api';
import { initWebSocket } from '@/lib/websocket';

export default function Home() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServers();
    const socket = initWebSocket();

    socket.on('metrics:update', ({ serverId, metrics }: any) => {
      setServers((prev) =>
        prev.map((s) =>
          s.id === serverId ? { ...s, lastSeen: new Date() } : s
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const loadServers = async () => {
    try {
      const data = await getServers();
      setServers(data);
    } catch (error) {
      console.error('Failed to load servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const onlineCount = servers.filter((s) => s.status === 'online').length;
  const warningCount = servers.filter((s) => s.status === 'warning').length;
  const offlineCount = servers.filter((s) => s.status === 'offline').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Server Dashboard</h1>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              {onlineCount} Online
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              {warningCount} Warning
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              {offlineCount} Offline
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : servers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No servers configured yet</p>
            <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
              Add Server
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {servers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
