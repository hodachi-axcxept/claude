import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function ChatWithExecutor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [content, setContent] = useState('<h1>Welcome! Start chatting to see content here.</h1>');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('preview');
  const iframeRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (viewMode === 'preview') {
      updateIframeContent(content);
    }
  }, [content, viewMode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sendMessage = async (message = input) => {
    if (message.trim() === '') return;

    const newMessage = { text: message, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.slice(-18).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      chatHistory.push({ role: 'user', content: message });

      const response = await axios.post('http://localhost:5000/api/chat', { messages: chatHistory });
      const botMessage = { text: response.data.message, sender: 'bot', isCode: !!response.data.code };
      setMessages(prevMessages => [...prevMessages, botMessage]);

      if (response.data.code) {
        // HTMLとCSSを直接設定
        setContent(response.data.code);
        updateIframeContent(response.data.code);
      } else {
        // 通常のテキスト応答
        setContent(`<div>${response.data.message}</div>`);
        updateIframeContent(`<div>${response.data.message}</div>`);
      }
    } catch (error) {
      console.error('エラー:', error);
      setContent('<h1>コンテンツの読み込み中にエラーが発生しました。もう一度お試しください。</h1>');
      updateIframeContent('<h1>コンテンツの読み込み中にエラーが発生しました。もう一度お試しください。</h1>');
    } finally {
      setIsLoading(false);
    }
  };

  const updateIframeContent = (content) => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument;
      iframeDoc.open();
      iframeDoc.write(`
        <html>
          <head>
            <style>
              body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            </style>
          </head>
          <body>${content}</body>
          <script>
            ${extractScriptContent(content)}
          </script>
        </html>
      `);
      iframeDoc.close();
    }
  };

  const extractScriptContent = (html) => {
    const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
    return scriptMatch ? scriptMatch[1] : '';
  };

  return (
    <div className="chat-executor-container" style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#FCF3E9' }}>
      <div className="chat-container" style={{ flex: '1', display: 'flex', flexDirection: 'column', height: '90%', margin: '20px', backgroundColor: '#FCF3E9', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <div className="chat-messages" style={{ flex: '1', overflowY: 'auto', padding: '20px' }}>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', backgroundColor: message.sender === 'user' ? '#E5D8C9' : '#FBF7F2' }}>
              {message.isCode ? (
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                  <div style={{ marginRight: '10px' }}>💻</div>
                  <div>コードが含まれています。プレビューを確認してください。</div>
                </div>
              ) : (
                message.text
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input" style={{ padding: '20px', borderTop: '1px solid #e0e0e0' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Reply to Claude..."
            style={{ width: 'calc(100% - 70px)', marginRight: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button onClick={() => sendMessage()} disabled={isLoading} style={{ display: 'none', width: '60px', padding: '10px', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </div>
      <div className="react-executor" style={{ flex: '1', display: 'flex', flexDirection: 'column', height: '90%', margin: '20px', backgroundColor: '#FCF3E9', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px', borderBottom: '1px solid #e0e0e0' }}>
          <button onClick={() => setViewMode('code')} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: viewMode === 'code' ? '#4CAF50' : '#f0f0f0', color: viewMode === 'code' ? 'white' : 'black', border: 'none', borderRadius: '5px' }}>Code</button>
          <button onClick={() => setViewMode('preview')} style={{ padding: '5px 10px', backgroundColor: viewMode === 'preview' ? '#4CAF50' : '#f0f0f0', color: viewMode === 'preview' ? 'white' : 'black', border: 'none', borderRadius: '5px' }}>Preview</button>
        </div>
        {viewMode === 'preview' ? (
          <iframe
            ref={iframeRef}
            title="Preview"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <pre style={{ flex: '1', overflow: 'auto', margin: '0', padding: '20px', backgroundColor: '#282c34', color: '#abb2bf', fontSize: '14px', lineHeight: '1.5' }}>
            <code>{content}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

export default ChatWithExecutor;