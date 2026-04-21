import { Server } from '../types';
import Link from 'next/link';

interface ServerCardProps {
  server: Server & { agent_status?: string };
}

export default function ServerCard({ server }: ServerCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Link href={`/servers/${server.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">
              {server.hostname}
            </h3>
            <p className="text-sm text-gray-500">{server.ipAddress || server.ip_address}</p>
          </div>
          <span className={`w-3 h-3 rounded-full ${getStatusColor(server.status)}`}></span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status</span>
            <span className="font-medium text-gray-900">{getStatusText(server.status)}</span>
          </div>
          
          {server.lastSeen && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Seen</span>
              <span className="font-medium text-gray-900">
                {new Date(server.lastSeen).toLocaleTimeString()}
              </span>
            </div>
          )}

          {server.tags && server.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-3">
              {server.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
