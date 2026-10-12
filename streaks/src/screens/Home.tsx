import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { HoldButton } from '../components/HoldButton';
import { DotTracker } from '../components/DotTracker';
import { colors } from '../theme';
import { currentStreak, dayKey } from '../lib/streak';
import type { Habit } from '../store/useStore';

interface Props {
  habit: Habit;
  accent: string;
  accent2: string;
  onLog: () => void;
  onAdd: () => void;
}

export function Home({ habit, accent, accent2, onLog, onAdd }: Props) {
  const doneToday = habit.logs.includes(dayKey());
  const streak = currentStreak(habit.logs);
  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <Text style={styles.name} numberOfLines={1}>{habit.name}</Text>
        <Pressable accessibilityLabel="Add habit" onPress={onAdd} hitSlop={12} style={styles.plus}>
          <Text style={[styles.plusT, { color: accent }]}>+</Text>
        </Pressable>
      </View>
      <View style={styles.center}>
        {doneToday ? (
          <Animated.View entering={FadeIn.duration(500)} style={styles.success}>
            <Text style={styles.streak}>🔥 {streak}</Text>
            <Text style={[styles.days, { color: accent }]}>{streak === 1 ? 'DAY' : 'DAYS'}</Text>
            <Animated.View entering={FadeInDown.delay(300)} style={{ marginTop: 48 }}>
              <DotTracker logs={habit.logs} accent={accent} />
            </Animated.View>
          </Animated.View>
        ) : (
          <HoldButton label={habit.name} accent={accent} accent2={accent2} onComplete={onLog} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 8 },
  name: { color: colors.muted, fontSize: 14, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', flex: 1 },
  plus: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  plusT: { fontSize: 24, fontWeight: '700', marginTop: -2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  success: { alignItems: 'center' },
  streak: { color: colors.text, fontSize: 88, fontWeight: '900' },
  days: { fontSize: 20, fontWeight: '900', letterSpacing: 8, marginTop: -4 },
});
