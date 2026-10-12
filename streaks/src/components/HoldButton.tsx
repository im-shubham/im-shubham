import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme';

const SIZE = 280;
const HOLD_MS = 1800;
const REWIND_MS = 600;

interface Props {
  label: string;
  accent: string;
  accent2: string;
  onComplete: () => void;
}

/**
 * Hold-to-log. A neon fill rises through the disc while held (like sand filling a glass);
 * releasing early drains it back down. Reaching 100% fires a success haptic once.
 */
export function HoldButton({ label, accent, accent2, onComplete }: Props) {
  const p = useSharedValue(0);
  const done = useSharedValue(false);
  const pulse = useSharedValue(1);

  const tick = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  const success = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onComplete();
  };

  useAnimatedReaction(
    () => Math.floor(p.value * 4),
    (cur, prev) => {
      if (prev !== null && cur > prev && cur < 4) runOnJS(tick)();
    },
  );
  useAnimatedReaction(
    () => p.value >= 1,
    (full) => {
      if (full && !done.value) {
        done.value = true;
        pulse.value = withSequence(withTiming(1.08, { duration: 120 }), withTiming(1, { duration: 240 }));
        runOnJS(success)();
      }
    },
  );

  useEffect(() => () => void (done.value = false), [done]);

  const fillStyle = useAnimatedStyle(() => ({
    height: interpolate(p.value, [0, 1], [0, SIZE], Extrapolation.CLAMP),
  }));
  const discStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value * interpolate(p.value, [0, 1], [1, 0.96]) }],
    shadowOpacity: interpolate(p.value, [0, 1], [0.15, 0.9]),
  }));
  const textStyle = useAnimatedStyle(() => ({ opacity: interpolate(p.value, [0, 0.6], [1, 0.35]) }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Hold to log ${label}`}
      onPressIn={() => {
        done.value = false;
        p.value = withTiming(1, { duration: HOLD_MS * (1 - p.value), easing: Easing.inOut(Easing.quad) });
      }}
      onPressOut={() => {
        if (!done.value) p.value = withTiming(0, { duration: REWIND_MS * p.value, easing: Easing.out(Easing.cubic) });
      }}
    >
      <Animated.View style={[styles.disc, { shadowColor: accent, borderColor: accent }, discStyle]}>
        <Animated.View style={[styles.fill, { backgroundColor: accent }, fillStyle]}>
          <View style={[styles.sheen, { backgroundColor: accent2 }]} />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, styles.center, textStyle]}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.hint}>HOLD TO LOG</Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  disc: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    backgroundColor: colors.card,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
    elevation: 18,
  },
  fill: { width: '100%', opacity: 0.9 },
  sheen: { position: 'absolute', top: 0, left: 0, right: 0, height: 10, opacity: 0.6 },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  label: { color: colors.text, fontSize: 30, fontWeight: '900', textAlign: 'center' },
  hint: { color: colors.muted, fontSize: 11, letterSpacing: 3, marginTop: 10, fontWeight: '700' },
});
