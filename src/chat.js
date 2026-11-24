// Support chat widget: home tab, messages tab, conversation with emojis, GIF-style stickers, voice notes and file attachments
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal, Animated, Image, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import { useAudioRecorder, RecordingPresets, AudioModule, setAudioModeAsync, createAudioPlayer } from 'expo-audio';
import { F } from './theme';
import { useApp } from './context/AppContext';
import { Sticker, STICKERS } from './stickers';

const { width: W, height: SH } = Dimensions.get('window');
const YEL = '#ffd21a'; const INK = '#14181f'; const GREY = '#6b7280';
const EMO = [
  ['Frequently used', [['👍', 'thumbs up like yes'], ['👎', 'thumbs down no'], ['😭', 'cry sad'], ['🙁', 'sad frown'], ['😐', 'neutral meh'], ['😊', 'smile happy'], ['😍', 'love heart eyes']]],
  ['Smileys & Emotion', [['😀', 'grin happy'], ['😃', 'smile'], ['😄', 'laugh'], ['😁', 'beam'], ['😆', 'laugh squint'], ['😅', 'sweat smile'], ['🤣', 'rofl lol'], ['😂', 'joy tears'], ['🙂', 'slight smile'], ['🙃', 'upside down'], ['😉', 'wink'], ['😇', 'angel'], ['🥰', 'love'], ['🤩', 'star struck wow'], ['😘', 'kiss'], ['😋', 'yum'], ['😜', 'tongue wink'], ['🤗', 'hug'], ['🤔', 'think hmm'], ['😴', 'sleep'], ['😮', 'surprised wow'], ['😳', 'flushed'], ['🥺', 'pleading'], ['😢', 'tear'], ['😤', 'steam'], ['😡', 'angry'], ['🥳', 'party'], ['😎', 'cool'], ['🤓', 'nerd']]],
  ['Gestures', [['👏', 'clap'], ['🙌', 'celebrate hands'], ['🙏', 'please thanks pray'], ['💪', 'strong muscle'], ['👋', 'wave hello'], ['✌️', 'peace victory'], ['🤞', 'fingers crossed'], ['👌', 'ok']]],
  ['Objects & symbols', [['💻', 'laptop code'], ['⌨️', 'keyboard'], ['🎮', 'game'], ['🚀', 'rocket launch'], ['💡', 'idea bulb'], ['🔥', 'fire hot'], ['⭐', 'star'], ['✨', 'sparkles'], ['🎉', 'party popper'], ['🏆', 'trophy'], ['📚', 'books'], ['✅', 'check done'], ['❤️', 'heart love'], ['💜', 'purple heart'], ['💙', 'blue heart'], ['💚', 'green heart']]],
];
const REPLIES = ['Thanks for reaching out! 👋 Our team is back online later today and will reply here.', 'Got it! Your message is saved and someone will get back to you soon.', 'Thank you! We read every message, and we will answer as soon as we can. 💛'];
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const kb = (n) => (n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round((n || 0) / 1024)) + ' KB');

const Wave = ({ n = 22, h = 26 }) => {
  const v = useRef([...Array(n)].map(() => new Animated.Value(0))).current;
  useEffect(() => { v.forEach((a, i) => Animated.loop(Animated.sequence([Animated.timing(a, { toValue: 1, duration: 250 + (i % 5) * 90, useNativeDriver: false }), Animated.timing(a, { toValue: 0.1, duration: 250 + (i % 4) * 80, useNativeDriver: false })])).start()); }, []);
  return <View style={{ flexDirection: 'row', alignItems: 'center', height: h, gap: 3 }}>{v.map((a, i) => <Animated.View key={i} style={{ width: 2, backgroundColor: INK, height: a.interpolate({ inputRange: [0, 1], outputRange: [3, h] }) }} />)}</View>;
};
const VoiceMsg = ({ m, mine }) => {
  const p = useRef(null); const [on, setOn] = useState(false);
  const toggle = () => { try { if (!p.current) p.current = createAudioPlayer({ uri: m.uri }); if (on) { p.current.pause(); setOn(false); } else { p.current.seekTo(0); p.current.play(); setOn(true); } } catch (e) {} };
  useEffect(() => () => { try { if (p.current && p.current.remove) p.current.remove(); } catch (e) {} }, []);
  return <Pressable onPress={toggle} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><Text style={{ fontSize: 20, color: INK }}>{on ? '⏸' : '▶'}</Text><View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>{[...Array(18)].map((_, i) => <View key={i} style={{ width: 2, height: 4 + ((i * 7) % 14), backgroundColor: INK, opacity: 0.7 }} />)}</View><Text style={{ fontFamily: F.r, color: INK }}>{fmt(m.secs || 0)}</Text></Pressable>;
};
const Msg = ({ m }) => {
  const mine = m.from === 'me';
  const body = m.type === 'gif' ? <Sticker id={m.gif} w={190} h={134} /> : m.type === 'voice' ? <VoiceMsg m={m} mine={mine} />
    : m.type === 'file' ? <View>{m.mime && m.mime.startsWith('image') ? <Image source={{ uri: m.uri }} style={{ width: 180, height: 120, borderRadius: 8, marginBottom: 6 }} /> : null}<Text style={{ fontFamily: F.b, color: INK }}>📎 {m.name}</Text><Text style={{ fontFamily: F.r, fontSize: 12, color: mine ? '#5a4a00' : GREY }}>{kb(m.size)}</Text></View>
    : <Text style={{ fontFamily: F.r, fontSize: 15, color: INK, lineHeight: 21 }}>{m.text}</Text>;
  return <View style={{ alignItems: mine ? 'flex-end' : 'flex-start', marginBottom: 10 }}><View style={{ maxWidth: '82%', backgroundColor: m.type === 'gif' ? 'transparent' : mine ? YEL : '#eef0f3', borderRadius: 16, borderBottomRightRadius: mine ? 4 : 16, borderBottomLeftRadius: mine ? 16 : 4, padding: m.type === 'gif' ? 0 : 12 }}>{body}</View></View>;
};

const Fab = ({ onPress, open }) => (
  <Pressable onPress={onPress} style={{ position: 'absolute', right: 16, bottom: 16, width: 60, height: 60, borderRadius: 30, backgroundColor: YEL, alignItems: 'center', justifyContent: 'center', elevation: 8, zIndex: 90 }}>
    {open ? <Text style={{ fontSize: 26, color: INK }}>⌄</Text> : <View style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: INK, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 5 }}><View style={{ width: 12, height: 6, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, borderWidth: 2, borderTopWidth: 0, borderColor: YEL }} /></View>}
  </Pressable>
);
const Tabs = ({ view, set }) => (
  <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#e5e7eb', paddingVertical: 10 }}>
    {[['home', '⌂', 'Home'], ['messages', '💬', 'Messages']].map(([k, i, l]) => <Pressable key={k} onPress={() => set(k)} style={{ flex: 1, alignItems: 'center' }}><Text style={{ fontSize: 24, color: view === k ? INK : '#9ca3af' }}>{i}</Text><Text style={{ fontFamily: view === k ? F.b : F.r, fontSize: 16, color: view === k ? INK : '#9ca3af' }}>{l}</Text></Pressable>)}
  </View>
);

export const ChatWidget = () => {
  const { store, update } = useApp();
  const [open, setOpen] = useState(false); const [view, setView] = useState('home'); const [full, setFull] = useState(false); const [menu, setMenu] = useState(false);
  const [text, setText] = useState(''); const [pop, setPop] = useState(null); const [q, setQ] = useState(''); const [recording, setRecording] = useState(false); const [secs, setSecs] = useState(0); const [note, setNote] = useState('');
  const scroll = useRef(null); const rec = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const msgs = store.chat || [];
  useEffect(() => { if (!recording) return undefined; setSecs(0); const t = setInterval(() => setSecs((s) => s + 1), 1000); return () => clearInterval(t); }, [recording]);
  useEffect(() => { if (scroll.current) setTimeout(() => scroll.current && scroll.current.scrollToEnd({ animated: true }), 80); }, [msgs.length, view]);
  const flash = (t) => { setNote(t); setTimeout(() => setNote(''), 2500); };

  const add = (m) => {
    const mineMsg = { id: String(Date.now()) + Math.random(), ts: Date.now(), from: 'me', ...m };
    const next = [...msgs, mineMsg]; update({ chat: next });
    const sinceTeam = [...next].reverse().findIndex((x) => x.from === 'team'); const burst = sinceTeam === -1 ? next.length : sinceTeam;
    if (burst === 1) setTimeout(() => update({ chat: [...next, { id: String(Date.now()) + 'r', ts: Date.now(), from: 'team', type: 'text', text: REPLIES[next.length % REPLIES.length] }] }), 1000);
  };
  const send = () => { const t = text.trim(); if (!t) return; add({ type: 'text', text: t }); setText(''); setPop(null); };
  const attach = async () => {
    try { const r = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true }); if (r.canceled || !r.assets || !r.assets.length) return; const f = r.assets[0]; add({ type: 'file', name: f.name, size: f.size, uri: f.uri, mime: f.mimeType }); }
    catch (e) { flash('Could not open the file picker.'); }
  };
  const startRec = async () => {
    try { const p = await AudioModule.requestRecordingPermissionsAsync(); if (!p.granted) { flash('Microphone permission is needed to record.'); return; }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true }); await rec.prepareToRecordAsync(); rec.record(); setPop(null); setRecording(true); }
    catch (e) { setRecording(false); flash('Voice recording is not available here.'); }
  };
  const stopRec = async (sendIt) => {
    const len = secs;
    try { await rec.stop(); await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true }); if (sendIt && rec.uri && len > 0) add({ type: 'voice', uri: rec.uri, secs: len }); }
    catch (e) { flash('Could not save the recording.'); }
    setRecording(false);
  };

  const pw = full ? W - 12 : Math.min(W - 24, 440); const ph = full ? SH - 40 : Math.min(SH * 0.74, 640);
  const emo = EMO.map(([t, list]) => [t, q.trim() ? list.filter(([e, k]) => k.includes(q.trim().toLowerCase())) : list]).filter(([, l]) => l.length);
  const gifs = STICKERS.filter((s) => !q.trim() || (s.label + ' ' + s.kw).toLowerCase().includes(q.trim().toLowerCase()));
  const openPop = (k) => { setQ(''); setPop(pop === k ? null : k); };

  return (
    <>
      <Fab onPress={() => { setOpen(true); }} open={false} />
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }}>
          <Pressable style={{ ...{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } }} onPress={() => setOpen(false)} />
          <View style={{ width: pw, height: ph, marginRight: full ? 6 : 12, marginBottom: 86, backgroundColor: '#fff', borderRadius: 22, overflow: 'hidden' }}>

            {view === 'home' && <>
              <LinearGradient colors={['#d9f2c4', '#d9f2c4']} style={{ paddingHorizontal: 22, paddingTop: 22, paddingBottom: 60 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 22, height: 22, backgroundColor: YEL, borderRadius: 4, marginRight: 10 }} /><Text style={{ flex: 1, fontFamily: F.px, fontSize: 15, color: INK }}>CodeQuest</Text>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#b8960c', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}><Text style={{ fontFamily: F.b, fontSize: 20, color: INK }}>{(store.name || 'S')[0].toUpperCase()}</Text></View>
                  <Pressable onPress={() => setOpen(false)} hitSlop={12}><Text style={{ fontSize: 24, color: INK }}>✕</Text></Pressable>
                </View>
                <Text style={{ fontFamily: F.b, fontSize: 32, lineHeight: 40, color: INK, marginTop: 44 }}>Hi there 👋{'\n'}How can we help?</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Pressable onPress={() => setView('chat')} style={{ marginHorizontal: 18, marginTop: -34, backgroundColor: '#fff', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8 }}>
                  <View style={{ flex: 1 }}><Text style={{ fontFamily: F.b, fontSize: 17, color: INK }}>Send us a message</Text><Text style={{ fontFamily: F.r, fontSize: 15, color: GREY, marginTop: 4 }}>We'll be back online later today</Text></View><Text style={{ fontSize: 24, color: INK }}>➤</Text>
                </Pressable>
              </View>
              <Tabs view={view} set={setView} />
            </>}

            {view === 'messages' && <>
              <View style={{ paddingVertical: 18, borderBottomWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' }}><Text style={{ fontFamily: F.b, fontSize: 20, color: INK }}>Messages</Text><Pressable onPress={() => setOpen(false)} hitSlop={12} style={{ position: 'absolute', right: 18, top: 16 }}><Text style={{ fontSize: 24, color: INK }}>✕</Text></Pressable></View>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                {msgs.length ? <Pressable onPress={() => setView('chat')} style={{ alignSelf: 'stretch', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, padding: 14 }}><Text style={{ fontFamily: F.b, color: INK }}>CodeQuest support</Text><Text numberOfLines={1} style={{ fontFamily: F.r, color: GREY, marginTop: 4 }}>{(() => { const l = msgs[msgs.length - 1]; return l.type === 'text' ? l.text : l.type === 'gif' ? '🎞 Sticker' : l.type === 'voice' ? '🎤 Voice message' : '📎 ' + l.name; })()}</Text></Pressable> : <>
                  <Text style={{ fontSize: 44 }}>💬</Text><Text style={{ fontFamily: F.b, fontSize: 24, color: INK, marginTop: 14 }}>No recent conversations</Text><Text style={{ fontFamily: F.r, fontSize: 16, color: INK, marginTop: 10, textAlign: 'center' }}>Your recent conversations will appear here.</Text></>}
                <Pressable onPress={() => setView('chat')} style={{ marginTop: 28, backgroundColor: YEL, borderRadius: 16, paddingHorizontal: 28, paddingVertical: 18 }}><Text style={{ fontFamily: F.b, fontSize: 17, color: INK }}>Send us a message  ➤</Text></Pressable>
              </View>
              <Tabs view={view} set={setView} />
            </>}

            {view === 'chat' && <>
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderColor: '#e5e7eb' }}>
                <Pressable onPress={() => { setView('home'); setPop(null); setMenu(false); }} hitSlop={12}><Text style={{ fontSize: 28, color: GREY, marginHorizontal: 8 }}>‹</Text></Pressable>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#b8960c', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}><Text style={{ fontFamily: F.b, fontSize: 20, color: INK }}>S</Text></View>
                <View style={{ flex: 1 }}><Text style={{ fontFamily: F.b, fontSize: 18, color: INK }}>CodeQuest</Text><Text style={{ fontFamily: F.r, fontSize: 14, color: GREY }}>🕒 Back later today</Text></View>
                <Pressable onPress={() => setMenu(!menu)} hitSlop={10} style={{ padding: 8 }}><Text style={{ fontSize: 22, color: GREY }}>•••</Text></Pressable>
                <Pressable onPress={() => setOpen(false)} hitSlop={10} style={{ padding: 8 }}><Text style={{ fontSize: 24, color: INK }}>✕</Text></Pressable>
              </View>
              {menu ? <View style={{ position: 'absolute', top: 70, right: 70, zIndex: 20, backgroundColor: '#fff', borderRadius: 14, padding: 6, elevation: 6, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8 }}>
                <Pressable onPress={() => { setFull(!full); setMenu(false); }} style={{ padding: 12 }}><Text style={{ fontFamily: F.r, fontSize: 16, color: INK }}>⤢  {full ? 'Collapse window' : 'Expand window'}</Text></Pressable>
                <Pressable onPress={() => { update({ chat: [] }); setMenu(false); }} style={{ padding: 12 }}><Text style={{ fontFamily: F.r, fontSize: 16, color: INK }}>🗑  Clear conversation</Text></Pressable>
              </View> : null}
              <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
                {msgs.length ? msgs.map((m) => <Msg key={m.id} m={m} />) : <Text style={{ fontFamily: F.r, fontSize: 17, color: GREY, textAlign: 'center', marginTop: 14 }}>Ask us anything, or share your feedback.</Text>}
              </ScrollView>
              {note ? <Text style={{ textAlign: 'center', fontFamily: F.r, color: '#b91c1c', paddingBottom: 6 }}>{note}</Text> : null}
              {pop ? <View style={{ position: 'absolute', left: 14, right: 14, bottom: 128, height: Math.min(300, ph - 220), backgroundColor: '#fff', borderRadius: 16, padding: 12, elevation: 8, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, zIndex: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#e5e7eb', paddingBottom: 8, marginBottom: 8 }}><Text style={{ fontSize: 20, marginRight: 10 }}>🔍</Text><TextInput value={q} onChangeText={setQ} placeholder={pop === 'emoji' ? 'Search emoji…' : 'Search GIFs…'} placeholderTextColor="#9ca3af" style={{ flex: 1, fontFamily: F.r, fontSize: 17, color: INK, padding: 0 }} /></View>
                <ScrollView nestedScrollEnabled>
                  {pop === 'emoji' ? emo.map(([t, list]) => <View key={t}><Text style={{ fontFamily: F.b, fontSize: 13, color: GREY, letterSpacing: 0.5, marginVertical: 8 }}>{t.toUpperCase()}</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{list.map(([e]) => <Pressable key={e} onPress={() => setText((x) => x + e)} style={{ width: '14.28%', alignItems: 'center', paddingVertical: 6 }}><Text style={{ fontSize: 28 }}>{e}</Text></Pressable>)}</View></View>)
                    : <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>{gifs.length ? gifs.map((s) => <Pressable key={s.id} onPress={() => { add({ type: 'gif', gif: s.id }); setPop(null); }} style={{ marginBottom: 10 }}><Sticker id={s.id} w={Math.floor((pw - 24 - 36) / 2)} h={96} /></Pressable>) : <Text style={{ fontFamily: F.r, color: GREY }}>No stickers match “{q}”.</Text>}</View>}
                </ScrollView>
              </View> : null}
              <View style={{ margin: 14, marginTop: 4, borderWidth: 3, borderColor: YEL, borderRadius: 26, padding: 12, backgroundColor: '#fff' }}>
                {recording ? <View style={{ flexDirection: 'row', alignItems: 'center', height: 58 }}>
                  <Pressable onPress={() => stopRec(false)} hitSlop={10}><Text style={{ fontSize: 26, color: INK }}>✕</Text></Pressable>
                  <View style={{ flex: 1, alignItems: 'center' }}><Wave /></View><Text style={{ fontFamily: F.r, color: INK, marginRight: 10 }}>{fmt(secs)}</Text>
                  <Pressable onPress={() => stopRec(true)} style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: YEL, alignItems: 'center', justifyContent: 'center' }}><View style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: INK }} /></Pressable>
                </View> : <>
                  <TextInput value={text} onChangeText={setText} placeholder="Message…" placeholderTextColor="#6b7280" multiline style={{ fontFamily: F.r, fontSize: 18, color: INK, minHeight: 34, maxHeight: 90, padding: 0 }} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Pressable onPress={attach} hitSlop={8} style={{ marginRight: 18 }}><Text style={{ fontSize: 24, color: GREY }}>📎</Text></Pressable>
                    <Pressable onPress={() => openPop('emoji')} hitSlop={8} style={{ marginRight: 18 }}><Text style={{ fontSize: 24, color: pop === 'emoji' ? YEL : GREY }}>☺</Text></Pressable>
                    <Pressable onPress={() => openPop('gif')} hitSlop={8} style={{ marginRight: 18, backgroundColor: pop === 'gif' ? YEL : '#e5e7eb', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}><Text style={{ fontFamily: F.b, fontSize: 13, color: INK }}>GIF</Text></Pressable>
                    <Pressable onPress={startRec} hitSlop={8}><Text style={{ fontSize: 24, color: GREY }}>🎤</Text></Pressable>
                    <View style={{ flex: 1 }} />
                    <Pressable onPress={send} disabled={!text.trim()} style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: text.trim() ? YEL : '#e5e7eb', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 22, color: text.trim() ? INK : '#9ca3af' }}>↑</Text></Pressable>
                  </View></>}
              </View>
            </>}
          </View>
          <Pressable onPress={() => setOpen(false)} style={{ position: 'absolute', right: 16, bottom: 16, width: 60, height: 60, borderRadius: 30, backgroundColor: YEL, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 26, color: INK }}>⌄</Text></Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};
