export interface Server {
  id: string;
  hostname: string;
  ipAddress: string;
  status: 'online' | 'warning' | 'offline';
  lastSeen: Date;
  tags: string[];
  createdAt: Date;
}

export interface SystemMetrics {
  serverId: string;
  timestamp: Date;
  cpu: {
    usage: number;
    cores: number;
    loadAvg: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
  };
}

export interface AlertRule {
  id: string;
  name: string;
  serverId: string;
  metric: 'cpu' | 'memory' | 'disk' | 'network';
  condition: 'gt' | 'lt' | 'eq';
  threshold: number;
  duration: number; // seconds
  enabled: boolean;
  createdAt: Date;
}

export interface Alert {
  id: string;
  ruleId: string;
  serverId: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  acknowledged: boolean;
  createdAt: Date;
}

export interface Agent {
  id: string;
  serverId: string;
  token: string;
  version: string;
  lastHeartbeat: Date;
  status: 'active' | 'inactive';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface MetricsQuery {
  serverId: string;
  start: Date;
  end: Date;
  interval?: string; // e.g., '1m', '5m', '1h'
}
