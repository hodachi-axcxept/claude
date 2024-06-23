import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function ReactExecutor() {
  const [webViewContent, setWebViewContent] = useState('');
  const iframeRef = useRef(null);

  const updateIframeContent = (content) => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(content);
      iframeDoc.close();
    }
  };

  useEffect(() => {
    const eventSource = new EventSource('http://your-backend-url/api/sse-endpoint');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'web_content') {
        setWebViewContent(data.content);
        updateIframeContent(data.content);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="react-executor">
      <h2>Web Content</h2>
      <iframe
        ref={iframeRef}
        title="Web View"
        width="100%"
        height="500px"
        sandbox="allow-scripts"
      />
    </div>
  );
}

export default ReactExecutor;