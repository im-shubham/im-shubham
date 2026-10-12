import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme';

export function ProgressRing({ value, accent, size = 180 }: { value: number; accent: string; size?: number }) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.dim} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={accent}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c * value} ${c}`}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={styles.pct}>{Math.round(value * 100)}%</Text>
      <Text style={styles.cap}>TOTAL CONSISTENCY</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pct: { color: colors.text, fontSize: 40, fontWeight: '900' },
  cap: { color: colors.muted, fontSize: 9, letterSpacing: 2, fontWeight: '700', marginTop: 2 },
});
