// Community: notifications panel, Monthly Challenges (list + detail + submit), CodeQuest Worlds (hero + walkable map)
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Modal, Animated, Easing, Dimensions, StyleSheet, Linking } from 'react-native';
import { C, F } from './theme';
import { T, Btn, Header, FadeIn, Toast, Explorer, Slime } from './ui';
import { useApp } from './context/AppContext';
import { Cover } from './covers';
import { A, Spr, ROBOT, ROBOTM, CAT, CATM } from './scenes';
import { NOTIFS } from './notifs';

const { width: W, height: SH } = Dimensions.get('window');
const abs = StyleSheet.absoluteFill; const BG = '#02051a';
const edge = { borderWidth: 3, borderTopColor: '#3a4a78', borderLeftColor: '#3a4a78', borderRightColor: '#0a0f1f', borderBottomColor: '#0a0f1f', borderBottomWidth: 6 };
const WD = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']; const MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const ch = (id, y, m, d, kind, title, sub, bg, art, subs, desc) => { const date = new Date(y, m - 1, d, 23, 59, 0); return { id, kind, title, sub, bg, art, subs, desc, date, month: `${MN[m - 1]} ${y}`, dl: `${WD[date.getDay()]} ${m}/${d}`, label: `${MN[m - 1].slice(0, 3)} ${d}, ${y}` }; };
export const MONTHLY = [
  ch('nov', 2026, 11, 30, 'Just for fun', 'Pixel Pet Challenge', 'Pixel Pet', '#6c63e8', 'pet', 8, 'Design and code a tiny virtual pet that lives on a web page. Give it moods, a favourite snack and at least one animation. Share a link and a short note about how it works.'),
  ch('oct', 2026, 10, 31, 'Just for fun', 'Blog Post Challenge', 'Blog Post', '#d9621a', 'terminal', 117, 'Put down the code editor and pick up the pen. Write a short blog post about something you learned this month and tell us what surprised you most.'),
  ch('sep', 2026, 9, 30, 'Code jam', 'Back to School Challenge', 'Back 2 School', '#7bc618', 'word', 90, 'New semester, new skills! Build a small tool that helps students: a timetable, a flashcard app or a study timer.'),
  ch('aug', 2026, 8, 31, 'Just for fun', 'Profile Makeover Challenge', 'Profile Makeover', '#0d63c9', 'search', 68, 'Give your developer profile a glow-up: a clear headline, a friendly bio and three projects you are proud of.'),
  ch('jul', 2026, 7, 31, 'Code jam', 'Remix Challenge', 'Remix', '#c07ee8', 'gif', 83, 'Take an open project, remix it with your own twist, and credit the original author. Show what you changed.'),
  ch('jun', 2026, 6, 30, 'Code jam', 'Project Tutorial Challenge', 'Project Tutorial', '#f0c93b', 'react', 69, 'The best way to learn is to teach. Write a step-by-step tutorial for a small project that a beginner could follow.'),
  ch('may', 2026, 5, 31, 'Just for fun', 'Workstation Challenge', 'Workstation', '#5b1fa6', 'localhost', 98, 'Show us your desk! Tidy it, light it, then share a photo and the story behind your setup.'),
  ch('apr', 2026, 4, 30, 'Just for fun', 'Portfolio Challenge', 'Portfolio', '#e8a6d8', 'keyframes', 38, 'Build a one-page portfolio with a hero section, a project grid and a contact link.'),
  ch('mar', 2026, 3, 31, 'Code jam', 'Daily Streak Challenge', 'Daily Streak', '#2b5aa8', 'sqlite', 140, 'Code a little every day for a week and share what you built each day.'),
  ch('feb', 2026, 2, 28, 'Design jam', 'Landing Page Design Jam', 'Landing Page', '#14b8a6', 'javagui', 54, 'Design a landing page for an imaginary product. Focus on layout, colour and typography.'),
  ch('jan', 2026, 1, 31, 'Hackathon', '48-Hour Mini Hackathon', 'Mini Hackathon', '#ef4444', 'deploy', 76, 'Team up (or go solo) and build something useful in one weekend, then demo it in two minutes.'),
];
const FILTERS = ['All', 'Code Jam', 'Design Jam', 'Hackathon', 'Just for fun'];
const WINNERS = [['Nora K.', 'Bubble the Pixel Frog'], ['Ilya M.', 'Study Quest Timer'], ['Sana R.', 'Garden Planner']];
const SAMPLE = [{ title: 'Moss the Mood Pet', by: 'nora', url: 'https://example.com/moss' }, { title: 'Cloud Cat Companion', by: 'ilya', url: 'https://example.com/cloud-cat' }];

// white card on a coloured background, with an original animated picture on the right
export const ChBanner = ({ c, w }) => {
  const h = Math.round(w * 0.64); const ip = Math.round(w * 0.045); const fs = Math.max(7, w * 0.03);
  const aw = Math.round((w - 2 * ip - w * 0.08) * 0.46) - 10; const ah = h - 2 * ip - Math.round(w * 0.08) - 10;
  return (
    <View style={{ width: w, height: h, backgroundColor: c.bg, padding: ip, overflow: 'hidden' }}>
      <View style={{ flex: 1, backgroundColor: '#fffdf4', borderRadius: 12, padding: w * 0.04, flexDirection: 'row' }}>
        <View style={{ flex: 1, paddingRight: 6 }}>
          <View style={{ alignSelf: 'flex-start', backgroundColor: '#e5e7eb', paddingHorizontal: 6, paddingVertical: 3 }}><Text style={{ fontFamily: F.px, fontSize: fs * 0.9, color: '#111' }}>{c.month.toUpperCase()}</Text></View>
          <Text style={{ fontFamily: F.px, fontSize: fs * 1.6, color: '#111', marginTop: 8, lineHeight: fs * 2.4 }}>MONTHLY{'\n'}CHALLENGE</Text>
          <Text style={{ fontFamily: F.r, fontSize: fs * 1.15, color: '#111', marginTop: 4 }} numberOfLines={2}>{c.sub}</Text>
          <View style={{ flex: 1 }} />
          <View style={{ alignSelf: 'flex-start', borderWidth: 2, borderColor: '#111', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3 }}><Text style={{ fontFamily: F.px, fontSize: fs * 0.75, color: '#111' }}>DEADLINE {c.dl}</Text></View>
        </View>
        <View style={{ width: '46%', backgroundColor: '#e5e7eb', borderRadius: 12, padding: 5 }}><Cover kind={c.art} w={aw} h={ah} /></View>
      </View>
    </View>
  );
};

// ---------------- notifications ----------------
export const Notifications = ({ open, onClose }) => {
  const { store, update, go } = useApp(); const read = store.notifRead || {};
  const markAll = () => update({ notifRead: Object.fromEntries(NOTIFS.map((n) => [n.id, true])) });
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: BG, paddingTop: 36 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#26324f' }}>
          <Pressable onPress={onClose} hitSlop={12}><T s={26} c="#8fa0c0">✕</T></Pressable><T b s={26} style={{ flex: 1, marginLeft: 22 }}>Notifications</T>
          <Pressable onPress={markAll}><T s={13} c={C.blue}>Mark all read</T></Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: 14 }}>
          {NOTIFS.map((n) => {
            const unread = !read[n.id]; const c = MONTHLY.find((x) => x.id === n.banner);
            return (
              <Pressable key={n.id} onPress={() => { update({ notifRead: { ...read, [n.id]: true } }); onClose(); if (n.go) go(n.go[0], n.go[1]); }} style={{ flexDirection: 'row', padding: 14, borderRadius: 12, marginBottom: 8, backgroundColor: unread ? '#1e2a42' : 'transparent' }}>
                <View style={{ width: 62 }}>
                  <View style={{ width: 54, height: 54, borderRadius: 27, backgroundColor: '#ffe14d', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 26 }}>🖥️</Text></View>
                  <View style={{ position: 'absolute', left: 30, top: 32, width: 28, height: 28, borderRadius: 14, backgroundColor: '#0a4f8f', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 14 }}>📣</Text></View>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row' }}><T b s={18} style={{ flex: 1 }}>CodeQuest Team</T><T s={15} c={C.mute}>{n.t}</T></View>
                  <T s={16} c="#c7d0e6" style={{ marginTop: 6 }}>{n.text}</T>
                  {c ? <View style={{ marginTop: 10, borderRadius: 12, overflow: 'hidden' }}><ChBanner c={c} w={Math.min(300, W - 150)} /></View> : null}
                </View>
                {unread ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#ff3b6b', position: 'absolute', right: 12, bottom: 12 }} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
};

// ---------------- monthly challenges ----------------
const MCard = ({ c, i }) => {
  const { go, store } = useApp(); const w = W - 32 - 6; const subs = c.subs + ((store.entries || {})[c.id] || []).length;
  return (
    <FadeIn delay={i * 70}>
      <Pressable onPress={() => go('monthlyDetail', { mid: c.id })} style={{ marginBottom: 18 }}>
        <View style={[{ backgroundColor: BG, overflow: 'hidden' }, edge]}>
          <ChBanner c={c} w={w} />
          <View style={{ padding: 16 }}>
            <Text style={{ fontFamily: F.r, fontSize: 13, letterSpacing: 3, color: C.mute }}>{c.kind.toUpperCase()}</Text>
            <T b s={21} style={{ marginTop: 8, lineHeight: 28 }}>{c.month.split(' ')[0]} {c.month.split(' ')[1]}: {c.title} ✨</T>
            <T s={15} c="#c7d0e6" numberOfLines={3} style={{ marginTop: 10 }}>{c.desc}</T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 14 }}><T s={15} c={C.blue} style={{ marginRight: 18 }}>📅  Submit by {c.label}</T><T s={15} c="#c7d0e6">👥  {subs} submissions</T></View>
          </View>
        </View>
      </Pressable>
    </FadeIn>
  );
};
export const MonthlyList = () => {
  const [f, setF] = useState('All'); const now = Date.now();
  const ok = (c) => f === 'All' || c.kind.toLowerCase() === f.toLowerCase();
  const cur = MONTHLY.filter((c) => c.date.getTime() > now && ok(c)); const past = MONTHLY.filter((c) => c.date.getTime() <= now && ok(c));
  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 50 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14 }}>
          <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: '#ffe14d', alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 3, borderColor: '#1a1a1a' }}><Text style={{ fontSize: 34 }}>🖥️</Text></View>
          <View style={{ flex: 1 }}><T px s={20}>Monthly Challenge</T><T s={16} c="#c7d0e6" style={{ marginTop: 8 }}>Let's make magic together ✧</T></View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 14 }}>
          {FILTERS.map((k) => <Pressable key={k} onPress={() => setF(k)} style={{ borderWidth: 2, borderColor: f === k ? '#19a7ff' : '#3a4560', backgroundColor: f === k ? '#06304f' : 'transparent', borderRadius: 28, paddingHorizontal: 22, paddingVertical: 10, marginRight: 10 }}><T b s={17} c={f === k ? '#19a7ff' : '#fff'}>{k}</T></Pressable>)}
        </ScrollView>
        {cur.length ? <><T px s={16} style={{ marginBottom: 16 }}>Current and upcoming</T>{cur.map((c, i) => <MCard key={c.id} c={c} i={i} />)}</> : null}
        {past.length ? <><T px s={16} style={{ marginVertical: 14 }}>Past challenges</T>{past.map((c, i) => <MCard key={c.id} c={c} i={i} />)}</> : null}
        {!cur.length && !past.length ? <T c={C.mute} style={{ textAlign: 'center', marginTop: 30 }}>No challenges in this category yet.</T> : null}
      </ScrollView>
    </View>
  );
};

const Countdown = ({ date }) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 15000); return () => clearInterval(t); }, []);
  const ms = Math.max(0, date.getTime() - now); const d = Math.floor(ms / 86400000), h = Math.floor((ms % 86400000) / 3600000), m = Math.floor((ms % 3600000) / 60000);
  return <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 18 }}>{[[d, 'DAYS'], [h, 'HRS'], [m, 'MIN']].map(([v, l]) => <View key={l} style={{ alignItems: 'center', marginHorizontal: 16 }}><T px s={30}>{v}</T><Text style={{ fontFamily: F.r, letterSpacing: 2, color: C.mute, marginTop: 8 }}>{l}</Text></View>)}</View>;
};
const Box = ({ children, style }) => <View style={[{ backgroundColor: BG, padding: 18, marginBottom: 14 }, edge, { borderBottomWidth: 4 }, style]}>{children}</View>;

export const MonthlyDetail = ({ mid }) => {
  const { store, update, back } = useApp(); const c = MONTHLY.find((x) => x.id === mid) || MONTHLY[0];
  const open = c.date.getTime() > Date.now(); const mine = (store.entries || {})[c.id] || [];
  const [form, setForm] = useState(false); const [title, setTitle] = useState(''); const [url, setUrl] = useState(''); const [note, setNote] = useState(''); const [toast, setToast] = useState(false); const [win, setWin] = useState(false);
  const submit = () => { update({ entries: { ...(store.entries || {}), [c.id]: [...mine, { title: title.trim(), url: url.trim(), by: store.name || 'you' }] } }); setForm(false); setTitle(''); setUrl(''); setNote(''); setToast(true); };
  const valid = title.trim().length > 1 && /^https?:\/\//i.test(url.trim());
  const input = { borderWidth: 1, borderColor: '#3a4560', color: C.text, padding: 12, fontFamily: F.r, fontSize: 16, marginTop: 6, backgroundColor: '#050b22' };
  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        <Pressable onPress={back}><T s={15} c={C.blue} style={{ marginBottom: 12 }}>← All challenges</T></Pressable>
        <View style={{ borderRadius: 6, overflow: 'hidden' }}><ChBanner c={c} w={W - 32} /></View>
        <T px s={17} style={{ marginTop: 20, lineHeight: 28 }}>{c.month}: {c.title}</T>
        <T s={14} c={C.blue} style={{ marginTop: 8 }}>{c.kind.toUpperCase()}</T>
        <View style={{ marginTop: 18 }}>
          {open ? <Box><T b s={18} style={{ textAlign: 'center' }}>Submissions due in</T><Countdown date={c.date} /><Btn label="Submit an entry" onPress={() => setForm(true)} /></Box>
            : <Box><T b s={20}>Winners have been announced!</T><T s={30} style={{ textAlign: 'center', marginVertical: 12 }}>🎉 🥇 🎊</T>
              {win ? WINNERS.map(([n, p], i) => <View key={n} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}><T s={22}>{['🥇', '🥈', '🥉'][i]}</T><View style={{ marginLeft: 12 }}><T b s={16}>{n}</T><T s={14} c={C.mute}>{p}</T></View></View>) : <Btn label="View winners" onPress={() => setWin(true)} />}</Box>}
          <Box><Text style={{ fontFamily: F.r, fontSize: 13, letterSpacing: 3, color: C.mute }}>TOTAL SUBMISSIONS</Text><T px s={20} style={{ marginTop: 10 }}>{c.subs + mine.length}</T></Box>
          <Box><Text style={{ fontFamily: F.r, fontSize: 13, letterSpacing: 3, color: C.mute }}>DEADLINE TO SUBMIT</Text><T b s={20} style={{ marginTop: 8 }}>{MN[c.date.getMonth()]} {c.date.getDate()} at 11:59pm</T></Box>
        </View>
        <T b s={20} style={{ marginTop: 8, marginBottom: 10 }}>About this challenge</T>
        <T s={16} c="#e8ecf5" style={{ lineHeight: 26 }}>{c.desc}</T>
        <T b s={20} style={{ marginTop: 22, marginBottom: 10 }}>How to enter</T>
        {['Build your project (any language or tool).', 'Put it online or share a public link.', 'Press "Submit an entry" and add the link.', 'Winners are picked by the community team.'].map((s, i) => <T key={i} s={16} c="#e8ecf5" style={{ marginBottom: 8 }}>{i + 1}.  {s}</T>)}
        <T b s={20} style={{ marginTop: 22, marginBottom: 10 }}>Recent submissions</T>
        {[...mine.map((m) => ({ ...m, you: true })), ...SAMPLE].map((m, i) => <Pressable key={i} onPress={() => Linking.openURL(m.url).catch(() => {})} style={{ borderWidth: 1, borderColor: '#26324f', padding: 14, marginBottom: 8 }}><T b s={16}>{m.title}{m.you ? '  (you)' : ''}</T><T s={14} c={C.mute}>@{m.by}  ·  <T s={14} c={C.blue}>{m.url}</T></T></Pressable>)}
      </ScrollView>
      <Modal visible={form} transparent animationType="slide" onRequestClose={() => setForm(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <View style={{ backgroundColor: '#0a1128', padding: 20, borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}><T px s={14} style={{ flex: 1 }}>Submit an entry</T><Pressable onPress={() => setForm(false)}><T s={24}>✕</T></Pressable></View>
            <T b s={14} style={{ marginTop: 16 }}>Project title</T><TextInput value={title} onChangeText={setTitle} placeholder="My pixel pet" placeholderTextColor={C.mute} style={input} />
            <T b s={14} style={{ marginTop: 14 }}>Project link (https://…)</T><TextInput value={url} onChangeText={setUrl} placeholder="https://" placeholderTextColor={C.mute} autoCapitalize="none" keyboardType="url" style={input} />
            <T b s={14} style={{ marginTop: 14 }}>Short note (optional)</T><TextInput value={note} onChangeText={setNote} placeholder="What did you build?" placeholderTextColor={C.mute} multiline style={[input, { minHeight: 70 }]} />
            <View style={{ marginTop: 18 }}><Btn label="Submit" disabled={!valid} onPress={submit} /></View>
          </View>
        </View>
      </Modal>
      {toast ? <Toast title="Entry submitted!" msg="Good luck! Your entry was added to the list." onClose={() => setToast(false)} /> : null}
    </View>
  );
};

// ---------------- Worlds ----------------
const Tree = ({ x, y, r, d = 0 }) => <A f={{ r: '-2deg' }} t={{ r: '2deg' }} rev dur={2400} delay={d} style={{ left: x - r, top: y - r }}><View style={{ width: r * 2, height: r * 2, borderRadius: r, backgroundColor: '#3f9b4f', borderWidth: 2, borderColor: '#2c7a3b' }}><View style={{ position: 'absolute', left: r * 0.4, top: r * 0.35, width: r * 0.7, height: r * 0.5, borderRadius: r, backgroundColor: '#63c174' }} /></View></A>;
const Lamp = ({ x, y }) => <><View style={{ position: 'absolute', left: x - 2, top: y, width: 4, height: 26, backgroundColor: '#2f3542' }} /><A f={{ o: 0.5, s: 1 }} t={{ o: 1, s: 1.4 }} rev dur={1100} style={{ left: x - 7, top: y - 8 }}><View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#ffe066' }} /></A></>;
const Scenery = ({ w, h }) => {
  const T2 = [[.06, .1, 22], [.2, .06, 16], [.9, .12, 20], [.82, .3, 15], [.07, .45, 17], [.93, .55, 19], [.2, .9, 16], [.55, .93, 18], [.95, .92, 17], [.35, .12, 13]];
  return (
    <View pointerEvents="none" style={abs}>
      <View style={{ position: 'absolute', left: w * 0.05, top: h * 0.62, width: w * 0.3, height: h * 0.1, borderRadius: 20, backgroundColor: '#dff0b9' }} />
      <View style={{ position: 'absolute', left: 0, top: h * 0.46, width: w, height: h * 0.13, backgroundColor: '#f2e2b4' }} /><View style={{ position: 'absolute', left: w * 0.45, top: 0, width: w * 0.12, height: h, backgroundColor: '#f2e2b4' }} />
      <View style={{ position: 'absolute', left: w * 0.3, top: h * 0.34, width: w * 0.4, height: w * 0.4, borderRadius: w, backgroundColor: '#f6e9bf' }} />
      <A f={{ s: 0.8, o: 0.8 }} t={{ s: 1.5, o: 0 }} dur={1800} style={{ left: w * 0.5 - w * 0.07, top: h * 0.5 - w * 0.07 }}><View style={{ width: w * 0.14, height: w * 0.14, borderRadius: w, borderWidth: 3, borderColor: '#8fd0f5' }} /></A>
      <View style={{ position: 'absolute', left: w * 0.5 - w * 0.06, top: h * 0.5 - w * 0.06, width: w * 0.12, height: w * 0.12, borderRadius: w, backgroundColor: '#7ec8f2', borderWidth: 3, borderColor: '#4a9fd1' }} />
      <View style={{ position: 'absolute', left: w * 0.1, top: h * 0.17, width: w * 0.3, height: h * 0.1, backgroundColor: '#fff', borderWidth: 3, borderColor: '#2563eb', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontFamily: F.px, fontSize: Math.max(6, w * 0.026), color: '#1e3a8a' }}>STUDY HALL</Text></View>
      <View style={{ position: 'absolute', left: w * 0.6, top: h * 0.7, width: w * 0.3, height: h * 0.2, backgroundColor: '#8b5a2b', borderWidth: 3, borderColor: '#5a3a14' }}>
        <View style={{ flexDirection: 'row', height: h * 0.07 }}>{[0, 1, 2, 3, 4, 5].map((i) => <View key={i} style={{ flex: 1, backgroundColor: i % 2 ? '#fff' : '#94a3b8' }} />)}</View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontFamily: F.px, fontSize: Math.max(6, w * 0.024), color: '#ffe9c2' }}>SNACKS</Text></View></View>
      <View style={{ position: 'absolute', left: w * 0.06, top: h * 0.74, width: w * 0.3, height: h * 0.18, backgroundColor: '#9a6a3a', borderWidth: 2, borderColor: '#6b4423', flexDirection: 'row', flexWrap: 'wrap', padding: 4, gap: 4 }}>{[...Array(6)].map((_, i) => <View key={i} style={{ width: '28%', aspectRatio: 1, borderRadius: 20, backgroundColor: i % 2 ? '#4caf50' : '#2e9a47' }} />)}</View>
      {T2.map(([x, y, r], i) => <Tree key={i} x={w * x} y={h * y} r={r} d={i * 200} />)}
      {[[.38, .3], [.62, .3], [.38, .62], [.62, .62]].map(([x, y], i) => <Lamp key={i} x={w * x} y={h * y} />)}
    </View>
  );
};
const TownMap = ({ w, h, interactive, name }) => {
  const box = useRef(null); const pos = useRef(new Animated.ValueXY({ x: w * 0.36, y: h * 0.55 })).current; const [bubble, setBubble] = useState(null);
  const talk = (who, t) => { setBubble({ who, t }); setTimeout(() => setBubble(null), 2400); };
  const move = (e) => {
    if (!interactive || !box.current) return; const px = e.nativeEvent.pageX, py = e.nativeEvent.pageY;
    box.current.measureInWindow((ox, oy) => Animated.timing(pos, { toValue: { x: Math.max(0, Math.min(w - 34, px - ox - 17)), y: Math.max(0, Math.min(h - 56, py - oy - 48)) }, duration: 700, easing: Easing.out(Easing.quad), useNativeDriver: true }).start());
  };
  return (
    <Pressable ref={box} onPress={move} style={{ width: w, height: h, backgroundColor: '#cfe8a4', overflow: 'hidden', borderRadius: 14 }}>
      <Scenery w={w} h={h} />
      <A f={{ x: w * 0.05 }} t={{ x: w * 0.8 }} rev dur={9000} ease={Easing.inOut(Easing.quad)} style={{ left: 0, top: h * 0.5 }}><Pressable onPress={() => talk('robot', 'Beep! Welcome to the plaza.')}><Spr rows={ROBOT} map={ROBOTM} s={3} /></Pressable></A>
      <A f={{ y: 0 }} t={{ y: -12 }} rev dur={450} style={{ left: w * 0.7, top: h * 0.62 }}><Pressable onPress={() => talk('slime', 'Blub blub! Try the snacks.')}><Slime px={4} /></Pressable></A>
      <A f={{ x: 0 }} t={{ x: -w * 0.3 }} rev dur={7000} style={{ left: w * 0.55, top: h * 0.3 }}><Spr rows={CAT} map={CATM} s={3} /></A>
      {interactive ? <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, transform: pos.getTranslateTransform() }}>
        <View style={{ position: 'absolute', top: -22, left: -20, width: 80, alignItems: 'center' }}><Text style={{ fontFamily: F.b, fontSize: 11, color: '#fff', backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 6, borderRadius: 6 }}>{name}</Text></View>
        <Explorer s={3} /></Animated.View> : null}
      {bubble ? <View style={{ position: 'absolute', left: 10, right: 10, bottom: 10, backgroundColor: '#fff', borderRadius: 10, padding: 10 }}><Text style={{ fontFamily: F.b, color: '#111' }}>{bubble.t}</Text></View> : null}
    </Pressable>
  );
};

export const Worlds = () => {
  const { store, update, go } = useApp(); const [edit, setEdit] = useState(false); const [nm, setNm] = useState(store.name || '');
  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 50 }} keyboardShouldPersistTaps="handled">
        <T px s={22} style={{ textAlign: 'center', marginTop: 16 }}>CodeQuest Worlds</T>
        <T s={16} c="#c7d0e6" style={{ textAlign: 'center', marginTop: 16, marginBottom: 22 }}>Hang out in a cosy pixel town. Walk around, meet the locals and get ready for community events. (Demo world: no other players yet.)</T>
        <TownMap w={W - 32} h={Math.round((W - 32) * 0.95)} />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}><T b s={20} style={{ flex: 1 }}>Town Square</T><View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#14532d', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 }}><View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#4ade80', marginRight: 8 }} /><Text style={{ fontFamily: F.b, letterSpacing: 2, color: '#d1fae5' }}>DEMO WORLD</Text></View></View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 26 }}>
          <View style={{ width: 84, height: 96, backgroundColor: '#0a1128', alignItems: 'center', justifyContent: 'center' }}><Explorer s={5} /></View>
          <View style={{ marginLeft: 16, flex: 1 }}>
            {edit ? <TextInput value={nm} onChangeText={setNm} autoFocus autoCapitalize="none" style={{ borderWidth: 1, borderColor: C.lime, color: C.text, padding: 8, fontFamily: F.b, fontSize: 18 }} /> : <T b s={24}>{(store.name || 'LEARNER').toUpperCase()}</T>}
            <Pressable onPress={() => { if (edit && nm.trim()) update({ name: nm.trim() }); setEdit(!edit); }}><T b s={16} c={C.blue} style={{ marginTop: 10 }}>{edit ? 'Save' : 'Edit'}</T></Pressable>
          </View>
        </View>
        <View style={{ marginTop: 22 }}><Btn label="Enter Worlds" onPress={() => go('world')} /></View>
      </ScrollView>
    </View>
  );
};
export const World = () => {
  const { store, back } = useApp(); const h = SH - 250;
  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <Header />
      <View style={{ padding: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}><T b s={18} style={{ flex: 1 }}>Town Square</T><Btn small label="Exit" color="#1a2540" dark="#3a4560" onPress={back} /></View>
        <TownMap w={W - 24} h={h} interactive name={store.name || 'you'} />
        <T s={13} c={C.mute} style={{ marginTop: 10, textAlign: 'center' }}>Tap the map to walk there. Tap the robot or the slime to say hi.</T>
      </View>
    </View>
  );
};
