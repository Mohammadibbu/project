import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Settings, 
  Zap, 
  AlertCircle,
  Sync,
  ExternalLink,
  Shield,
  Download,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  connected: boolean;
  lastSync?: string;
  taskCount?: number;
  eventCount?: number;
}

interface IntegrationPanelProps {
  integrations: Integration[];
  onConnect: (integrationId: string) => void;
  onSync: () => void;
  isSyncing: boolean;
}

const IntegrationPanel: React.FC<IntegrationPanelProps> = ({
  integrations,
  onConnect,
  onSync,
  isSyncing
}) => {
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState(15); // minutes

  const integrationDetails = {
    google: {
      icon: '📅',
      description: 'Sync with Google Calendar events and tasks',
      features: ['Calendar events', 'Google Tasks', 'Real-time sync', 'Meeting links'],
      color: 'bg-blue-500'
    },
    outlook: {
      icon: '📧',
      description: 'Connect with Microsoft Outlook calendar',
      features: ['Calendar events', 'Tasks', 'Teams integration', 'Email reminders'],
      color: 'bg-blue-600'
    },
    todoist: {
      icon: '✅',
      description: 'Import tasks and projects from Todoist',
      features: ['Tasks & projects', 'Labels & filters', 'Due dates', 'Priority levels'],
      color: 'bg-red-500'
    },
    asana: {
      icon: '🎯',
      description: 'Sync with Asana projects and tasks',
      features: ['Projects & tasks', 'Team collaboration', 'Custom fields', 'Subtasks'],
      color: 'bg-pink-500'
    }
  };

  const handleConnect = async (integrationId: string) => {
    // Simulate OAuth flow
    toast.info(`Redirecting to ${integrationId} authentication...`);
    
    // In a real app, this would open OAuth popup/redirect
    setTimeout(() => {
      onConnect(integrationId);
    }, 1500);
  };

  const handleDisconnect = (integrationId: string) => {
    toast.success(`${integrationId} disconnected successfully`);
  };

  const connectedCount = integrations.filter(i => i.connected).length;
  const totalIntegrations = integrations.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integrations</h2>
          <p className="text-muted-foreground">
            Connect your favorite apps to centralize your tasks and calendar
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="font-medium">{connectedCount}</span>
            <span className="text-muted-foreground">/{totalIntegrations} connected</span>
          </div>
          
          <Button 
            onClick={onSync} 
            disabled={isSyncing}
            className="hover-glow"
          >
            <Sync className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync All'}
          </Button>
        </div>
      </div>

      {/* Connection Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Connection Status</h3>
          <Badge variant={connectedCount > 0 ? 'default' : 'secondary'}>
            {connectedCount > 0 ? 'Active' : 'Setup Required'}
          </Badge>
        </div>
        
        <Progress value={(connectedCount / totalIntegrations) * 100} className="mb-4" />
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Connected Platforms</p>
            <p className="font-semibold">{connectedCount} of {totalIntegrations}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Sync</p>
            <p className="font-semibold">
              {integrations.find(i => i.connected)?.lastSync 
                ? new Date(integrations.find(i => i.connected)!.lastSync!).toLocaleTimeString()
                : 'Never'
              }
            </p>
          </div>
        </div>
      </Card>

      {/* Auto-sync Settings */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Auto-sync Settings</h3>
            <p className="text-sm text-muted-foreground">
              Automatically sync your data across all connected platforms
            </p>
          </div>
          <Switch
            checked={autoSync}
            onCheckedChange={setAutoSync}
          />
        </div>
        
        {autoSync && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Sync Interval</span>
              <select 
                value={syncInterval}
                onChange={(e) => setSyncInterval(Number(e.target.value))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value={5}>Every 5 minutes</option>
                <option value={15}>Every 15 minutes</option>
                <option value={30}>Every 30 minutes</option>
                <option value={60}>Every hour</option>
              </select>
            </div>
            
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 text-sm text-primary">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Secure Sync Active</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All data is encrypted and synced securely across your devices
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => {
          const details = integrationDetails[integration.id as keyof typeof integrationDetails];
          
          return (
            <Card key={integration.id} className="p-6 hover-glow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{details.icon}</div>
                  <div>
                    <h3 className="font-semibold">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground">{details.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {integration.connected ? (
                    <Badge className="bg-success/10 text-success border-success/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Features:</p>
                <div className="flex flex-wrap gap-1">
                  {details.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              {integration.connected && (
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="font-semibold">{integration.taskCount || 0}</div>
                    <div className="text-xs text-muted-foreground">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{integration.eventCount || 0}</div>
                    <div className="text-xs text-muted-foreground">Events</div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {integration.connected ? (
                  <>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDisconnect(integration.id)}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm" 
                    className="flex-1 hover-glow"
                    onClick={() => handleConnect(integration.id)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect {integration.name}
                  </Button>
                )}
              </div>

              {/* Last sync info */}
              {integration.connected && integration.lastSync && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last synced:</span>
                    <span>{new Date(integration.lastSync).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Data Management */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Data Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="flex-col h-20 gap-2">
            <Download className="h-5 w-5" />
            <span className="text-xs">Export Data</span>
          </Button>
          
          <Button variant="outline" className="flex-col h-20 gap-2">
            <Upload className="h-5 w-5" />
            <span className="text-xs">Import Data</span>
          </Button>
          
          <Button variant="outline" className="flex-col h-20 gap-2">
            <Shield className="h-5 w-5" />
            <span className="text-xs">Privacy Settings</span>
          </Button>
        </div>

        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Your data is secure</p>
              <p className="text-xs text-muted-foreground">
                All integrations use OAuth 2.0 and data is encrypted in transit and at rest.
                We never store your passwords or access more data than necessary.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IntegrationPanel;