import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ProgressRing } from '../components/ProgressRing';
import { Heatmap } from '../components/Heatmap';
import { NativeAdCard } from '../components/NativeAdCard';
import { THEMES, ThemeName, colors } from '../theme';
import { bestStreak, currentStreak, successRate } from '../lib/streak';
import type { Habit } from '../store/useStore';

interface Props {
  habit: Habit;
  accent: string;
  isPro: boolean;
  theme: ThemeName;
  onTheme: (t: ThemeName) => void;
  onUpsell: () => void;
}

export function Dashboard({ habit, accent, isPro, theme, onTheme, onUpsell }: Props) {
  const rate = successRate(habit.logs);
  const stats = [
    { k: 'Current', v: `${currentStreak(habit.logs)}d` },
    { k: 'Best', v: `${bestStreak(habit.logs)}d` },
    { k: 'Total days', v: `${new Set(habit.logs).size}` },
    { k: 'Success rate', v: `${Math.round(rate * 100)}%` },
  ];
  return (
    <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
      <View style={{ alignItems: 'center' }}>
        <ProgressRing value={rate} accent={accent} />
      </View>
      <View style={styles.cards}>
        {stats.map((s) => (
          <View key={s.k} style={styles.card}>
            <Text style={styles.v}>{s.v}</Text>
            <Text style={styles.k}>{s.k}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.h}>LAST 14 WEEKS</Text>
      <Heatmap logs={habit.logs} accent={accent} />
      <Text style={styles.h}>THEME</Text>
      <View style={styles.themes}>
        {(Object.keys(THEMES) as ThemeName[]).map((t) => {
          const locked = THEMES[t].pro && !isPro;
          return (
            <Pressable
              key={t}
              accessibilityLabel={`${t} theme${locked ? ', Pro' : ''}`}
              onPress={() => (locked ? onUpsell() : onTheme(t))}
              style={[styles.swatch, { backgroundColor: THEMES[t].accent, opacity: locked ? 0.45 : 1 }, theme === t && styles.sel]}
            >
              {locked && <Text style={styles.lock}>PRO</Text>}
            </Pressable>
          );
        })}
      </View>
      {!isPro && <NativeAdCard accent={accent} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, gap: 22, paddingBottom: 48 },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { flexBasis: '47%', flexGrow: 1, backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 18 },
  v: { color: colors.text, fontSize: 28, fontWeight: '900' },
  k: { color: colors.muted, fontSize: 12, fontWeight: '700', marginTop: 4 },
  h: { color: colors.muted, fontSize: 11, letterSpacing: 3, fontWeight: '700' },
  themes: { flexDirection: 'row', gap: 14 },
  swatch: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'transparent' },
  sel: { borderColor: '#fff' },
  lock: { color: '#000', fontSize: 10, fontWeight: '900' },
});
