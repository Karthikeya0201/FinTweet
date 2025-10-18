import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatStockHoldings = (portfolio) => {
    if (!portfolio || !Array.isArray(portfolio)) {
      console.warn('Portfolio data is missing or not an array:', portfolio);
      return "No stock holdings available.";
    }
    console.log('Formatting portfolio:', portfolio);
    const formatted = portfolio.map(stock => {
      if (!stock || typeof stock !== 'object') {
        console.warn('Invalid stock entry:', stock);
        return '';
      }
      const shares = Math.round(stock.totalProfit / stock.profitPerShare);
      // Ensure fields are numbers; fallback to 0 if undefined
      const avgPrice = Number(stock.purchasePrice) || 0;
      const currentPrice = Number(stock.currentPrice) || 0;
      const totalProfit = Number(stock.totalProfit) || 0;
      return `${stock.companyName}: ${shares} shares purchased at $${avgPrice.toFixed(2)} on ${stock.purchaseDate} (current price: $${currentPrice.toFixed(2)}, total profit: $${totalProfit.toFixed(2)})`;
    }).filter(entry => entry.length > 0).join('; ');
    console.log('Formatted holdings:', formatted);
    return formatted;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const fullHistory = [...messages, userMessage];
    setMessages(fullHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Safe access to process.env (handles environments where process is undefined)
      let envKey;
      if (typeof process !== 'undefined' && process.env) {
        envKey = process.env.REACT_APP_GEMINI_API_KEY;
      }
      const apiKey = envKey || "AIzaSyD0itKNmTYySBXYCoKLwJApuJ6YpHYHU3M";
      if (!apiKey) {
        throw new Error('Gemini API key is not configured.');
      }

      // Parse localStorage with error handling
      let user = {};
      try {
        const userStr = localStorage.getItem('user');
        console.log('Raw localStorage user:', userStr);
        if (userStr) {
          user = JSON.parse(userStr);
          console.log('Parsed user:', user);
        } else {
          console.warn('No user data in localStorage');
        }
      } catch (parseError) {
        console.error('Failed to parse user from localStorage:', parseError);
        user = { username: 'Anonymous' };
      }

      const stockHoldings = formatStockHoldings(user.portfolio);
      const systemPrompt = `You are FinTweet's AI financial assistant. The current user is ${user.username || 'Anonymous'}. 
User's current stock holdings: ${stockHoldings}.
Provide personalized financial insights, portfolio advice, and market analysis based on their queries and these holdings. 
Keep responses concise, helpful, and professional. If the query relates to holdings, reference specific stocks where relevant.`;

      console.log('System prompt:', systemPrompt);

      const conversationHistory = fullHistory.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

      console.log('Sending to API with history length:', conversationHistory.length);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: conversationHistory,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response Error:', response.status, errorText);
        throw new Error(`API failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response Data:', data);

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        throw new Error('Invalid API response structure');
      }

      const botMessage = {
        role: 'model',
        content: data.candidates[0].content.parts[0].text,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Full error in handleSend:', error);
      const errorMessage = { role: 'model', content: `Sorry, there was an error: ${error.message}. Check the console for details.` };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      maxWidth: '800px', 
      margin: '0 auto', 
      border: '1px solid #ccc', 
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderBottom: '1px solid #dee2e6',
        fontWeight: 'bold',
        color: '#495057'
      }}>
        Chatbot Assistant
      </div>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        backgroundColor: '#fff'
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: '#6c757d',
            fontStyle: 'italic',
            marginTop: '50px'
          }}>
            Start a conversation by typing a message below...
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '15px'
            }}
          >
            <div style={{
              maxWidth: '70%',
              padding: '10px 15px',
              borderRadius: '18px',
              backgroundColor: message.role === 'user' ? '#007bff' : '#e9ecef',
              color: message.role === 'user' ? '#fff' : '#495057',
              wordWrap: 'break-word'
            }}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '15px'
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '10px 15px',
              borderRadius: '18px',
              backgroundColor: '#e9ecef',
              color: '#495057'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '20px', height: '20px', border: '2px solid #dee2e6', borderRadius: '50%', borderTop: '2px solid #007bff', animation: 'spin 1s linear infinite', marginRight: '10px' }}></div>
                <span>Assistant is typing...</span>
              </div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{
        display: 'flex',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #dee2e6'
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          style={{
            flex: 1,
            resize: 'none',
            border: '1px solid #ced4da',
            borderRadius: '20px',
            padding: '10px 15px',
            marginRight: '10px',
            fontSize: '14px',
            outline: 'none',
            maxHeight: '100px',
            overflowY: 'auto'
          }}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: isLoading || !input.trim() ? 0.6 : 1
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;