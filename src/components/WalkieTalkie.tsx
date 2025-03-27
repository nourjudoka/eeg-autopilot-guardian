
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Radio, Mic, Volume2, UserRound, Clock, MessageSquare, ShieldAlert } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  priority: 'normal' | 'urgent' | 'critical';
  channel: string;
}

interface WalkieTalkieProps {
  className?: string;
}

const WalkieTalkie: React.FC<WalkieTalkieProps> = ({ className }) => {
  const [activeChannel, setActiveChannel] = useState('COMMAND');
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const channels = [
    { id: 'COMMAND', name: 'Command', color: 'text-egypt-gold' },
    { id: 'TACTICAL', name: 'Tactical', color: 'text-eeg-green' },
    { id: 'RECON', name: 'Reconnaissance', color: 'text-eeg-blue' },
    { id: 'EMERGENCY', name: 'Emergency', color: 'text-eeg-red' }
  ];
  
  // Simulate receiving messages
  useEffect(() => {
    const pilots = ['Capt. Ahmed', 'Lt. Mahmoud', 'Maj. Hassan', 'Col. Karim'];
    const groundUnits = ['Ground Control', 'Base Command', 'Delta Squad', 'Recon Team Alpha'];
    const tacticalMessages = [
      'Patrol complete in eastern sector, proceeding to checkpoint gamma.',
      'Visual contact with target convoy, awaiting instructions.',
      'Radar shows unidentified craft at vector 045, altitude 28,000.',
      'Missile systems online, target locked.',
      'Fuel at 45%, returning to base.',
      'Permission to engage hostile targets.',
      'Weather conditions deteriorating, visibility reduced to 800 meters.',
      'ETA to drop zone is 5 minutes.',
      'Troops deployed successfully, establishing perimeter.'
    ];
    const emergencyMessages = [
      'Taking fire from eastern ridge, requesting air support!',
      'Engine failure detected, initiating emergency protocols.',
      'Radar jamming detected, switching to backup systems.',
      'Multiple bogeys approaching from vector 130, weapons hot!',
      'Avionics system compromised, switching to manual control.'
    ];
    
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const isEmergency = Math.random() > 0.85;
        const sender = Math.random() > 0.5 ? 
          pilots[Math.floor(Math.random() * pilots.length)] : 
          groundUnits[Math.floor(Math.random() * groundUnits.length)];
        
        const messageChannel = isEmergency ? 'EMERGENCY' : 
                               Math.random() > 0.7 ? 'COMMAND' :
                               Math.random() > 0.5 ? 'TACTICAL' : 'RECON';
                               
        const messageContent = isEmergency ? 
          emergencyMessages[Math.floor(Math.random() * emergencyMessages.length)] : 
          tacticalMessages[Math.floor(Math.random() * tacticalMessages.length)];
          
        const priority = isEmergency ? (Math.random() > 0.5 ? 'critical' : 'urgent') : 'normal';
        
        const newMessage: Message = {
          id: Date.now().toString(),
          sender,
          content: messageContent,
          timestamp: new Date(),
          priority,
          channel: messageChannel
        };
        
        setMessages(prev => [newMessage, ...prev].slice(0, 50)); // Keep only the last 50 messages
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleTransmit = () => {
    setIsTransmitting(true);
    
    // Simulate transmission delay
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'You (Command)',
        content: 'Message acknowledged. Proceed with mission as planned.',
        timestamp: new Date(),
        priority: 'normal',
        channel: activeChannel
      };
      
      setMessages(prev => [newMessage, ...prev]);
      setIsTransmitting(false);
    }, 2000);
  };
  
  const getPriorityColor = (priority: 'normal' | 'urgent' | 'critical') => {
    switch (priority) {
      case 'critical':
        return 'text-eeg-red';
      case 'urgent':
        return 'text-eeg-yellow';
      default:
        return 'text-muted-foreground';
    }
  };
  
  const getChannelColor = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    return channel?.color || 'text-muted-foreground';
  };
  
  const filteredMessages = messages.filter(msg => 
    activeChannel === 'COMMAND' || msg.channel === activeChannel
  );
  
  return (
    <div className={cn("glassmorphism", className)}>
      <div className="glass-panel-header">
        <h3 className="text-lg font-medium flex items-center">
          <Radio className="mr-2 h-4 w-4" /> Communication System
        </h3>
        <div className="text-sm text-muted-foreground">FREQ: 157.325 MHz</div>
      </div>
      
      <div className="p-4">
        <div className="flex mb-4">
          <div className="grid grid-cols-4 gap-1 w-full">
            {channels.map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={cn(
                  "py-1 px-2 text-xs transition-colors rounded",
                  activeChannel === channel.id 
                    ? `bg-radar-bg ${channel.color}` 
                    : "text-muted-foreground hover:bg-radar-bg/50"
                )}
              >
                {channel.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-radar-bg rounded-md h-40 p-2 mb-4 overflow-y-auto scrollbar-hide">
          {filteredMessages.length > 0 ? (
            <div className="space-y-2">
              {filteredMessages.map((message) => (
                <div key={message.id} className="text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserRound className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="font-medium">{message.sender}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={cn("text-[10px]", getChannelColor(message.channel))}>
                        {message.channel}
                      </span>
                      <Clock className="h-2 w-2 mx-1 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-3"></div>
                    <div className="flex-1">
                      <p className={cn(
                        "pl-1 border-l-2", 
                        getPriorityColor(message.priority),
                        message.priority === 'critical' ? "border-eeg-red" : 
                        message.priority === 'urgent' ? "border-eeg-yellow" : 
                        "border-muted-foreground/30"
                      )}>
                        {message.content}
                        {message.priority !== 'normal' && (
                          <span className={cn("ml-1 font-medium text-[10px]", getPriorityColor(message.priority))}>
                            [{message.priority.toUpperCase()}]
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              No messages on this channel
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <button 
              className={cn(
                "p-1 rounded", 
                isMuted ? "bg-eeg-red/20 text-eeg-red" : "bg-radar-bg text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setIsMuted(!isMuted)}
            >
              <Volume2 className="h-4 w-4" />
            </button>
            
            <div className="flex items-center w-28">
              <span className="text-xs mr-2">{volume}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                disabled={isMuted}
                className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-xs">
              <ShieldAlert className="h-3 w-3 mr-1 text-egypt-gold" />
              <span>SECURE</span>
            </div>
            
            <button
              className={cn(
                "flex items-center px-3 py-1 rounded text-xs",
                isTransmitting 
                  ? "bg-eeg-red text-white animate-pulse-subtle" 
                  : "bg-egypt-gold/20 text-egypt-gold hover:bg-egypt-gold/30"
              )}
              onClick={handleTransmit}
              disabled={isTransmitting}
            >
              <Mic className={cn("h-3 w-3 mr-1", isTransmitting ? "animate-pulse" : "")} />
              {isTransmitting ? "TRANSMITTING..." : "TRANSMIT"}
            </button>
          </div>
        </div>
        
        <div className="flex items-center">
          <MessageSquare className="h-3 w-3 mr-1 text-muted-foreground" />
          <div className="text-xs text-muted-foreground">{messages.length} messages received</div>
        </div>
      </div>
    </div>
  );
};

export default WalkieTalkie;
