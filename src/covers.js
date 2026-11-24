// Animated tutorial covers, drawn in code with original characters and shapes (each one moves in its own way)
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { F } from './theme';
import { Px, Slime, Explorer } from './ui';
import { A } from './scenes';

const abs = StyleSheet.absoluteFill;
const useTick = (ms, n) => { const [k, setK] = useState(0); useEffect(() => { const t = setInterval(() => setK((v) => (v + 1) % n), ms); return () => clearInterval(t); }, []); return k; };
const Bg = ({ c }) => <View style={[abs, { backgroundColor: c }]} />;
const Grad = ({ c, loc, start, end }) => <LinearGradient colors={c} locations={loc} start={start} end={end} style={abs} />;
const Tw = ({ w, h, n = 14, c = '#fff' }) => <>{[...Array(n)].map((_, i) => <A key={i} f={{ o: 0.15 }} t={{ o: 1 }} rev dur={700 + (i % 6) * 260} delay={i * 90} style={{ left: (i * 53 + 11) % Math.max(10, w - 6), top: (i * 37 + 7) % Math.max(10, h - 6) }}><View style={{ width: i % 3 ? 3 : 5, height: i % 3 ? 3 : 5, backgroundColor: c }} /></A>)}</>;
const Line = ({ x1, y1, x2, y2, c = 'rgba(255,255,255,0.55)' }) => { const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy); return <View style={{ position: 'absolute', left: (x1 + x2) / 2 - len / 2, top: (y1 + y2) / 2 - 1, width: len, height: 2, backgroundColor: c, transform: [{ rotate: Math.atan2(dy, dx) + 'rad' }] }} />; };
const Eq = ({ n = 7, hmax = 50, c = '#fff', w = 8 }) => {
  const v = useRef([...Array(n)].map(() => new Animated.Value(0))).current;
  useEffect(() => { v.forEach((a, i) => Animated.loop(Animated.sequence([Animated.timing(a, { toValue: 1, duration: 300 + i * 70, useNativeDriver: false }), Animated.timing(a, { toValue: 0.15, duration: 300 + i * 50, useNativeDriver: false })])).start()); }, []);
  return <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: hmax, gap: 4 }}>{v.map((a, i) => <Animated.View key={i} style={{ width: w, backgroundColor: c, height: a.interpolate({ inputRange: [0, 1], outputRange: [4, hmax] }) }} />)}</View>;
};
const Mono = ({ s = 10, c = '#7CFC7C', children, style }) => <Text style={[{ fontFamily: 'monospace', fontSize: s, color: c }, style]}>{children}</Text>;

const ROCKET = ['...kk...', '..kwwk..', '..kwwk..', '.kwbbwk.', '.kwbbwk.', '.kwwwwk.', 'kkwwwwkk', 'krwwwwrk', 'kr.kk.rk', '...kk...'];
const BUG = ['.k...k.', '..kkk..', '.kRRRk.', 'kkRRRkk', '.kRRRk.', 'k.k.k.k'];
const ARROW = ['k.......', 'kk......', 'kwk.....', 'kwwk....', 'kwwwk...', 'kwwwwk..', 'kwwkkk..', 'kkwk....', '..kwk...', '..kk....'];
const CAT = ['.oo......oo.', '.oooooooooo.', 'oooooooooooo', 'ooKooooooKoo', 'ooooopppoooo', '.oooooooooo.', '..oooooooo..', '..oooooooo.o', '..oo....oo.o', '..oo....oo..'];
const CATM = { o: '#f5a64a', K: '#2a1a0a', p: '#ff8aa8' };

const Tiles = ({ w, h }) => {
  const k = useTick(700, 8); const s = Math.min(w * 0.17, h * 0.3); const word = 'PYTHON';
  return <View style={{ position: 'absolute', left: (w - (s * 3 + 16)) / 2, top: (h - (s * 2 + 8)) / 2, width: s * 3 + 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
    {word.split('').map((c, i) => <View key={i} style={{ width: s, height: s, borderWidth: 3, borderColor: '#fff', backgroundColor: i < k ? '#2fb344' : '#fff', alignItems: 'center', justifyContent: 'center' }}>{i < k ? <Text style={{ fontFamily: F.px, fontSize: s * 0.42, color: '#fff' }}>{c}</Text> : null}</View>)}</View>;
};
const GuiWin = ({ w, h }) => {
  const k = useTick(800, 4); const cols = ['#ff9f43', '#1dd1a1', '#a55eea', '#54a0ff']; const ww = w * 0.62, wh = h * 0.8;
  return <View style={{ position: 'absolute', left: (w - ww) / 2, top: h * 0.1, width: ww, height: wh, backgroundColor: '#dcdde8', borderWidth: 3, borderColor: '#4b4f66' }}>
    <View style={{ backgroundColor: '#4b4f66', paddingVertical: 3, alignItems: 'center' }}><Text style={{ fontFamily: F.px, fontSize: Math.max(5, w * 0.025), color: '#fff' }}>EDIT PROFILE</Text></View>
    <View style={{ flex: 1, flexDirection: 'row', padding: 6, gap: 6 }}>
      <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', gap: 3 }}>{[...Array(15)].map((_, i) => <View key={i} style={{ width: '17%', aspectRatio: 1, backgroundColor: i === k * 3 + 1 ? '#fff176' : ['#b0b3c6', '#9aa0ba'][i % 2] }} />)}</View>
      <View style={{ width: '38%', justifyContent: 'space-between' }}>{cols.map((c, i) => <View key={i} style={{ flex: 1, marginBottom: 3, backgroundColor: c, opacity: i === k ? 1 : 0.65, transform: [{ scale: i === k ? 1.06 : 1 }] }} />)}</View>
    </View>
    <A f={{ x: ww * 0.1, y: wh * 0.3 }} t={{ x: ww * 0.72, y: wh * 0.72 }} rev dur={2200} style={{ left: 0, top: 0 }}><Px rows={ARROW} map={{ k: '#111', w: '#fff' }} s={2} /></A>
  </View>;
};
const Neural = ({ w, h }) => {
  const N = [[.5, .2], [.3, .35], [.7, .33], [.2, .55], [.45, .5], [.62, .55], [.8, .5], [.35, .75], [.58, .78]]; const E = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 6], [4, 5], [3, 7], [4, 7], [5, 8], [6, 8], [4, 8], [1, 2]];
  const P = N.map(([x, y]) => [x * w, y * h]);
  return <>{E.map(([a, b], i) => <Line key={i} x1={P[a][0]} y1={P[a][1]} x2={P[b][0]} y2={P[b][1]} />)}
    {P.map(([x, y], i) => <A key={i} f={{ s: 0.8, o: 0.7 }} t={{ s: 1.5, o: 1 }} rev dur={700 + i * 110} delay={i * 120} style={{ left: x - 5, top: y - 5 }}><View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' }} /></A>)}</>;
};
const Dancer = () => (
  <A f={{ y: 0 }} t={{ y: -6 }} rev dur={380} style={{ left: 0, top: 0 }}>
    <View style={{ alignItems: 'center', width: 40 }}>
      <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: '#fff' }} /><View style={{ width: 3, height: 16, backgroundColor: '#fff' }} />
      <A f={{ r: '-40deg' }} t={{ r: '40deg' }} rev dur={380} style={{ top: 9, left: 6 }}><View style={{ width: 3, height: 16, backgroundColor: '#fff' }} /></A>
      <A f={{ r: '40deg' }} t={{ r: '-40deg' }} rev dur={380} style={{ top: 9, left: 29 }}><View style={{ width: 3, height: 16, backgroundColor: '#fff' }} /></A>
      <A f={{ r: '-18deg' }} t={{ r: '18deg' }} rev dur={380} style={{ top: 24, left: 12 }}><View style={{ width: 3, height: 17, backgroundColor: '#fff' }} /></A>
      <A f={{ r: '18deg' }} t={{ r: '-18deg' }} rev dur={380} style={{ top: 24, left: 24 }}><View style={{ width: 3, height: 17, backgroundColor: '#fff' }} /></A>
    </View></A>
);
const SqlTable = ({ w, h }) => {
  const k = useTick(800, 4); const rows = [['Puzzle', 200], ['Racing', 340], ['Arcade', 150], ['Quiz', 90]];
  return <View style={{ position: 'absolute', left: w * 0.08, top: h * 0.14, width: w * 0.5 }}>
    {rows.map(([g, v], i) => <View key={g} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5, marginBottom: 3, backgroundColor: i === k ? '#16a34a' : '#162447' }}><Mono s={Math.max(8, w * 0.04)} c="#e6edf7">{g}</Mono><Mono s={Math.max(8, w * 0.04)} c="#e6edf7">{v}</Mono></View>)}
    <View style={{ position: 'absolute', left: w * 0.58, bottom: 0 }}><Eq n={4} hmax={h * 0.55} w={w * 0.06} c="#38bdf8" /></View></View>;
};

const COVERS = {
  gif: (w, h) => <>
    <Grad c={['#07163f', '#0b3a8a']} /><Tw w={w} h={h} />
    {['#ff4d4d', '#ff9f1a', '#ffe14d', '#4ddb6a', '#3aa0ff', '#9b6bff'].map((c, i) => <A key={i} f={{ y: 0 }} t={{ y: 6 }} rev dur={420} delay={i * 70} style={{ left: 0, top: h * 0.38 + i * 9 }}><View style={{ width: w * 0.44, height: 9, backgroundColor: c }} /></A>)}
    <A f={{ y: 0, r: '-4deg' }} t={{ y: -8, r: '4deg' }} rev dur={520} style={{ left: w * 0.42, top: h * 0.3 }}><Slime px={Math.max(5, Math.round(w / 38))} /></A></>,
  word: (w, h) => <><Bg c="#06223f" /><Tiles w={w} h={h} /></>,
  javagui: (w, h) => <><Grad c={['#f4a6c9', '#b9a6ff']} /><GuiWin w={w} h={h} /></>,
  keyframes: (w, h) => <>
    <Grad c={['#a7f3d0', '#93c5fd']} />
    <A f={{ y: 0 }} t={{ y: -14 }} rev dur={1500} style={{ left: w / 2 - 26, top: h * 0.2 }}><A f={{ r: '0deg' }} t={{ r: '360deg' }} dur={3200} style={{ position: 'relative' }}><View style={{ width: 46, height: 46, backgroundColor: '#7c3aed', borderWidth: 4, borderColor: '#c4b5fd', transform: [{ rotate: '45deg' }, { scaleY: 1.2 }] }} /></A></A>
    <View style={{ position: 'absolute', left: w * 0.12, right: w * 0.12, bottom: h * 0.16, height: 4, backgroundColor: 'rgba(0,0,0,0.25)' }} />
    {['0%', '50%', '100%'].map((t, i) => <Text key={t} style={{ position: 'absolute', bottom: h * 0.04, left: w * (0.12 + i * 0.38), fontFamily: F.px, fontSize: Math.max(6, w * 0.03), color: '#1e293b' }}>{t}</Text>)}
    <A f={{ x: w * 0.12 }} t={{ x: w * 0.82 }} rev dur={1500} style={{ bottom: h * 0.16 - 6, top: undefined, left: 0 }}><View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#f97316' }} /></A></>,
  aiblog: (w, h) => <>
    <Grad c={['#f472b6', '#8b5cf6', '#6366f1']} />
    <View style={{ position: 'absolute', left: w * 0.22, top: h * 0.14, width: w * 0.56, height: h * 0.72, backgroundColor: 'rgba(255,255,255,0.92)', padding: 10 }}>
      {[0.9, 0.6, 0.95, 0.5, 0.75].map((x, i) => <A key={i} f={{ o: 0.15 }} t={{ o: 1 }} rev dur={800} delay={i * 350} style={{ position: 'relative', marginBottom: 8 }}><View style={{ width: `${x * 100}%`, height: 6, backgroundColor: i === 0 ? '#7c3aed' : '#94a3b8' }} /></A>)}</View>
    <A f={{ r: '0deg', s: 0.8 }} t={{ r: '90deg', s: 1.3 }} rev dur={1200} style={{ right: w * 0.12, top: h * 0.1 }}><Text style={{ fontSize: w * 0.12, color: '#fff' }}>✦</Text></A></>,
  search: (w, h) => <>
    <Bg c="#1d3fe0" />{[0.7, 0.55, 0.8, 0.45].map((x, i) => <A key={i} f={{ o: 0.4 }} t={{ o: 1 }} rev dur={900} delay={i * 300} style={{ left: w * 0.12, top: h * 0.2 + i * (h * 0.17) }}><View style={{ width: w * x, height: h * 0.07, backgroundColor: '#fff' }} /></A>)}
    <A f={{ x: w * 0.1, y: 0 }} t={{ x: w * 0.6, y: h * 0.28 }} rev dur={2300} style={{ left: 0, top: h * 0.1 }}><View style={{ width: 42, height: 42, borderRadius: 21, borderWidth: 6, borderColor: '#fde047', backgroundColor: 'rgba(255,255,255,0.15)' }} /><View style={{ position: 'absolute', left: 36, top: 38, width: 8, height: 22, backgroundColor: '#fde047', transform: [{ rotate: '-45deg' }] }} /></A></>,
  voice: (w, h) => <>
    <Grad c={['#02030a', '#2a2ab0']} />
    {[0, 1].map((i) => <A key={i} f={{ s: 1, o: 0.5 }} t={{ s: 2, o: 0 }} dur={1800} delay={i * 900} style={{ left: w / 2 - h * 0.18, top: h * 0.16 }}><View style={{ width: h * 0.36, height: h * 0.36, borderRadius: h, borderWidth: 3, borderColor: '#fff' }} /></A>)}
    <View style={{ position: 'absolute', left: w / 2 - h * 0.18, top: h * 0.16, width: h * 0.36, height: h * 0.36, borderRadius: h, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}><Eq n={3} hmax={h * 0.2} w={6} c="#111" /></View>
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: h * 0.08, alignItems: 'center' }}><Eq n={11} hmax={h * 0.26} w={7} c="#8b8bff" /></View></>,
  poem: (w, h) => <><Grad c={['#8b6fd6', '#d46a8a', '#f2994a']} /><Neural w={w} h={h} />
    <A f={{ s: 0.7, o: 0.4 }} t={{ s: 1.4, o: 1 }} rev dur={900} style={{ right: w * 0.1, top: h * 0.08 }}><Text style={{ fontSize: w * 0.1, color: '#fff' }}>✦</Text></A></>,
  localhost: (w, h) => <>
    <Bg c="#22b5d2" />
    <View style={{ position: 'absolute', left: w * 0.15, top: h * 0.1, width: w * 0.7, height: h * 0.82, backgroundColor: '#fff', borderWidth: 2, borderColor: '#0a0a0a', overflow: 'hidden' }}>
      <View style={{ backgroundColor: '#0a0a0a', padding: 6, flexDirection: 'row', alignItems: 'center', gap: 4 }}>{[0, 1, 2].map((i) => <View key={i} style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#e5e7eb' }} />)}<View style={{ flex: 1, backgroundColor: '#f8fafc', marginLeft: 6, paddingHorizontal: 6 }}><Text style={{ fontSize: Math.max(7, w * 0.035), color: '#111' }}>127.0.0.1  →</Text></View></View>
      <A f={{ x: -w }} t={{ x: w }} dur={1600} style={{ left: 0, top: 22 }}><View style={{ width: w * 0.3, height: 3, backgroundColor: '#22b5d2' }} /></A>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}><Text style={{ fontSize: Math.max(14, w * 0.09), color: '#111' }}>localhost</Text><A f={{ o: 1 }} t={{ o: 0 }} rev dur={500} style={{ position: 'relative' }}><View style={{ width: 3, height: w * 0.08, backgroundColor: '#111', marginLeft: 3 }} /></A></View></View></>,
  react: (w, h) => <>
    <Grad c={['#222', '#222', '#f4c04e', '#f4c04e']} loc={[0, 0.45, 0.45, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
    <A f={{ r: '0deg' }} t={{ r: '360deg' }} dur={6000} style={{ left: w * 0.26, top: h * 0.3 }}>
      {[0, 60, 120].map((d) => <View key={d} style={{ position: 'absolute', left: -42, top: -16, width: 84, height: 32, borderRadius: 42, borderWidth: 4, borderColor: '#22d3ee', transform: [{ rotate: d + 'deg' }] }} />)}<View style={{ position: 'absolute', left: -7, top: -7, width: 14, height: 14, borderRadius: 7, backgroundColor: '#22d3ee' }} /></A>
    <Text style={{ position: 'absolute', left: w * 0.44, top: h * 0.36, fontSize: w * 0.12, color: '#fff' }}>+</Text>
    <A f={{ s: 0.9 }} t={{ s: 1.3 }} rev dur={600} style={{ right: w * 0.14, bottom: h * 0.16 }}><Text style={{ fontSize: w * 0.15 }}>⚡</Text></A></>,
  deploy: (w, h) => <>
    <Bg c="#05060d" />{[...Array(12)].map((_, i) => <A key={i} f={{ y: -8 }} t={{ y: h }} dur={900 + (i % 5) * 300} delay={i * 130} style={{ left: (i * 47 + 9) % (w - 4), top: 0 }}><View style={{ width: 2, height: 10 + (i % 3) * 6, backgroundColor: '#cbd5e1' }} /></A>)}
    <A f={{ y: 0, x: -2 }} t={{ y: -10, x: 2 }} rev dur={450} style={{ left: w / 2 - 20, top: h * 0.2 }}><Px rows={ROCKET} map={{ k: '#1a1a2a', w: '#e8eef8', b: '#38bdf8', r: '#ef4444' }} s={Math.max(4, Math.round(h / 40))} />
      <A f={{ s: 0.6, o: 0.6 }} t={{ s: 1.2, o: 1 }} rev dur={140} style={{ left: 12, top: Math.max(4, Math.round(h / 40)) * 10 }}><View style={{ width: 16, height: 22, backgroundColor: '#fb923c' }} /></A></A></>,
  debug: (w, h) => <>
    <Grad c={['#5b21b6', '#1d4ed8']} />{[0.7, 0.5, 0.8, 0.4, 0.65, 0.55].map((x, i) => <View key={i} style={{ position: 'absolute', left: w * 0.1, top: h * 0.14 + i * (h * 0.12), width: w * x, height: 6, backgroundColor: 'rgba(255,255,255,0.35)' }} />)}
    <A f={{ x: w * 0.1 }} t={{ x: w * 0.7 }} rev dur={1700} style={{ left: 0, top: h * 0.34 }}><A f={{ y: 0 }} t={{ y: 3 }} rev dur={120} style={{ position: 'relative' }}><Px rows={BUG} map={{ k: '#1a0a0a', R: '#ef4444' }} s={4} /></A></A>
    <A f={{ x: w * 0.65, r: '-8deg' }} t={{ x: w * 0.15, r: '8deg' }} rev dur={2600} style={{ left: 0, top: h * 0.2 }}><View style={{ width: 54, height: 54, borderRadius: 27, borderWidth: 5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)' }}><Text style={{ fontSize: 24, color: '#fb923c', fontWeight: 'bold' }}>?</Text></View></A></>,
  game: (w, h) => <>
    <Bg c="#f4a261" />{[...Array(Math.ceil(h / 22))].map((_, r) => <View key={r} style={{ flexDirection: 'row', marginLeft: r % 2 ? -22 : 0 }}>{[...Array(Math.ceil(w / 44) + 1)].map((_, c) => <View key={c} style={{ width: 44, height: 22, backgroundColor: '#f4a261', borderWidth: 1, borderColor: '#d9783a' }} />)}</View>)}
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: h * 0.16, backgroundColor: '#c88fd8' }} />
    <A f={{ x: w * 0.06 }} t={{ x: w * 0.5 }} dur={3000} style={{ left: 0, bottom: h * 0.08 }}><A f={{ y: 0 }} t={{ y: -3 }} rev dur={170} style={{ position: 'relative' }}><Explorer s={Math.max(3, Math.round(h / 50))} /></A></A>
    <View style={{ position: 'absolute', left: w * 0.66, bottom: h * 0.08, width: 34, height: 30, backgroundColor: '#8b5a2b', borderWidth: 2, borderColor: '#5a3a14' }} />
    <A f={{ y: 0, s: 0.9 }} t={{ y: -8, s: 1.15 }} rev dur={600} style={{ left: w * 0.66 + 3, bottom: h * 0.08 + 38 }}><View style={{ width: 26, height: 26, backgroundColor: '#86efac', borderWidth: 2, borderColor: '#166534', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontFamily: F.px, fontSize: 10, color: '#14532d' }}>E</Text></View></A></>,
  rave: (w, h) => <>
    <Bg c="#7a4b24" />
    <View style={{ position: 'absolute', left: w * 0.12, top: h * 0.1, width: w * 0.76, height: h * 0.8, backgroundColor: '#0b3a8f', borderWidth: 3, borderColor: '#082a6a', padding: 8 }}>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>{[0, 1, 2, 3].map((i) => <View key={i} style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#d4af37' }} />)}</View>
      <View style={{ flex: 1, backgroundColor: '#000', padding: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
        <A f={{ o: 1 }} t={{ o: 0.2 }} rev dur={420} style={{ position: 'relative' }}><Text style={{ fontFamily: F.px, fontSize: Math.max(7, w * 0.04), color: '#fff', lineHeight: Math.max(12, w * 0.06) }}>get on{'\n'}the{'\n'}floor</Text></A>
        <View style={{ width: 40, height: 44 }}><Dancer /></View></View></View></>,
  pet: (w, h) => <>
    <Bg c="#052e16" />{[...Array(Math.ceil(h / 21))].map((_, r) => <View key={r} style={{ flexDirection: 'row', gap: 3, marginBottom: 3, marginLeft: 4 }}>{[...Array(Math.ceil(w / 21))].map((_, c) => <View key={c} style={{ width: 18, height: 18, backgroundColor: ['#0e4429', '#006d32', '#26a641', '#0e4429', '#39d353'][(r * 7 + c * 3) % 5] }} />)}</View>)}
    <View style={{ position: 'absolute', left: w * 0.08, top: h * 0.08, backgroundColor: '#60a5fa', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 5 }}><Text style={{ fontWeight: 'bold', color: '#0b1d3a', fontSize: Math.max(9, w * 0.045) }}>Streak  5 days</Text></View>
    <A f={{ x: -10 }} t={{ x: w * 0.72 }} dur={4200} style={{ left: 0, bottom: h * 0.06 }}><A f={{ y: 0 }} t={{ y: -4 }} rev dur={200} style={{ position: 'relative' }}><Px rows={CAT} map={CATM} s={Math.max(4, Math.round(h / 28))} /></A></A></>,
  plant: (w, h) => <>
    <Bg c="#d9f5d0" />
    <View style={{ position: 'absolute', left: w * 0.12, top: h * 0.08, width: w * 0.76, height: h * 0.84, borderWidth: 4, borderColor: '#4caf50', borderRadius: 14, backgroundColor: '#eefbe9', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 10 }}>
      <A f={{ r: '-6deg' }} t={{ r: '6deg' }} rev dur={1400} style={{ left: '50%', marginLeft: -26, top: h * 0.12 }}>
        <View style={{ position: 'absolute', left: -2, top: -34, width: 16, height: 36, borderRadius: 16, backgroundColor: '#3aa655', transform: [{ rotate: '-30deg' }] }} /><View style={{ position: 'absolute', left: 30, top: -34, width: 16, height: 36, borderRadius: 16, backgroundColor: '#2f8f46', transform: [{ rotate: '30deg' }] }} />
        <View style={{ width: 52, height: 40, backgroundColor: '#c2652a', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, alignItems: 'center', paddingTop: 10 }}><View style={{ flexDirection: 'row', gap: 14 }}><View style={{ width: 5, height: 5, backgroundColor: '#2a1608' }} /><View style={{ width: 5, height: 5, backgroundColor: '#2a1608' }} /></View><View style={{ width: 14, height: 4, backgroundColor: '#2a1608', marginTop: 6 }} /></View></A>
      {[0, 1].map((i) => <A key={i} f={{ y: -30, o: 1 }} t={{ y: h * 0.28, o: 0 }} dur={1400} delay={i * 700} style={{ left: '38%', marginLeft: i * 22, top: h * 0.08 }}><View style={{ width: 6, height: 9, borderRadius: 4, backgroundColor: '#38bdf8' }} /></A>)}
      <A f={{ s: 1 }} t={{ s: 1.08 }} rev dur={800} style={{ position: 'relative' }}><View style={{ borderWidth: 2, borderColor: '#4caf50', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 3 }}><Text style={{ color: '#2e7d32', fontSize: Math.max(9, w * 0.045) }}>Thriving</Text></View></A></View></>,
  terminal: (w, h) => <>
    <Bg c="#061a3a" />
    <View style={{ position: 'absolute', left: w * 0.24, top: h * 0.08, width: w * 0.52, height: h * 0.68, backgroundColor: '#cfd2da', borderWidth: 3, borderColor: '#8a8fa0', padding: 6 }}>
      <View style={{ flex: 1, backgroundColor: '#04100a', overflow: 'hidden', padding: 4 }}>
        <A f={{ y: 6 }} t={{ y: -26 }} dur={2600} style={{ left: 4, top: 0 }}>{['$ python game.py', 'Score: 10', 'Lives: 3', '> guess a number', '> 42 is too high', '> 17 correct!'].map((l, i) => <Mono key={i} s={Math.max(7, w * 0.034)} style={{ marginBottom: 3 }}>{l}</Mono>)}</A></View></View>
    <View style={{ position: 'absolute', left: w * 0.16, top: h * 0.78, width: w * 0.68, height: h * 0.14, backgroundColor: '#b6b9c4', borderWidth: 2, borderColor: '#8a8fa0' }} /></>,
  sqlite: (w, h) => <><Bg c="#0a1330" /><SqlTable w={w} h={h} /></>,
};
export const Cover = ({ kind, w, h }) => <View style={{ width: w, height: h, overflow: 'hidden', backgroundColor: '#000' }}>{(COVERS[kind] || COVERS.gif)(w, h)}</View>;
export const COVER_KINDS = Object.keys(COVERS);
