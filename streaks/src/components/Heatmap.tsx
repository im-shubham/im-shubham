import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { heatmapWeeks } from '../lib/streak';

export function Heatmap({ logs, accent }: { logs: string[]; accent: string }) {
  return (
    <View style={styles.grid}>
      {heatmapWeeks(logs, 14).map((week, i) => (
        <View key={i} style={styles.week}>
          {week.map((c) => (
            <View
              key={c.key}
              style={[styles.cell, c.done && { backgroundColor: accent }, c.future && { opacity: 0 }]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: 4, justifyContent: 'center' },
  week: { gap: 4 },
  cell: { width: 18, height: 18, borderRadius: 4, backgroundColor: colors.dim },
});
