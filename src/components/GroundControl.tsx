
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  priority: 'normal' | 'high' | 'critical';
}

interface GroundControlProps {
  className?: string;
}

const GroundControl: React.FC<GroundControlProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [latency, setLatency] = useState(12);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'degraded' | 'lost'>('connected');
  
  // Simulate communications
  useEffect(() => {
    // Initial message
    addMessage({
      sender: 'COMMAND',
      content: 'Communications link established. Standing by for further instructions.',
      priority: 'normal'
    });
    
    // Periodic connection status changes
    const connectionInterval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.9) {
        setConnectionStatus('lost');
        setLatency(0);
        addMessage({
          sender: 'SYSTEM',
          content: 'WARNING: Communications link lost. Attempting to re-establish connection.',
          priority: 'critical'
        });
      } else if (rand > 0.7) {
        setConnectionStatus('degraded');
        setLatency(Math.floor(80 + Math.random() * 150));
        addMessage({
          sender: 'SYSTEM',
          content: 'Warning: Communications link degraded. Packet loss detected.',
          priority: 'high'
        });
      } else if (connectionStatus !== 'connected') {
        setConnectionStatus('connected');
        setLatency(Math.floor(8 + Math.random() * 20));
        addMessage({
          sender: 'SYSTEM',
          content: 'Communications link restored to optimal status.',
          priority: 'normal'
        });
      } else {
        // Random latency fluctuations when connected
        setLatency(Math.floor(8 + Math.random() * 20));
      }
    }, 15000);
    
    // Random command messages
    const messageInterval = setInterval(() => {
      if (connectionStatus !== 'lost' && Math.random() > 0.6) {
        const possibleMessages = [
          { sender: 'COMMAND', content: 'Maintain current heading and altitude.', priority: 'normal' as const },
          { sender: 'COMMAND', content: 'Requesting status update on EEG readings.', priority: 'normal' as const },
          { sender: 'COMMAND', content: 'Weather conditions deteriorating in your sector.', priority: 'normal' as const },
          { sender: 'COMMAND', content: 'Standby for new mission parameters.', priority: 'high' as const },
          { sender: 'INTEL', content: 'Hostile aircraft detected in vicinity. Maintain awareness.', priority: 'high' as const },
          { sender: 'COMMAND', content: 'URGENT: Return to base immediately.', priority: 'critical' as const },
          { sender: 'COMMAND', content: 'Autopilot activation detected. Pilot status?', priority: 'high' as const },
          { sender: 'MEDICAL', content: 'EEG readings suggest pilot fatigue. Recommend course correction.', priority: 'high' as const },
        ];
        
        const randomMessage = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];
        addMessage(randomMessage);
      }
    }, 8000);
    
    return () => {
      clearInterval(connectionInterval);
      clearInterval(messageInterval);
    };
  }, [connectionStatus]);
  
  const addMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...messageData
    };
    
    setMessages(prev => [newMessage, ...prev].slice(0, 8));
  };
  
  const getConnectionStatusIndicator = () => {
    switch (connectionStatus) {
      case 'connected':
        return <div className="w-2 h-2 bg-eeg-green rounded-full"></div>;
      case 'degraded':
        return <div className="w-2 h-2 bg-eeg-yellow rounded-full animate-pulse-subtle"></div>;
      case 'lost':
        return <div className="w-2 h-2 bg-eeg-red rounded-full animate-blink"></div>;
    }
  };
  
  const getMessagePriorityClass = (priority: 'normal' | 'high' | 'critical') => {
    switch (priority) {
      case 'normal':
        return 'border-l-muted-foreground';
      case 'high':
        return 'border-l-eeg-yellow';
      case 'critical':
        return 'border-l-eeg-red';
    }
  };
  
  return (
    <div className={cn("glassmorphism", className)}>
      <div className="glass-panel-header">
        <h3 className="text-lg font-medium">Ground Control Communications</h3>
        <div className="flex items-center ml-auto">
          {getConnectionStatusIndicator()}
          <span className="text-xs ml-2">
            {connectionStatus === 'connected' ? 'ONLINE' : 
             connectionStatus === 'degraded' ? 'DEGRADED' : 'OFFLINE'}
          </span>
          {connectionStatus !== 'lost' && (
            <span className="text-xs ml-2 text-muted-foreground">
              {latency}ms
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4 h-[240px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            No messages received
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={cn(
                  "p-3 bg-radar-bg rounded-md border-l-2 animate-fade-in", 
                  getMessagePriorityClass(message.priority)
                )}
              >
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium">{message.sender}</div>
                  <div className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-sm">{message.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroundControl;
