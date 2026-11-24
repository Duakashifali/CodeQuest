// Project Tutorials: list page (search, chips, carousels, sort) + tutorial page (author, like/comment/bookmark, code, resources)
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Share, Linking, Dimensions, Platform } from 'react-native';
import { C, F } from './theme';
import { T, Btn, Header, FadeIn } from './ui';
import { useApp } from './context/AppContext';
import { Cover } from './covers';
import { TUTORIALS, AUTHORS, SECTIONS, CHIPS } from './tutorials';
import { COURSES } from './data';
import { Banner } from './scenes';
import { RunFrame } from './RunFrame';
import { Diagram } from './diagrams';

const { width: W } = Dimensions.get('window');
const MONO = Platform.select({ android: 'monospace', ios: 'Courier', default: 'monospace' });
const BG = '#02051a';
const edge = { borderWidth: 3, borderTopColor: '#3a4a78', borderLeftColor: '#3a4a78', borderRightColor: '#0a0f1f', borderBottomColor: '#0a0f1f', borderBottomWidth: 6 };
const LV = { Beginner: 1, Intermediate: 2, Advanced: 3 };

const Pill = ({ children, bars }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213b', borderRadius: 18, paddingHorizontal: 13, paddingVertical: 7, marginRight: 8, marginTop: 6 }}>
    {bars !== undefined ? <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginRight: 8 }}>{[5, 8, 11].map((h, i) => <View key={i} style={{ width: 3, height: h, marginRight: 2, backgroundColor: i < bars ? '#cbd5e1' : '#475569' }} />)}</View> : null}
    <Text style={{ fontFamily: F.b, fontSize: 11, letterSpacing: 2, color: '#cbd5e1' }}>{String(children).toUpperCase()}</Text>
  </View>
);
const Rich = ({ text, style }) => (
  <Text style={[{ fontFamily: F.r, fontSize: 16, lineHeight: 26, color: '#e8ecf5' }, style]}>
    {text.split('|').map((s, k) => (k % 2 ? <Text key={k} style={{ fontFamily: MONO, fontSize: 14, backgroundColor: '#14203a' }}> {s} </Text> : s))}
  </Text>
);

// one tutorial card: animated cover, kicker, title, language + level pills
const TCard = ({ t, w, i = 0 }) => {
  const { go } = useApp(); const inner = w - 6;
  return (
    <FadeIn delay={i * 70}>
      <Pressable onPress={() => go('tutorial', { tid: t.id })} style={{ width: w, marginRight: 14, marginBottom: 16 }}>
        <View style={[{ backgroundColor: BG, overflow: 'hidden' }, edge]}>
          <Cover kind={t.cover} w={inner} h={Math.round(inner * 0.5)} />
          <View style={{ padding: 14 }}>
            <Text style={{ fontFamily: F.r, fontSize: 11, letterSpacing: 2.5, color: C.mute }}>TUTORIAL</Text>
            <T b s={17} numberOfLines={2} style={{ marginTop: 6, minHeight: 44 }}>{t.title}</T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}><Pill>{t.lang}</Pill><Pill bars={LV[t.level]}>{t.level}</Pill></View>
          </View>
        </View>
      </Pressable>
    </FadeIn>
  );
};

// ---------------- list screen ----------------
export const Tutorials = ({ author }) => {
  const { store, back } = useApp();
  const [q, setQ] = useState(''); const [chip, setChip] = useState('All'); const [sort, setSort] = useState('Latest'); const [menu, setMenu] = useState(false); const [more, setMore] = useState(6);
  const au = author ? AUTHORS[author] : null;
  const likesOf = (t) => t.likes + ((store.tlikes || {})[t.id] ? 1 : 0); const savesOf = (t) => t.saves + ((store.tsaves || {})[t.id] ? 1 : 0);
  const sorted = [...TUTORIALS].sort((a, b) => (sort === 'Latest' ? b.ts - a.ts : sort === 'Most liked' ? likesOf(b) - likesOf(a) : savesOf(b) - savesOf(a)));
  const query = q.trim().toLowerCase();
  const list = sorted.filter((t) => (!author || t.au === author) && (chip === 'All' || t.chips.includes(chip)) && (!query || [t.title, t.lang, t.level, ...t.tags].join(' ').toLowerCase().includes(query)));
  const filtered = !!(query || chip !== 'All' || author);
  const cardW = Math.min(280, Math.round(W * 0.74));
  const find = (id) => TUTORIALS.find((t) => t.id === id);
  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }} keyboardShouldPersistTaps="handled">
        <View style={{ backgroundColor: '#1d283d', paddingVertical: 34, paddingHorizontal: 20, alignItems: 'center' }}>
          {au ? <Pressable onPress={back}><T s={13} c={C.blue} style={{ marginBottom: 10 }}>← Back</T></Pressable> : null}
          <T px s={22} style={{ textAlign: 'center' }}>{au ? `By ${au.name}` : 'Project Tutorials'}</T>
          <T s={15} c="#e6ecf8" style={{ textAlign: 'center', marginTop: 16 }}>{au ? au.bio : 'Ready to build? Pick a walkthrough and make something real, one step at a time.'}</T>
        </View>
        <View style={{ padding: 16 }}>
          <View style={[{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, backgroundColor: '#050b22' }, edge, { borderBottomWidth: 4 }]}>
            <T s={18} c={C.mute}>🔍</T>
            <TextInput value={q} onChangeText={setQ} placeholder="Search…" placeholderTextColor={C.mute} autoCapitalize="none" style={{ flex: 1, color: C.text, paddingVertical: 12, paddingHorizontal: 10, fontFamily: F.r, fontSize: 16 }} />
            {q ? <Pressable onPress={() => setQ('')} hitSlop={10}><T s={18} c={C.mute}>✕</T></Pressable> : null}
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 18 }}>
          {CHIPS.map((k) => <Pressable key={k} onPress={() => { setChip(k); setMore(6); }} style={{ borderWidth: 2, borderColor: chip === k ? '#19a7ff' : '#3a4560', backgroundColor: chip === k ? '#06304f' : 'transparent', borderRadius: 26, paddingHorizontal: 20, paddingVertical: 9, marginRight: 10 }}><T b s={16} c={chip === k ? '#19a7ff' : '#fff'}>{k}</T></Pressable>)}
        </ScrollView>

        {filtered ? (
          <View style={{ paddingHorizontal: 16 }}>
            <T s={13} c={C.mute} style={{ marginBottom: 12 }}>{list.length} tutorial{list.length === 1 ? '' : 's'}{query ? ` for "${q.trim()}"` : ''}{chip !== 'All' ? ` in ${chip}` : ''}</T>
            {list.length ? list.map((t, i) => <TCard key={t.id} t={t} w={W - 32} i={i} />) : <T c={C.mute} style={{ textAlign: 'center', paddingVertical: 30 }}>No tutorials match yet. Try another word or filter.</T>}
          </View>
        ) : (
          <>
            {SECTIONS.map(([emoji, title, desc, ids]) => (
              <View key={title} style={{ marginBottom: 14 }}>
                <View style={{ paddingHorizontal: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{ fontSize: 26, marginRight: 12 }}>{emoji}</Text><T px s={15} style={{ flex: 1 }}>{title}</T></View>
                  <T s={14} c="#c7d0e6" style={{ marginTop: 10, marginBottom: 16 }}>{desc}</T>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>{ids.map((id, i) => <TCard key={id} t={find(id)} w={cardW} i={i} />)}</ScrollView>
              </View>
            ))}
            <View style={{ paddingHorizontal: 16, zIndex: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{ fontSize: 26, marginRight: 12 }}>📚</Text><T px s={15} style={{ flex: 1 }}>All project tutorials</T></View>
              <T s={14} c="#c7d0e6" style={{ marginTop: 10, marginBottom: 14 }}>Browse every walkthrough, sorted your way.</T>
              <Pressable onPress={() => setMenu(!menu)} style={{ borderWidth: 2, borderColor: '#19a7ff', backgroundColor: '#050b22', paddingHorizontal: 16, paddingVertical: 13, flexDirection: 'row', justifyContent: 'space-between' }}><T b s={16}>{sort}</T><T s={16} c={C.mute}>{menu ? '˄' : '˅'}</T></Pressable>
              {menu ? <View style={[{ backgroundColor: '#050b22', paddingVertical: 6, marginTop: 6 }, edge, { borderBottomWidth: 3 }]}>
                {['Latest', 'Most liked', 'Most bookmarked'].map((o) => <Pressable key={o} onPress={() => { setSort(o); setMenu(false); }} style={{ paddingVertical: 12, paddingHorizontal: 16 }}><T b s={16} c={o === sort ? '#19a7ff' : '#fff'}>{o}</T></Pressable>)}
              </View> : null}
              <View style={{ marginTop: 18 }}>
                {sorted.slice(0, more).map((t, i) => <TCard key={t.id} t={t} w={W - 32} i={i % 6} />)}
                {more < sorted.length ? <Btn label="Show more ▾" onPress={() => setMore(more + 6)} /> : null}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

// ---------------- tutorial page ----------------
const Action = ({ icon, count, on, onPress }) => (
  <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: on ? '#19a7ff' : '#3a4560', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, marginRight: 10, backgroundColor: on ? '#06304f' : 'transparent' }}>
    <Text style={{ fontSize: 18, color: on ? '#19a7ff' : '#cbd5e1' }}>{icon}</Text>
    {count != null ? <Text style={{ fontFamily: F.b, fontSize: 16, color: '#fff', marginLeft: 8 }}>{count}</Text> : null}
  </Pressable>
);
const CodeBox = ({ code }) => (
  <View style={{ backgroundColor: '#101a30', borderRadius: 10, padding: 14, marginVertical: 10 }}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}><Text style={{ fontFamily: MONO, fontSize: 13, lineHeight: 21, color: '#e6edf7', paddingRight: 40 }}>{code}</Text></ScrollView>
    <Pressable onPress={() => { try { Share.share({ message: code }); } catch (e) {} }} hitSlop={10} style={{ position: 'absolute', right: 10, top: 8 }}><Text style={{ fontSize: 18, color: '#8fa0c0' }}>⧉</Text></Pressable>
  </View>
);

export const Tutorial = ({ tid }) => {
  const { store, update, go, back } = useApp();
  const t = TUTORIALS.find((x) => x.id === tid); const au = AUTHORS[t.au];
  const liked = !!(store.tlikes || {})[tid]; const saved = !!(store.tsaves || {})[tid]; const following = !!(store.follows || {})[t.au];
  const mine = (store.tcomments || {})[tid] || [];
  const [showC, setShowC] = useState(false); const [draft, setDraft] = useState('');
  const flip = (key, cur) => update({ [key]: { ...(store[key] || {}), [tid]: !cur } });
  const post = () => { if (!draft.trim()) return; update({ tcomments: { ...(store.tcomments || {}), [tid]: [...mine, { n: store.name || 'you', t: draft.trim() }] } }); setDraft(''); };
  const share = () => { try { Share.share({ message: `${t.title} - a project tutorial on CodeQuest` }); } catch (e) {} };
  const others = TUTORIALS.filter((x) => x.au === t.au && x.id !== tid).slice(0, 2);
  const rec = (t.courses || []).map((id) => COURSES.find((c) => c.id === id)).filter(Boolean).slice(0, 2);
  const cw = W - 32;
  const actions = (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 14 }}>
      <Action icon={liked ? '♥' : '♡'} count={t.likes + (liked ? 1 : 0)} on={liked} onPress={() => flip('tlikes', liked)} />
      <Action icon="💬" count={t.comments + mine.length} on={showC} onPress={() => setShowC(!showC)} />
      <Action icon="🔖" count={t.saves + (saved ? 1 : 0)} on={saved} onPress={() => flip('tsaves', saved)} />
      <Action icon="↗" onPress={share} />
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 50 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
          <Pressable onPress={back}><T s={17} c="#b8c2d9">Project Tutorials  /  </T></Pressable>
          <Pill>{t.lang}</Pill><Pill>{t.level}</Pill>
        </View>
        <View style={{ marginTop: 18 }}><Cover kind={t.cover} w={cw} h={Math.round(cw * 0.52)} /></View>
        <T px s={20} style={{ marginTop: 22, lineHeight: 32 }}>{t.title}</T>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
          <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: au.c, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}><T b s={16}>{au.name[0]}</T></View>
          <T b s={15}>{au.name}</T><T s={14} c={C.mute}>  ·  {t.mins} min read  ·  {t.date}</T>
        </View>
        {actions}
        <View style={{ backgroundColor: '#042a4d', borderWidth: 2, borderColor: '#0e6fc4', padding: 16, marginBottom: 6 }}>
          <View style={{ flexDirection: 'row', marginBottom: 12 }}><Text style={{ width: 118, fontFamily: F.r, fontSize: 12, letterSpacing: 2.5, color: '#9fb4d6' }}>PREREQUISITES</Text><T s={15} style={{ flex: 1 }}>{t.pre}</T></View>
          <View style={{ flexDirection: 'row' }}><Text style={{ width: 118, fontFamily: F.r, fontSize: 12, letterSpacing: 2.5, color: '#9fb4d6' }}>VERSIONS</Text><T s={15} style={{ flex: 1 }}>{t.ver}</T></View>
        </View>

        {t.blocks.map((b, k) => {
          if (b.t === 'h') return <View key={k} style={{ flexDirection: 'row', marginTop: 24, marginBottom: 10 }}><T px s={14} c="#19a7ff" style={{ marginRight: 10 }}>#</T><T px s={14} style={{ flex: 1, lineHeight: 24 }}>{b.x}</T></View>;
          if (b.t === 'p') return <Rich key={k} text={b.x} style={{ marginBottom: 12 }} />;
          if (b.t === 'code') return <CodeBox key={k} code={b.x} />;
          if (b.t === 'tip') return <View key={k} style={{ backgroundColor: '#07304f', borderColor: C.blue, borderWidth: 1, padding: 14, marginVertical: 10 }}><Rich text={'💡  ' + b.x} /></View>;
          if (b.t === 'img' && b.x === 'demo') return t.demo ? <View key={k} style={{ height: 210, backgroundColor: '#fff', marginVertical: 12, borderWidth: 3, borderColor: '#3a4a78' }}><RunFrame html={t.demo} onData={() => {}} /></View> : null;
          if (b.t === 'img') return <Diagram key={k} kind={b.x} />;
          return null;
        })}

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 26, marginBottom: 10 }}><T px s={13} c="#19a7ff" style={{ marginRight: 10 }}>##</T><T px s={14}>More Resources</T></View>
        {t.res.map(([label, url]) => <Pressable key={url} onPress={() => Linking.openURL(url).catch(() => {})} style={{ paddingVertical: 6, flexDirection: 'row' }}><T s={16} c="#e8ecf5">•  </T><T s={16} c="#19a7ff" style={{ flex: 1 }}>{label}</T></Pressable>)}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 14 }}>{t.tags.map((g) => <Pill key={g}>{g}</Pill>)}</View>
        {actions}

        {showC ? <View style={{ backgroundColor: '#0a1128', borderWidth: 1, borderColor: '#26324f', padding: 14, marginBottom: 14 }}>
          <T b s={16} style={{ marginBottom: 10 }}>Comments</T>
          {mine.length ? mine.map((c, i) => <View key={i} style={{ marginBottom: 10 }}><T b s={13} c="#19a7ff">@{c.n}</T><T s={14}>{c.t}</T></View>) : <T s={13} c={C.mute} style={{ marginBottom: 10 }}>Be the first to comment on this tutorial.</T>}
          <TextInput value={draft} onChangeText={setDraft} placeholder="Write a comment…" placeholderTextColor={C.mute} style={{ borderWidth: 1, borderColor: '#3a4560', color: C.text, padding: 10, fontFamily: F.r, marginBottom: 10 }} />
          <Btn small label="Post" onPress={post} disabled={!draft.trim()} />
        </View> : null}

        <View style={[{ backgroundColor: BG, padding: 18, marginTop: 14 }, edge]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 66, height: 66, borderRadius: 33, backgroundColor: au.c, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}><T b s={28}>{au.name[0]}</T></View>
            <View style={{ flex: 1 }}><T b s={19}>{au.name}</T><T s={15} c={C.mute}>@{au.handle}</T></View>
          </View>
          <T s={15} style={{ marginTop: 14 }}>{au.bio}</T>
          <T s={14} c="#c7d0e6" style={{ marginTop: 14 }}>💼  {au.work}</T><T s={14} c="#c7d0e6" style={{ marginTop: 8 }}>📍  {au.place}</T>
          <View style={{ marginTop: 16 }}><Btn label={following ? '✓ Following' : '＋ Follow'} color={following ? '#1a2540' : '#0ea5ff'} dark={following ? '#3a4560' : '#0a6fb3'} onPress={() => update({ follows: { ...(store.follows || {}), [t.au]: !following } })} /></View>
          <Pressable onPress={() => go('tutorials', { author: t.au })} style={[{ marginTop: 12, paddingVertical: 12, alignItems: 'center', backgroundColor: '#05070f' }, edge, { borderBottomWidth: 4 }]}><T b s={15}>View profile</T></Pressable>
        </View>

        {others.length ? <><T b s={20} style={{ marginTop: 28, marginBottom: 14 }}>More by {au.name}</T>{others.map((o, i) => <TCard key={o.id} t={o} w={cw} i={i} />)}</> : null}
        {rec.length ? <><T b s={20} style={{ marginTop: 18, marginBottom: 14 }}>Recommended courses</T>
          {rec.map((c, i) => (
            <FadeIn key={c.id} delay={i * 80}><Pressable onPress={() => go('course', { cid: c.id })} style={{ marginBottom: 16 }}>
              <View style={[{ backgroundColor: BG, overflow: 'hidden' }, edge]}>
                <Banner c={c} i={i} h={130} />
                <View style={{ padding: 14 }}><Text style={{ fontFamily: F.r, fontSize: 11, letterSpacing: 2.5, color: C.mute }}>COURSE</Text><T b s={19} style={{ marginTop: 6 }}>{c.name}</T><T s={14} c="#c7d0e6" numberOfLines={2} style={{ marginTop: 6 }}>{c.d}</T><View style={{ flexDirection: 'row' }}><Pill bars={LV[c.lvl] || 1}>{c.lvl}</Pill></View></View>
              </View></Pressable></FadeIn>))}</> : null}
      </ScrollView>
    </View>
  );
};
