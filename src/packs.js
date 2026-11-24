// Challenge Packs: pack grid (flip cards) + challenge page (flip instructions/help, editor, terminal, drawer)
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Animated, Easing, Modal, Dimensions, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, F } from './theme';
import { T, Btn, Header, Px, Confetti, Toast, FadeIn, Bob } from './ui';
import { useApp } from './context/AppContext';
import { level } from './data';
import { PACKS, LANGS, LANGCOL, THEME, stats } from './challenges';
import { RunFrame } from './RunFrame';
import { buildDoc, pyRun } from './lesson';

const { width: W } = Dimensions.get('window');
const MONO = Platform.select({ android: 'monospace', ios: 'Courier', default: 'monospace' });
const abs = StyleSheet.absoluteFill;
const BG = '#02051a';
const edge = { borderWidth: 3, borderTopColor: '#3a4a78', borderLeftColor: '#3a4a78', borderRightColor: '#0a0f1f', borderBottomColor: '#0a0f1f', borderBottomWidth: 6 };

// ---------- original pixel icons, generated from shapes ----------
const shape = (n, inside, paint) => {
  const at = (x, y) => x >= 0 && y >= 0 && x < n && y < n && inside(x, y);
  return Array.from({ length: n }, (_, y) => Array.from({ length: n }, (_, x) => (at(x, y) ? paint(x, y) : at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1) ? 'k' : '.')).join(''));
};
const d2 = (x, y) => Math.hypot(x - 5.5, y - 5.5);
const ICONS = {
  gem: { rows: shape(12, (x, y) => Math.abs(x - 5.5) + Math.abs(y - 5.5) * 1.15 <= 5.2, (x, y) => (x + y < 8 && x <= 5 && y <= 5 ? 'w' : x + y > 12 ? 'd' : 'b')), map: { b: '#ff4d8d', w: '#ffd6e8', d: '#c2185b', k: '#1a1030' } },
  shield: { rows: shape(12, (x, y) => y >= 1 && y <= 10 && Math.abs(x - 5.5) <= 4.8 - Math.max(0, y - 5.5) * 0.85, (x, y) => (Math.abs(x - 5.5) <= 3.2 && y >= 3 && y <= 8 ? (x === 5 || x === 6 ? 'd' : 'o') : 'y')), map: { y: '#ffd23c', o: '#ff8a1a', d: '#7a3b00', k: '#2a1608' } },
  coin: { rows: shape(12, (x, y) => d2(x, y) <= 5.2, (x, y) => { const r = d2(x, y); if (r > 4.2) return 'y'; if (r > 2.2 && r < 3.3 && !(x >= 6 && y >= 3 && y <= 5)) return 'd'; return 'o'; }), map: { y: '#ffe066', o: '#ff9d2e', d: '#8a3b00', k: '#2a1608' } },
  puzzle: { rows: shape(12, (x, y) => (x >= 3 && x <= 8 && y >= 3 && y <= 8) || (x >= 5 && x <= 6 && y >= 1 && y <= 2) || (x >= 1 && x <= 2 && y >= 5 && y <= 6) || (x >= 9 && x <= 10 && y >= 5 && y <= 6), (x, y) => (x <= 4 && y <= 4 ? 'h' : x >= 8 || y >= 8 ? 'd' : 'g')), map: { g: '#4caf50', h: '#9be58f', d: '#2f7a3a', k: '#11331a' } },
  chip: { rows: shape(12, (x, y) => x >= 1 && x <= 10 && y >= 3 && y <= 8 && !((x === 1 || x === 10) && (y === 3 || y === 8)), (x, y) => { if (x >= 3 && x <= 8 && y >= 4 && y <= 7) return y >= 5 && y <= 6 && x >= 4 && x <= 7 ? 'BRYG'[x - 4] : 'd'; return y === 3 ? 'w' : 'p'; }), map: { p: '#ff7aa8', w: '#ffd0e0', d: '#1b2038', B: '#2f7bff', R: '#ff4040', Y: '#ffc720', G: '#38d56a', k: '#1a1030' } },
  cube: { rows: shape(12, (x, y) => x >= 2 && x <= 9 && y >= 2 && y <= 9, (x, y) => (x === 2 || x === 9 || y === 2 || y === 9 ? 'r' : Math.abs(x - 5.5) + Math.abs(y - 5.5) <= 2.6 ? 'e' : 'o')), map: { r: '#ff5a67', o: '#b3202f', e: '#ffe0b0', k: '#2a0a10' } },
  doc: { rows: shape(12, (x, y) => x >= 2 && x <= 9 && y >= 1 && y <= 10 && !(x >= 8 && y === 1), (x, y) => (x >= 8 && y <= 2 ? 'f' : (y === 4 || y === 6 || y === 8) && x >= 3 && x <= 7 ? 'b' : 'w')), map: { w: '#e8eef8', b: '#53627f', f: '#9aaccb', k: '#1b2038' } },
  q: { rows: ['.kkkkkk.', 'kkkkkkkk', 'kk....kk', '......kk', '....kkk.', '..kkkk..', '..kk....', '........', '..kk....', '..kk....'], map: { k: '#05060f' } },
};
const Icon = ({ name, s = 7 }) => { const i = ICONS[name] || ICONS.q; return <Px rows={i.rows} map={i.map} s={s} />; };
const CODEICON = ['k..k.k..k', 'kk...k.kk'];

// ---------- sunburst background ----------
const Rays = ({ w, h, c1, c2 }) => {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.loop(Animated.timing(spin, { toValue: 1, duration: 48000, easing: Easing.linear, useNativeDriver: true })).start(); }, []);
  const L = Math.max(w, h) * 1.6;
  return (
    <View style={[abs, { overflow: 'hidden' }]}>
      <LinearGradient colors={[c1, c2, c1]} style={abs} />
      <Animated.View style={{ position: 'absolute', left: w / 2, top: h / 2, width: 0, height: 0, transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
        {[...Array(9)].map((_, i) => <View key={i} style={{ position: 'absolute', left: -(i % 2 ? 3 : 6), top: -L / 2, width: i % 2 ? 6 : 12, height: L, backgroundColor: 'rgba(255,255,255,0.13)', transform: [{ rotate: `${i * 20}deg` }] }} />)}
      </Animated.View>
      <View style={{ position: 'absolute', left: w * 0.15, top: h * 0.3, width: w * 0.7, height: w * 0.7, borderRadius: w, backgroundColor: 'rgba(255,255,255,0.2)' }} />
    </View>
  );
};

// ---------- one pack tile that flips to show details ----------
const PackTile = ({ p, w, i, onOpen, started, locked }) => {
  const th = THEME[p.th]; const h = Math.round(w * 1.4); const iw = w - 16; const ih = h - 16;
  const flip = useRef(new Animated.Value(0)).current; const [back, setBack] = useState(false);
  const toggle = () => { if (p.soon) return; const to = back ? 0 : 1; setBack(!back); Animated.timing(flip, { toValue: to, duration: 420, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }).start(); };
  const rf = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }); const rb = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const st = stats(p); const fs = Math.max(11, Math.round(iw * 0.095));
  const lab = { fontFamily: F.px, fontSize: fs, color: p.soon ? '#8a98b4' : '#ffd93d', textAlign: 'center', textShadowColor: th.shadow, textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 0, lineHeight: fs * 1.5 };
  const face = { position: 'absolute', width: w, height: h, backfaceVisibility: 'hidden', backgroundColor: th.border, borderRadius: 22, padding: 8 };
  return (
    <FadeIn delay={i * 70} style={{ position: 'relative', width: w, height: h, marginBottom: 14 }}>
      <Pressable onPress={toggle} style={{ width: w, height: h }}>
        <Animated.View style={[face, { transform: [{ perspective: 900 }, { rotateY: rf }] }]}>
          <View style={{ width: iw, height: ih, borderRadius: 14, overflow: 'hidden' }}>
            <Rays w={iw} h={ih} c1={th.c1} c2={th.c2} />
            <Text style={[lab, { position: 'absolute', top: ih * 0.17, left: 0, right: 0 }]}>{p.lang}</Text>
            <View style={{ position: 'absolute', top: ih * 0.34, left: 0, right: 0, alignItems: 'center' }}><Bob amp={4} dur={1100}><Icon name={p.icon} s={Math.max(5, Math.round(iw / 20))} /></Bob></View>
            <Text style={[lab, { position: 'absolute', top: ih * 0.74, left: 6, right: 6 }]}>{p.name}</Text>
            {p.club ? <LinearGradient colors={['#f0a6ff', '#a6ffe0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ position: 'absolute', top: 10, right: 8, borderRadius: 12, paddingHorizontal: 9, paddingVertical: 3 }}><Text style={{ fontFamily: F.b, fontSize: 10, letterSpacing: 1.5, color: '#2a1440' }}>CLUB</Text></LinearGradient> : null}
            {started ? <View style={{ position: 'absolute', bottom: 10, left: 14, right: 14, height: 6, backgroundColor: 'rgba(0,0,0,0.35)' }}><View style={{ width: `${Math.round((started / st.n) * 100)}%`, height: '100%', backgroundColor: C.lime }} /></View> : null}
          </View>
        </Animated.View>
        <Animated.View style={[face, { transform: [{ perspective: 900 }, { rotateY: rb }] }]}>
          <View style={{ width: iw, height: ih, borderRadius: 14, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
            <LinearGradient colors={['#0b3a66', '#06223f']} style={abs} />
            <Text style={{ fontFamily: F.b, fontSize: Math.max(13, iw * 0.1), color: '#fff', textAlign: 'center' }}>{p.desc}</Text>
            <View style={{ width: 36, height: 2, backgroundColor: 'rgba(255,255,255,0.5)', marginVertical: 12 }} />
            <Text style={{ fontFamily: F.r, fontSize: 13, color: '#e6f0ff', marginBottom: 6 }}>◎  {st.n} Challenges</Text>
            <Text style={{ fontFamily: F.r, fontSize: 13, color: '#e6f0ff', marginBottom: 10 }}>◷  {st.mins} min</Text>
            <View style={{ backgroundColor: '#fde68a', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 10 }}><Text style={{ fontFamily: F.px, fontSize: 9, color: '#7a4b00', letterSpacing: 1 }}>{st.xp} XP</Text></View>
            {locked ? <T s={11} c="#ffd0e6" style={{ textAlign: 'center' }}>🔒 Reach Level 2 to unlock</T> : <Btn small label="Start ▶" onPress={() => onOpen(p)} />}
          </View>
        </Animated.View>
      </Pressable>
    </FadeIn>
  );
};

// ---------- screen 1: the pack grid ----------
export const Packs = () => {
  const { store, go } = useApp();
  const [lang, setLang] = useState('All'); const [toast, setToast] = useState(false);
  const list = PACKS.filter((p) => lang === 'All' || p.lang === lang);
  const w = Math.floor((W - 16 * 2 - 12) / 2);
  const open = (p) => { if (p.club && level(store.xp) < 2) { setToast(true); return; } go('challenge', { pid: p.id, i: 0 }); };
  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ backgroundColor: '#0e1629', paddingVertical: 26, paddingHorizontal: 20, alignItems: 'center' }}>
          <T px s={20} style={{ textAlign: 'center' }}>Challenge Packs</T>
          <T s={14} c="#c7d0e6" style={{ textAlign: 'center', marginTop: 14 }}>Practice your coding reps while earning XP! Complete a pack of code challenges to test your knowledge of programming concepts.</T>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, gap: 10 }}>
          {LANGS.map((k) => <Pressable key={k} onPress={() => setLang(k)} style={{ borderWidth: 2, borderColor: lang === k ? '#19a7ff' : '#3a4560', backgroundColor: lang === k ? '#06304f' : 'transparent', borderRadius: 24, paddingHorizontal: 18, paddingVertical: 8 }}><T b s={15} c={lang === k ? '#19a7ff' : '#fff'}>{k}</T></Pressable>)}
        </ScrollView>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16 }}>
          {list.map((p, i) => <PackTile key={p.id} p={p} w={w} i={i} onOpen={open} started={(store.challenges?.[p.id] || []).length} locked={p.club && level(store.xp) < 2} />)}
        </View>
      </ScrollView>
      {toast ? <Toast title="Club pack locked" msg="Earn 100 XP (Level 2) to unlock Club packs." onClose={() => setToast(false)} /> : null}
    </View>
  );
};

// ---------- helpers for the challenge screen ----------
const Instr = ({ text }) => <Text style={{ fontFamily: F.r, fontSize: 16, lineHeight: 24, color: '#1b2a1b' }}>{text.split('`').map((s, k) => (k % 2 ? <Text key={k} style={{ color: '#2f80ed', fontFamily: F.b }}>{s}</Text> : s))}</Text>;
const KW = /^(def|return|for|in|if|elif|else|while|break|print|range|and|or|not|let|const|function|console|int|switch|case|new|public|static|void|class|using|var|String)$/;
const Hl = ({ code }) => (
  <Text style={{ fontFamily: MONO, fontSize: 13, lineHeight: 21, color: '#e6edf7' }}>
    {code.split(/("[^"]*"|'[^']*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b)/).map((t, k) => {
      const col = /^["']/.test(t) ? '#9fd0ff' : /^\d/.test(t) || /^(True|False|None|true|false|null)$/.test(t) ? '#5aa9ff' : KW.test(t) ? '#ffb454' : '#e6edf7';
      return <Text key={k} style={{ color: col }}>{t}</Text>;
    })}
  </Text>
);

// ---------- screen 2: one challenge ----------
export const Challenge = ({ pid, i }) => {
  const { store, update, go, back, replace, reset } = useApp();
  const pack = PACKS.find((p) => p.id === pid); const item = pack.items[i]; const n = pack.items.length;
  const doneList = store.challenges?.[pid] || []; const done = doneList.includes(i);
  const [code, setCode] = useState(pack.start); const [help, setHelp] = useState(false); const [out, setOut] = useState(null); const [logs, setLogs] = useState([]); const [doc, setDoc] = useState(null);
  const [res, setRes] = useState(null); const [menu, setMenu] = useState(false); const [drawer, setDrawer] = useState(false); const [fx, setFx] = useState(false); const [toast, setToast] = useState(false);
  const flip = useRef(new Animated.Value(0)).current;
  const doFlip = () => { const to = help ? 0 : 1; setHelp(!help); Animated.timing(flip, { toValue: to, duration: 450, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }).start(); };
  const rf = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }); const rb = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const checks = () => item.check.map(([re, msg]) => ({ ok: new RegExp(re, 'i').test(code), msg }));
  const run = () => {
    setRes(null); setLogs([]); setOut(null); setDoc(null);
    if (pack.run === 'py') setOut(pyRun(code));
    else if (pack.run === 'js') setDoc(buildDoc({ 'script.js': code }));
    else if (pack.run === 'web') setDoc(buildDoc({ 'index.html': code }));
    else setOut(checks().every((x) => x.ok) ? item.out.split('\n') : ['⚠ Not quite yet. Press "Submit answer" to see what is missing.']);
  };
  const submit = () => {
    const r = checks(); setRes(r);
    if (r.every((x) => x.ok) && !done) { update({ xp: store.xp + item.xp, challenges: { ...(store.challenges || {}), [pid]: [...doneList, i] } }); setFx(true); setToast(true); }
  };
  const ok = res && res.every((x) => x.ok);
  const go2 = (k) => replace('challenge', { pid, i: k });
  const lines = code.split('\n').length;
  const cw = W - 32; const CH = 380;
  const face = { position: 'absolute', width: cw, height: CH, backfaceVisibility: 'hidden', borderRadius: 26, padding: 8 };

  return (
    <View style={{ flex: 1, backgroundColor: '#1e2940' }}>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        {/* flip card: instructions <-> help */}
        <View style={{ width: cw, height: CH }}>
          <Animated.View style={[face, { backgroundColor: '#86d313', transform: [{ perspective: 1000 }, { rotateY: rf }] }]}>
            <LinearGradient colors={['#d9efb0', '#a9dd68']} style={{ flex: 1, borderRadius: 18, padding: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 22, marginRight: 8 }}>{item.e}</Text><Text style={{ flex: 1, fontFamily: F.b, fontSize: 21, color: '#142014' }}>{item.title}</Text><Text style={{ fontFamily: F.r, fontSize: 17, color: '#142014' }}>{item.xp} XP</Text>
              </View>
              <View style={{ backgroundColor: '#eefccf', borderColor: '#6eb30f', borderWidth: 2, borderRadius: 22, padding: 6, marginTop: 10 }}>
                <View style={{ alignSelf: 'flex-start', backgroundColor: '#d3f09b', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 5 }}><Text style={{ fontFamily: F.b, fontSize: 13, letterSpacing: 2, color: '#2e4a0a' }}>{item.lvl}</Text></View>
              </View>
              <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.72)', borderRadius: 12, marginTop: 10, padding: 12 }}>
                <ScrollView nestedScrollEnabled showsVerticalScrollIndicator><Text style={{ fontFamily: F.b, fontSize: 20, color: '#142014', marginBottom: 8 }}>Instructions</Text><Instr text={item.instr} /></ScrollView>
              </View>
            </LinearGradient>
          </Animated.View>
          <Animated.View style={[face, { backgroundColor: '#93a3bd', transform: [{ perspective: 1000 }, { rotateY: rb }] }]}>
            <LinearGradient colors={['#f1f4f9', '#d3dce8']} style={{ flex: 1, borderRadius: 18, padding: 14 }}>
              <Text style={{ fontFamily: F.b, fontSize: 24, color: '#142014', marginBottom: 10 }}>Get help</Text>
              <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 12, padding: 12 }}>
                <ScrollView nestedScrollEnabled>
                  <Text style={{ fontFamily: F.b, fontSize: 20, color: '#142014' }}>Hint</Text>
                  <Text style={{ fontFamily: F.r, fontSize: 15, color: '#142014', marginVertical: 8 }}>Your code should look something like:</Text>
                  <View style={{ backgroundColor: '#1c2438', borderRadius: 8, padding: 12 }}><Hl code={item.hint} /></View>
                </ScrollView>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
        <Pressable onPress={doFlip} style={[{ alignSelf: 'center', marginTop: 16, backgroundColor: '#1a2540', paddingHorizontal: 22, paddingVertical: 12 }, edge]}>
          <T px s={11}>⟳  {help ? 'Flip for instructions' : 'Flip for help'}</T>
        </Pressable>

        {/* editor */}
        <View style={{ marginTop: 18, backgroundColor: '#1b2740' }}>
          <View style={{ flexDirection: 'row' }}><View style={{ backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 14, height: 14, backgroundColor: LANGCOL[pack.lang], marginRight: 10 }} /><Text style={{ fontFamily: F.b, fontSize: 16, color: '#142014' }}>{pack.file}</Text></View></View>
          <View style={{ backgroundColor: '#fff', flexDirection: 'row', padding: 12, minHeight: 170 }}>
            <View style={{ width: 30 }}>{[...Array(lines)].map((_, k) => <Text key={k} style={{ fontFamily: MONO, fontSize: 14, lineHeight: 22, color: '#1565c0' }}>{k + 1}</Text>)}</View>
            <TextInput multiline value={code} onChangeText={setCode} autoCapitalize="none" autoCorrect={false} spellCheck={false} scrollEnabled={false} textAlignVertical="top"
              style={{ flex: 1, fontFamily: MONO, fontSize: 14, lineHeight: 22, color: '#1b2a41', padding: 0 }} />
          </View>
          <View style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', padding: 12, paddingTop: 4 }}>
            <Pressable onPress={() => setMenu(!menu)} style={[{ backgroundColor: '#05070f', width: 52, height: 42, alignItems: 'center', justifyContent: 'center' }, edge]}><T px s={12}>···</T></Pressable>
            <View style={{ flex: 1 }} />
            <Btn small icon="▶" label="Run" color="#05070f" dark="#2a3552" onPress={run} />
            <View style={{ width: 8 }} />
            <Btn small label="Submit answer" color="#0ea5ff" dark="#0a6fb3" onPress={submit} />
          </View>
          {menu ? <View style={{ backgroundColor: '#0a1020', padding: 8 }}>
            <Pressable onPress={() => { setCode(pack.start); setRes(null); setOut(null); setDoc(null); setLogs([]); setMenu(false); }} style={{ padding: 10 }}><T b>↺  Reset code</T></Pressable>
            <Pressable onPress={() => { setMenu(false); if (!help) doFlip(); }} style={{ padding: 10 }}><T b>💡  Show hint</T></Pressable>
          </View> : null}
        </View>

        {/* terminal */}
        <View style={{ marginTop: 0 }}>
          <View style={{ backgroundColor: '#1e2a42', padding: 14 }}><T b s={16}>Terminal</T></View>
          <View style={{ backgroundColor: '#02050f', minHeight: 200, padding: 14 }}>
            {pack.run === 'web' && doc ? <View style={{ height: 220, backgroundColor: '#fff' }}><RunFrame key={doc} html={doc} onData={() => {}} /></View> : null}
            {pack.run === 'js' && doc ? <View style={{ height: 1, opacity: 0 }}><RunFrame key={doc} html={doc} onData={(raw) => { try { setLogs((x) => [...x, JSON.parse(raw)]); } catch (e) {} }} /></View> : null}
            {pack.run === 'js' && doc ? (logs.length ? logs.map((l, k) => <Text key={k} style={{ fontFamily: MONO, fontSize: 14, color: l.t === 'err' ? '#ff7a9c' : '#b6f27c' }}>{l.t === 'err' ? '✖ ' : '› '}{l.m}</Text>) : <Text style={{ fontFamily: MONO, color: C.mute }}>Nothing printed.</Text>) : null}
            {out ? (out.length ? out.map((l, k) => <Text key={k} style={{ fontFamily: MONO, fontSize: 14, color: l.startsWith('⚠') ? '#ffb454' : '#b6f27c' }}>{l}</Text>) : <Text style={{ fontFamily: MONO, color: C.mute }}>No output.</Text>) : null}
            {!doc && !out ? <View style={{ alignItems: 'center', paddingVertical: 24 }}>
              <Px rows={['.k.....k.', 'k.......k', '.k.....k.']} map={{ k: '#5b6a86' }} s={9} />
              <T s={16} c="#e8ecf5" style={{ marginTop: 14, textAlign: 'center' }}>Click <T b s={16}>Run</T> to view your results</T></View> : null}
          </View>
        </View>

        {res ? <View style={{ marginTop: 14, padding: 14, backgroundColor: '#0a1020', borderWidth: 2, borderColor: ok ? C.lime : C.pink }}>
          <T px s={10} c={ok ? C.lime : C.pink}>{ok ? (done && !toast ? 'ALREADY SOLVED' : 'CORRECT!') : 'NOT YET'}</T>
          {res.map((r, k) => <T key={k} s={13} c={r.ok ? C.lime : C.pink} style={{ marginTop: 6 }}>{r.ok ? '✔ ' : '✖ '}{r.msg}</T>)}
          {ok ? <Btn small label={i + 1 < n ? 'Next challenge ▶' : 'Back to packs'} color={C.lime} dark={C.limeD} tc="#111" style={{ marginTop: 12 }} onPress={() => (i + 1 < n ? go2(i + 1) : reset('packs'))} /> : null}
        </View> : null}
      </ScrollView>

      {/* bottom bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#00061a', borderTopColor: '#26324f', borderTopWidth: 1 }}>
        <Pressable onPress={() => setDrawer(true)} style={[{ backgroundColor: '#0a1020', width: 48, height: 48, alignItems: 'center', justifyContent: 'center', marginRight: 10 }, edge]}><T s={20}>☰</T></Pressable>
        <View style={{ flex: 1 }}>
          <T b s={15} numberOfLines={1}>{item.e} {item.title}</T>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}><T s={12} c={C.mute}>Challenge {i + 1} / {n}  </T><View style={{ backgroundColor: '#14203a', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 1 }}><T px s={7}>{item.xp} XP</T></View></View>
        </View>
        <Pressable onPress={() => (i > 0 ? go2(i - 1) : back())} style={[{ backgroundColor: '#05070f', paddingHorizontal: 14, paddingVertical: 12, marginRight: 8 }, edge]}><T px s={9}>Back</T></Pressable>
        <Pressable onPress={() => (i + 1 < n ? go2(i + 1) : reset('packs'))} style={[{ backgroundColor: '#05070f', paddingHorizontal: 14, paddingVertical: 12 }, edge]}><T px s={9}>{i + 1 < n ? 'Next' : 'Finish'}</T></Pressable>
      </View>

      {/* challenge list drawer */}
      <Modal visible={drawer} transparent animationType="fade" onRequestClose={() => setDrawer(false)}>
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <View style={{ width: Math.min(360, W * 0.88), backgroundColor: '#00061a', paddingTop: 44 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderColor: '#26324f' }}>
              <T b s={18} style={{ flex: 1 }}>{pack.lang} {pack.name} Challenge Pack</T><Pressable onPress={() => setDrawer(false)} hitSlop={10}><T s={26}>✕</T></Pressable>
            </View>
            <ScrollView>
              {pack.items.map((c, k) => { const cur = k === i; const dn = doneList.includes(k); return (
                <Pressable key={k} onPress={() => { setDrawer(false); if (!cur) go2(k); }} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14, marginHorizontal: 8, marginTop: 6, borderRadius: 10, backgroundColor: cur ? '#06304f' : 'transparent' }}>
                  <View style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: '#5b6a86', backgroundColor: dn ? '#5b6a86' : 'transparent', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>{dn ? <T s={14}>✓</T> : null}</View>
                  <View style={{ flex: 1 }}><T s={13} c={C.mute}>Challenge {k + 1}</T><T b s={15} numberOfLines={1}>{c.e} {c.title}</T></View>
                  <View style={{ backgroundColor: cur ? '#0a7fd1' : '#1a2338', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}><T px s={8} c={cur ? '#d6efff' : '#fff'}>{c.xp} XP</T></View>
                </Pressable>); })}
            </ScrollView>
          </View>
          <Pressable style={{ flex: 1 }} onPress={() => setDrawer(false)} />
        </View>
      </Modal>
      {fx ? <Confetti onEnd={() => setFx(false)} /> : null}
      {toast ? <Toast title={`+${item.xp} XP`} msg="Challenge solved! Keep going." onClose={() => setToast(false)} /> : null}
    </View>
  );
};
