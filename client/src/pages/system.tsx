import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Switch } from "../components/ui/switch";
import { Input } from "../components/ui/input";
import { 
  Settings,
  Database,
  Zap,
  Shield,
  Users,
  Bell,
  Globe,
  Clock,
  HardDrive,
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Save
} from "lucide-react";

// Dati di sistema realistici
const systemData = {
  serverHealth: {
    status: "healthy",
    uptime: "15 giorni, 8 ore",
    cpu: 34,
    memory: 68,
    disk: 45,
    network: 12,
    requests: 15420,
    errors: 23
  },
  integrations: [
    { 
      name: "GestLine ERP", 
      status: "online", 
      lastSync: "2 min fa", 
      syncCount: 1547,
      errors: 0,
      enabled: true 
    },
    { 
      name: "ODOO", 
      status: "online", 
      lastSync: "5 min fa", 
      syncCount: 892,
      errors: 1,
      enabled: true 
    },
    { 
      name: "PharmaEVO", 
      status: "syncing", 
      lastSync: "1 ora fa", 
      syncCount: 234,
      errors: 3,
      enabled: true 
    },
    { 
      name: "eBay API", 
      status: "online", 
      lastSync: "10 min fa", 
      syncCount: 567,
      errors: 0,
      enabled: true 
    },
    { 
      name: "WIKENSHIP", 
      status: "warning", 
      lastSync: "3 ore fa", 
      syncCount: 145,
      errors: 12,
      enabled: false 
    },
    { 
      name: "WhatsApp Business", 
      status: "offline", 
      lastSync: "1 giorno fa", 
      syncCount: 89,
      errors: 5,
      enabled: false 
    }
  ],
  security: {
    lastBackup: "2024-01-15 03:30",
    backupStatus: "success",
    activeUsers: 12,
    failedLogins: 3,
    securityScore: 94,
    sslExpiry: "2024-06-15",
    encryptionStatus: "active"
  },
  notifications: {
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    webhookEnabled: true,
    alertThresholds: {
      cpu: 80,
      memory: 85,
      disk: 90,
      errors: 50
    }
  },
  maintenance: [
    {
      type: "Database Cleanup",
      scheduled: "2024-01-20 02:00",
      status: "planned",
      description: "Pulizia logs e dati temporanei"
    },
    {
      type: "Security Update",
      scheduled: "2024-01-18 01:00",
      status: "completed",
      description: "Aggiornamento patches sicurezza"
    },
    {
      type: "Backup Verification",
      scheduled: "2024-01-16 03:00",
      status: "completed",
      description: "Test di ripristino backup"
    }
  ],
  logs: [
    {
      level: "info",
      timestamp: "2024-01-15 14:32:15",
      message: "Sincronizzazione GestLine completata con successo",
      source: "integration-service"
    },
    {
      level: "warning",
      timestamp: "2024-01-15 14:28:03",
      message: "WIKENSHIP: Rate limit raggiunto, retry in 10 minuti",
      source: "wikenship-connector"
    },
    {
      level: "error",
      timestamp: "2024-01-15 14:15:42",
      message: "PharmaEVO: Timeout durante la sincronizzazione prodotti",
      source: "pharmaevo-service"
    },
    {
      level: "info",
      timestamp: "2024-01-15 14:10:30",
      message: "Nuovo utente registrato: mario.rossi@example.com",
      source: "auth-service"
    }
  ]
};

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    online: { color: "bg-green-100 text-green-700", text: "Online" },
    offline: { color: "bg-red-100 text-red-700", text: "Offline" },
    syncing: { color: "bg-blue-100 text-blue-700", text: "Syncing" },
    warning: { color: "bg-yellow-100 text-yellow-700", text: "Warning" },
    error: { color: "bg-red-100 text-red-700", text: "Error" }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.offline;
  
  return (
    <Badge className={`${config.color} text-xs font-medium`}>
      {config.text}
    </Badge>
  );
}

function MetricCard({ title, value, unit, icon: Icon, progress, status }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">
          {value}{unit && <span className="text-sm text-slate-500 ml-1">{unit}</span>}
        </div>
        {progress !== undefined && (
          <div className="mt-2">
            <Progress 
              value={progress} 
              className={`h-2 ${
                progress > 80 ? '[&>div]:bg-red-500' : 
                progress > 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'
              }`}
            />
            <p className="text-xs text-slate-500 mt-1">{progress}% utilizzato</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SystemPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sistema</h1>
          <p className="text-sm text-slate-600">Configurazione e monitoraggio del sistema</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Backup
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aggiorna
          </Button>
        </div>
      </div>

      {/* Server Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Stato del Server</span>
            <StatusBadge status={systemData.serverHealth.status} />
          </CardTitle>
          <CardDescription>Uptime: {systemData.serverHealth.uptime}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="CPU"
              value={systemData.serverHealth.cpu}
              unit="%"
              icon={Cpu}
              progress={systemData.serverHealth.cpu}
            />
            <MetricCard
              title="Memoria"
              value={systemData.serverHealth.memory}
              unit="%"
              icon={HardDrive}
              progress={systemData.serverHealth.memory}
            />
            <MetricCard
              title="Disco"
              value={systemData.serverHealth.disk}
              unit="%"
              icon={Database}
              progress={systemData.serverHealth.disk}
            />
            <MetricCard
              title="Richieste/h"
              value={systemData.serverHealth.requests}
              icon={Globe}
            />
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Integrazioni</span>
          </CardTitle>
          <CardDescription>Stato delle connessioni esterne</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemData.integrations.map((integration, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    integration.status === 'online' ? 'bg-green-500' :
                    integration.status === 'syncing' ? 'bg-blue-500' :
                    integration.status === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <h4 className="font-medium text-slate-900">{integration.name}</h4>
                    <div className="flex items-center space-x-3 text-sm text-slate-500">
                      <span>Ultimo sync: {integration.lastSync}</span>
                      <span>•</span>
                      <span>{integration.syncCount} operazioni</span>
                      {integration.errors > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-red-600">{integration.errors} errori</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <StatusBadge status={integration.status} />
                  <Switch checked={integration.enabled} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security & Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Sicurezza</span>
            </CardTitle>
            <CardDescription>Stato della sicurezza del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Security Score</span>
              <div className="flex items-center space-x-2">
                <Progress value={systemData.security.securityScore} className="w-24 h-2" />
                <span className="font-medium text-green-600">{systemData.security.securityScore}%</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Ultimo Backup</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{systemData.security.lastBackup}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">SSL Certificate</span>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Scade: {systemData.security.sslExpiry}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Utenti Attivi</span>
                <span className="font-medium">{systemData.security.activeUsers}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Login Falliti (24h)</span>
                <span className="font-medium text-yellow-600">{systemData.security.failedLogins}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Manutenzione</span>
            </CardTitle>
            <CardDescription>Attività di manutenzione programmate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemData.maintenance.map((task, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    task.status === 'completed' ? 'bg-green-500' :
                    task.status === 'planned' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 text-sm">{task.type}</h4>
                    <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{task.scheduled}</p>
                  </div>
                  <Badge variant={task.status === 'completed' ? 'default' : 'outline'} className="text-xs">
                    {task.status === 'completed' ? 'Completato' : 
                     task.status === 'planned' ? 'Programmato' : 'In corso'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Log di Sistema</span>
          </CardTitle>
          <CardDescription>Ultimi eventi e operazioni</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {systemData.logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg text-sm">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  log.level === 'error' ? 'bg-red-500' :
                  log.level === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-slate-500">{log.timestamp}</span>
                    <Badge variant="outline" className="text-xs">{log.source}</Badge>
                  </div>
                  <p className="text-slate-900 mt-1">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Visualizza tutti i log
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifiche</span>
          </CardTitle>
          <CardDescription>Configurazione avvisi e notifiche</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">Canali di Notifica</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Email</span>
                  <Switch checked={systemData.notifications.emailEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Push</span>
                  <Switch checked={systemData.notifications.pushEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">SMS</span>
                  <Switch checked={systemData.notifications.smsEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Webhook</span>
                  <Switch checked={systemData.notifications.webhookEnabled} />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">Soglie di Allarme</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">CPU</span>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="number" 
                      value={systemData.notifications.alertThresholds.cpu}
                      className="w-16 h-8 text-xs"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Memoria</span>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="number" 
                      value={systemData.notifications.alertThresholds.memory}
                      className="w-16 h-8 text-xs"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Disco</span>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="number" 
                      value={systemData.notifications.alertThresholds.disk}
                      className="w-16 h-8 text-xs"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Salva Configurazione
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}