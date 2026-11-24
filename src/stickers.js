// Original animated stickers (drawn in code) that stand in for GIFs in the chat
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { F } from './theme';
import { Slime, Explorer } from './ui';
import { A } from './scenes';

const abs = StyleSheet.absoluteFill;
export const STICKERS = [
  { id: 'night', label: 'Good night', kw: 'sleep night zzz bed tired' }, { id: 'oops', label: 'Oops', kw: 'facepalm oops mistake whoops' },
  { id: 'party', label: 'Party', kw: 'party celebrate confetti yay congrats' }, { id: 'thumbs', label: 'Nice work', kw: 'thumbs up good great yes ok' },
  { id: 'dance', label: 'Dance', kw: 'dance music happy fun' }, { id: 'wow', label: 'Wow', kw: 'wow surprise omg shock' },
  { id: 'love', label: 'Thank you', kw: 'love heart thanks thank' }, { id: 'think', label: 'Hmm', kw: 'think confused hmm question' },
];
const Conf = ({ w, h }) => <>{[...Array(14)].map((_, i) => <A key={i} f={{ y: -10, r: '0deg' }} t={{ y: h, r: '360deg' }} dur={1200 + (i % 5) * 250} delay={i * 110} style={{ left: (i * 41 + 8) % (w - 8), top: 0 }}><View style={{ width: 6, height: 10, backgroundColor: ['#fde047', '#f472b6', '#4ade80', '#60a5fa', '#fb923c'][i % 5] }} /></A>)}</>;
const Big = ({ w, h, e, f, t, dur = 450 }) => <A f={f} t={t} rev dur={dur} style={{ left: w / 2 - w * 0.13, top: h * 0.18 }}><Text style={{ fontSize: w * 0.26 }}>{e}</Text></A>;
const ART = {
  night: (w, h) => <><LinearGradient colors={['#1b1464', '#5b3fb0']} style={abs} /><A f={{ y: 0 }} t={{ y: -4 }} rev dur={1200} style={{ left: w * 0.3, top: h * 0.25 }}><Slime px={Math.max(4, Math.round(w / 28))} /></A>{[0, 1, 2].map((i) => <A key={i} f={{ y: 0, o: 1, x: 0 }} t={{ y: -26, o: 0, x: 10 }} dur={1800} delay={i * 600} style={{ left: w * 0.66 + i * 8, top: h * 0.3 }}><Text style={{ color: '#fff', fontFamily: F.px, fontSize: 9 + i * 3 }}>z</Text></A>)}</>,
  oops: (w, h) => <><LinearGradient colors={['#f472b6', '#fb923c']} style={abs} /><Big w={w} h={h} e="🤦" f={{ r: '-10deg' }} t={{ r: '10deg' }} dur={260} /></>,
  party: (w, h) => <><LinearGradient colors={['#06b6d4', '#8b5cf6']} style={abs} /><Conf w={w} h={h} /><Big w={w} h={h} e="🎉" f={{ y: 0, s: 1 }} t={{ y: -10, s: 1.15 }} dur={400} /></>,
  thumbs: (w, h) => <><LinearGradient colors={['#16a34a', '#86efac']} style={abs} /><Big w={w} h={h} e="👍" f={{ s: 0.9, r: '-6deg' }} t={{ s: 1.2, r: '6deg' }} /></>,
  dance: (w, h) => <><LinearGradient colors={['#0f172a', '#7c3aed']} style={abs} /><A f={{ y: 0 }} t={{ y: -14 }} rev dur={330} style={{ left: w / 2 - w * 0.1, top: h * 0.25 }}><Explorer s={Math.max(3, Math.round(w / 40))} /></A>{[0, 1, 2].map((i) => <A key={i} f={{ y: 0, o: 1 }} t={{ y: -50, o: 0 }} dur={1400} delay={i * 450} style={{ left: w * 0.18 + i * w * 0.25, top: h * 0.7 }}><Text style={{ color: '#fde047', fontSize: 18 }}>♪</Text></A>)}</>,
  wow: (w, h) => <><LinearGradient colors={['#f59e0b', '#ef4444']} style={abs} /><Big w={w} h={h} e="😮" f={{ s: 0.85 }} t={{ s: 1.25 }} dur={380} /></>,
  love: (w, h) => <><LinearGradient colors={['#be185d', '#f472b6']} style={abs} />{[0, 1, 2, 3, 4].map((i) => <A key={i} f={{ y: 0, o: 1 }} t={{ y: -h * 0.7, o: 0 }} dur={1500 + i * 200} delay={i * 300} style={{ left: w * 0.12 + i * w * 0.17, top: h * 0.75 }}><Text style={{ fontSize: 18 + (i % 3) * 6, color: '#fff' }}>❤</Text></A>)}</>,
  think: (w, h) => <><LinearGradient colors={['#475569', '#94a3b8']} style={abs} /><Big w={w} h={h} e="🤔" f={{ r: '-12deg', y: 0 }} t={{ r: '12deg', y: -6 }} dur={700} /></>,
};
export const Sticker = ({ id, w = 150, h = 110 }) => {
  const st = STICKERS.find((s) => s.id === id);
  return <View style={{ width: w, height: h, overflow: 'hidden', borderRadius: 12 }}>{(ART[id] || ART.thumbs)(w, h)}
    <Text style={{ position: 'absolute', bottom: 6, left: 0, right: 0, textAlign: 'center', fontFamily: F.px, fontSize: Math.max(8, w / 16), color: '#fff', textShadowColor: 'rgba(0,0,0,0.55)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 0 }}>{st ? st.label : ''}</Text></View>;
};
