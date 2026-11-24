// Native (Expo Go): runs your HTML/JS inside an isolated WebView.
import React from 'react';
import { WebView } from 'react-native-webview';
export const RunFrame = ({ html, onData }) => (
  <WebView originWhitelist={['*']} source={{ html }} javaScriptEnabled nestedScrollEnabled onMessage={(e) => onData(e.nativeEvent.data)} style={{ flex: 1 }} />
);
