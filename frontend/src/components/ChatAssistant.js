import React, { useState, useRef, useEffect } from 'react';
import './ChatAssistant.css';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Maritime Incident Dashboard assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses = {
    'hello': "Hello! Welcome to the Maritime Incident Dashboard. I can help you understand how to use this application.",
    'help': "I can assist you with:\n• Understanding the dashboard charts\n• Navigating between different views\n• Interpreting incident data\n• Using filters and controls\n• General application features",
    'dashboard': "The dashboard shows maritime incident statistics with three main charts:\n• Vessel Type Distribution - Shows incidents by ship type\n• Incident Type Analysis - Categorizes incidents by type\n• Severity Levels - Displays incident severity distribution\n• Timeline View - Shows incidents over time with adjustable granularity",
    'incidents': "The Incident Reports page displays detailed cards for each maritime incident. You can view individual incident details including date, vessel type, incident type, and severity level.",
    'charts': "Our charts are interactive! You can:\n• Hover over chart elements for detailed information\n• Use the timeline granularity selector (hour/day/month)\n• View legends for color coding\n• All charts update in real-time",
    'navigation': "Use the navigation bar at the top to switch between:\n• Dashboard - Overview with charts and statistics\n• Incident Reports - Detailed incident cards view",
    'data': "The dashboard displays maritime incident data including:\n• Vessel types (Cargo Ship, Tanker, Fishing Vessel, etc.)\n• Incident types (Collision, Grounding, Fire, etc.)\n• Severity levels (Low, Medium, High, Critical)\n• Timestamps for timeline analysis",
    'features': "Key features include:\n• Real-time data visualization\n• Interactive charts and graphs\n• Incident timeline analysis\n• Detailed incident reporting\n• Responsive design for all devices",
    'default': "I'm here to help with questions about the Maritime Incident Dashboard. You can ask me about:\n• How to use the dashboard\n• Understanding the charts\n• Navigation tips\n• Data interpretation\n• Application features\n\nTry asking 'help' for more specific topics!"
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    
    // Check for keyword matches
    for (const [keyword, response] of Object.entries(predefinedResponses)) {
      if (keyword !== 'default' && message.includes(keyword)) {
        return response;
      }
    }
    
    // Check for common question patterns
    if (message.includes('how') && (message.includes('use') || message.includes('work'))) {
      return predefinedResponses.help;
    }
    
    if (message.includes('what') && (message.includes('show') || message.includes('display'))) {
      return predefinedResponses.dashboard;
    }
    
    if (message.includes('where') || message.includes('find')) {
      return predefinedResponses.navigation;
    }
    
    return predefinedResponses.default;
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-assistant">
      {/* Chat Toggle Button */}
      <button 
        className={`chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        aria-label="Toggle chat assistant"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h4>Maritime Assistant</h4>
            <span className="status-indicator">Online</span>
          </div>
          
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot typing">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about the dashboard..."
              maxLength={500}
            />
            <button 
              onClick={handleSendMessage}
              disabled={inputValue.trim() === ''}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;