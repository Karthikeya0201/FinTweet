import React, { useState, useRef, useEffect } from 'react';
import { Send, TrendingUp, Bot, User } from 'lucide-react';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
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
            const avgPrice = Number(stock.purchasePrice) || 0;
            const currentPrice = Number(stock.currentPrice) || 0;
            const totalProfit = Number(stock.totalProfit) || 0;
            return `${stock.companyName}: ${shares} shares purchased at $${avgPrice.toFixed(2)} on ${stock.purchaseDate} (current price: $${currentPrice.toFixed(2)}, total profit: $${totalProfit.toFixed(2)})`;
        }).filter(entry => entry.length > 0).join('; ');
        console.log('Formatted holdings:', formatted);
        return formatted;
    };

    const parseMarkdown = (text) => {
        if (!text) return '';

        let html = text;

        // Code blocks
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre class="code-block"><code>${code.trim()}</code></pre>`;
        });

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

        // Bold
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3 class="markdown-h3">$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2 class="markdown-h2">$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1 class="markdown-h1">$1</h1>');

        // Bullet lists
        html = html.replace(/^\* (.+)$/gim, '<li class="markdown-li">$1</li>');
        html = html.replace(/(<li class="markdown-li">.*<\/li>)/s, '<ul class="markdown-ul">$1</ul>');

        // Numbered lists
        html = html.replace(/^\d+\. (.+)$/gim, '<li class="markdown-li">$1</li>');

        // Line breaks
        html = html.replace(/\n/g, '<br />');

        return html;
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = {role: 'user', content: input};
        const fullHistory = [...messages, userMessage];
        setMessages(fullHistory);
        setInput('');
        setIsLoading(true);

        try {
            const apiKey = "AIzaSyD0itKNmTYySBXYCoKLwJApuJ6YpHYHU3M";
            if (!apiKey) {
                throw new Error('Gemini API key is not configured.');
            }

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
                user = {username: 'Anonymous'};
            }

            const stockHoldings = formatStockHoldings(user.portfolio);
            const systemPrompt = `You are FinTweet's AI financial assistant. The current user is ${user.username || 'Anonymous'}. 
User's current stock holdings: ${stockHoldings}.
Provide personalized financial insights, portfolio advice, and market analysis based on their queries and these holdings. 
Keep responses concise, helpful, and professional. If the query relates to holdings, reference specific stocks where relevant.
Format your responses using markdown for better readability (use **bold**, *italic*, bullet points, etc.).`;

            console.log('System prompt:', systemPrompt);

            const conversationHistory = fullHistory.map((msg) => ({
                role: msg.role,
                parts: [{text: msg.content}],
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
                            parts: [{text: systemPrompt}],
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
            const errorMessage = {
                role: 'model',
                content: `Sorry, there was an error: ${error.message}. Check the console for details.`
            };
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
        <div className="flex flex-col h-[98%] bg-gradient-to-br from-slate-50 to-blue-50 p-4">
            <div className="flex flex-col h-[95%] bg-white rounded-2xl shadow-xl overflow-hidden">
                <style>{`
          .code-block {
            background: #1e293b;
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 0.5rem 0;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
          }
          .inline-code {
            background: #f1f5f9;
            color: #0f172a;
            padding: 0.125rem 0.375rem;
            border-radius: 0.25rem;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
          }
          .markdown-h1 {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 1rem 0 0.5rem 0;
          }
          .markdown-h2 {
            font-size: 1.25rem;
            font-weight: bold;
            margin: 0.875rem 0 0.5rem 0;
          }
          .markdown-h3 {
            font-size: 1.125rem;
            font-weight: bold;
            margin: 0.75rem 0 0.5rem 0;
          }
          .markdown-ul {
            margin: 0.5rem 0;
            padding-left: 1.5rem;
          }
          .markdown-li {
            margin: 0.25rem 0;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>

                {/* Header */}
                <div className="bg-white shadow-sm border-b border-slate-200 flex-shrink-0">
                    <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
                        <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
                            <TrendingUp className="text-white" size={24}/>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">FinTweet Assistant</h1>
                            <p className="text-sm text-slate-500">Your AI-powered financial advisor</p>
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center py-20">
                                <div className="bg-blue-100 p-4 rounded-full mb-4">
                                    <Bot className="text-blue-600" size={48}/>
                                </div>
                                <h2 className="text-2xl font-semibold text-slate-700 mb-2">Welcome to FinTweet
                                    Assistant</h2>
                                <p className="text-slate-500 max-w-md">
                                    Ask me anything about your portfolio, market trends, or financial advice. I'm here
                                    to help!
                                </p>
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex gap-3 mb-6 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                    message.role === 'user' ? 'bg-blue-500' : 'bg-slate-200'
                                }`}>
                                    {message.role === 'user' ? (
                                        <User className="text-white" size={18}/>
                                    ) : (
                                        <Bot className="text-slate-700" size={18}/>
                                    )}
                                </div>
                                <div
                                    className={`flex-1 max-w-2xl ${
                                        message.role === 'user'
                                            ? 'bg-blue-500 text-white rounded-2xl rounded-tr-sm'
                                            : 'bg-white text-slate-800 rounded-2xl rounded-tl-sm shadow-sm border border-slate-200'
                                    } px-4 py-3`}
                                >
                                    {message.role === 'user' ? (
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    ) : (
                                        <div dangerouslySetInnerHTML={{__html: parseMarkdown(message.content)}}/>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3 mb-6">
                                <div
                                    className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                    <Bot className="text-slate-700" size={18}/>
                                </div>
                                <div
                                    className="bg-white text-slate-800 rounded-2xl rounded-tl-sm shadow-sm border border-slate-200 px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-spin"></div>
                                        <span className="text-slate-600">Assistant is thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef}/>
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-white border-t border-slate-200 shadow-lg flex-shrink-0">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className="flex gap-2 items-end">
              <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your portfolio, market trends, or financial advice..."
                  className="flex-1 resize-none border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder-slate-400"
                  rows={1}
                  style={{maxHeight: '120px'}}
              />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className={`p-3 rounded-2xl transition-all ${
                                    isLoading || !input.trim()
                                        ? 'bg-slate-300 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
                                }`}
                            >
                                <Send className="text-white" size={20}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;