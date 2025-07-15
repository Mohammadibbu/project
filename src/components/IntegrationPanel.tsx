import React, { useState } from 'react';
import { X, Calendar, FileText, Smartphone, Check, Loader, Zap } from 'lucide-react';

interface IntegrationPanelProps {
  onClose: () => void;
  darkMode: boolean;
}

export const IntegrationPanel: React.FC<IntegrationPanelProps> = ({ onClose, darkMode }) => {
  const [connectingTo, setConnectingTo] = useState<string | null>(null);
  
  const integrations = [
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync events and meetings with your Google Calendar',
      icon: Calendar,
      connected: true,
      color: darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800',
      features: ['Two-way sync', 'Real-time updates', 'Meeting links']
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Import tasks and notes from your Notion workspace',
      icon: FileText,
      connected: false,
      color: darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800',
      features: ['Task import', 'Note sync', 'Database integration']
    },
    {
      id: 'apple-calendar',
      name: 'Apple Calendar',
      description: 'Sync with your Apple Calendar and reminders',
      icon: Smartphone,
      connected: false,
      color: darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800',
      features: ['iCloud sync', 'Reminders', 'Siri integration']
    }
  ];

  const handleConnect = async (integrationId: string) => {
    setConnectingTo(integrationId);
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConnectingTo(null);
    // In a real app, you would update the integration status here
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto custom-scrollbar slide-up ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Integrations</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors interactive ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {integrations.map((integration) => {
            const IconComponent = integration.icon;
            const isConnecting = connectingTo === integration.id;
            
            return (
              <div
                key={integration.id}
                className={`p-6 border rounded-xl transition-all duration-300 hover-lift ${
                  darkMode ? 'border-gray-700 bg-gray-750' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${integration.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1">{integration.name}</h3>
                      <p className="text-sm opacity-75 mb-3">{integration.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {integration.features.map((feature, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'
                            }`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {integration.connected ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                    ) : isConnecting ? (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <Loader className="w-5 h-5 loading-spinner" />
                        <span className="text-sm font-medium">Connecting...</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleConnect(integration.id)}
                        className="btn-primary"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className={`mt-6 p-4 rounded-xl ${
          darkMode ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'
        }`}>
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">Pro Tips for Integrations</p>
              <ul className="text-sm opacity-75 space-y-1">
                <li>• Enable two-way sync for real-time updates across all platforms</li>
                <li>• Use calendar integration for automatic meeting link generation</li>
                <li>• Connect task managers to get AI-powered priority suggestions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};