import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar, Smartphone, Database, Download, Upload, Settings, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  status: 'active' | 'syncing' | 'error' | 'disconnected';
  lastSync?: string;
  description: string;
}

const IntegrationPanel: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      connected: true,
      status: 'active',
      lastSync: '2 min ago',
      description: 'Sync with your Google Calendar events'
    },
    {
      id: 'apple-calendar',
      name: 'Apple Calendar',
      icon: <Smartphone className="w-5 h-5 text-gray-600" />,
      connected: false,
      status: 'disconnected',
      description: 'Connect your Apple Calendar and iCloud events'
    },
    {
      id: 'notion',
      name: 'Notion',
      icon: <Database className="w-5 h-5 text-black" />,
      connected: true,
      status: 'syncing',
      lastSync: '5 min ago',
      description: 'Sync tasks and databases with Notion'
    },
    {
      id: 'outlook',
      name: 'Outlook',
      icon: <Calendar className="w-5 h-5 text-blue-500" />,
      connected: false,
      status: 'disconnected',
      description: 'Connect Microsoft Outlook calendar'
    }
  ]);

  const [autoSync, setAutoSync] = useState(true);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            connected: !integration.connected,
            status: !integration.connected ? 'syncing' : 'disconnected'
          }
        : integration
    ));

    // Simulate connection process
    setTimeout(() => {
      setIntegrations(prev => prev.map(integration => 
        integration.id === id && integration.connected
          ? { ...integration, status: 'active', lastSync: 'Just now' }
          : integration
      ));
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'syncing':
        return <Clock className="w-4 h-4 text-warning animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-danger" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Connected';
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Error';
      default:
        return 'Disconnected';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'syncing':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'error':
        return 'bg-danger/10 text-danger border-danger/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const handleExport = () => {
    // Simulate export functionality
    const data = {
      tasks: [],
      calendar: [],
      wellness: {},
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smart-calendar-export.json';
    a.click();
  };

  const connectedIntegrations = integrations.filter(i => i.connected).length;

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-poppins text-xl font-bold">Integrations</h2>
          <p className="text-muted-foreground">Connect your favorite apps and services</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="font-medium">{connectedIntegrations}</span>
            <span className="text-muted-foreground">/{integrations.length} connected</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Auto-sync</span>
            <Switch
              checked={autoSync}
              onCheckedChange={setAutoSync}
            />
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="glass-card p-4 hover-lift">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  {integration.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{integration.name}</h3>
                  <p className="text-xs text-muted-foreground">{integration.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={`${getStatusColor(integration.status)} text-xs px-2 py-1`}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(integration.status)}
                    {getStatusText(integration.status)}
                  </span>
                </Badge>
                
                <Switch
                  checked={integration.connected}
                  onCheckedChange={() => toggleIntegration(integration.id)}
                />
              </div>

              {integration.lastSync && (
                <p className="text-xs text-muted-foreground">
                  Last sync: {integration.lastSync}
                </p>
              )}

              {integration.connected && (
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <Settings className="w-3 h-3 mr-1" />
                    Configure
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Sync Status */}
      {autoSync && (
        <Card className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <div>
                <h4 className="font-semibold text-sm">Auto-sync Active</h4>
                <p className="text-xs text-muted-foreground">Your calendar syncs every 5 minutes</p>
              </div>
            </div>
            
            <Button size="sm" variant="outline" onClick={() => setAutoSync(false)}>
              Disable
            </Button>
          </div>
        </Card>
      )}

      {/* Export/Import Section */}
      <Card className="glass-card p-4">
        <h3 className="font-semibold mb-3">Data Management</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import Data
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Backup Settings
          </Button>
        </div>

        <div className="mt-4 p-3 bg-accent/10 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-success mt-0.5" />
            <div>
              <p className="text-sm font-medium">All data encrypted</p>
              <p className="text-xs text-muted-foreground">Your calendar data is end-to-end encrypted and securely stored.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="ghost" className="gap-2">
          <Calendar className="w-3 h-3" />
          Sync All
        </Button>
        <Button size="sm" variant="ghost" className="gap-2">
          <Settings className="w-3 h-3" />
          Integration Settings
        </Button>
        <Button size="sm" variant="ghost" className="gap-2">
          <AlertCircle className="w-3 h-3" />
          Troubleshoot
        </Button>
      </div>
    </div>
  );
};

export default IntegrationPanel;