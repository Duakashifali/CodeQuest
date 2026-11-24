// Browser preview: same idea with a sandboxed iframe (react-native-webview does not exist on the web).
import React, { useEffect, useRef } from 'react';
export const RunFrame = ({ html, onData }) => {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && e.source === ref.current.contentWindow && typeof e.data === 'string') onData(e.data); };
    window.addEventListener('message', h);
    return () => window.removeEventListener('message', h);
  }, []);
  const doc = html.replace('<head>', '<head><script>window.ReactNativeWebView={postMessage:function(m){parent.postMessage(m,"*")}}</script>');
  return React.createElement('iframe', { ref, srcDoc: doc, sandbox: 'allow-scripts', style: { border: 0, width: '100%', height: '100%', background: '#fff' } });
};
