import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { lastSevenDays } from '../lib/streak';

const L = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function DotTracker({ logs, accent }: { logs: string[]; accent: string }) {
  return (
    <View style={styles.row}>
      {lastSevenDays(logs).map((d) => {
        const [y, m, day] = d.key.split('-').map(Number);
        return (
          <View key={d.key} style={styles.col}>
            <View
              style={[
                styles.dot,
                d.done && { backgroundColor: accent, borderColor: accent },
                d.isToday && !d.done && { borderColor: accent },
              ]}
            />
            <Text style={styles.l}>{L[new Date(y, m - 1, day).getDay()]}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 14, justifyContent: 'center' },
  col: { alignItems: 'center', gap: 8 },
  dot: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: colors.dim },
  l: { color: colors.muted, fontSize: 11, fontWeight: '700' },
});
