import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { PLANS, PlanId, purchase } from '../lib/purchases';
import { colors } from '../theme';

const PERKS = ['Unlimited active streaks', 'No ads, ever', 'Alternate neon themes', 'Premium app icons', 'Home screen widgets'];

export function Paywall({ accent, onClose, onUnlocked }: { accent: string; onClose: () => void; onUnlocked: () => void }) {
  const [busy, setBusy] = useState<PlanId | null>(null);

  const buy = async (id: PlanId) => {
    setBusy(id);
    try {
      if (await purchase(id)) onUnlocked();
    } catch {
      Alert.alert('Payment unavailable', 'Please try again in a moment.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <View style={styles.wrap}>
      <Pressable onPress={onClose} hitSlop={16} style={styles.close} accessibilityLabel="Close">
        <Text style={styles.x}>✕</Text>
      </Pressable>
      <Text style={styles.title}>Track more.{'\n'}Pay once.</Text>
      <View style={{ gap: 8 }}>
        {PERKS.map((p) => (
          <Text key={p} style={styles.perk}>
            <Text style={{ color: accent }}>●  </Text>
            {p}
          </Text>
        ))}
      </View>
      <View style={{ gap: 12 }}>
        {PLANS.map((p) => (
          <Pressable
            key={p.id}
            disabled={busy !== null}
            onPress={() => buy(p.id)}
            style={[styles.plan, !p.anchor && { backgroundColor: accent, borderColor: accent }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.pl, !p.anchor && { color: '#000' }]}>{p.label}</Text>
              <Text style={[styles.ps, !p.anchor && { color: '#000' }]}>{p.sub}</Text>
            </View>
            {busy === p.id ? (
              <ActivityIndicator color={p.anchor ? accent : '#000'} />
            ) : (
              <Text style={[styles.pp, !p.anchor && { color: '#000' }]}>{p.price}</Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, padding: 28, justifyContent: 'center', gap: 32 },
  close: { position: 'absolute', top: 24, right: 28 },
  x: { color: colors.muted, fontSize: 20 },
  title: { color: colors.text, fontSize: 40, fontWeight: '900', lineHeight: 46 },
  perk: { color: colors.text, fontSize: 16, fontWeight: '700' },
  plan: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  pl: { color: colors.text, fontSize: 17, fontWeight: '900' },
  ps: { color: colors.muted, fontSize: 12, marginTop: 2 },
  pp: { color: colors.text, fontSize: 24, fontWeight: '900' },
});
