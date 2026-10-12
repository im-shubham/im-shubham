import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FREE_HABIT_LIMIT, useStore } from './src/store/useStore';
import { THEMES, colors } from './src/theme';
import { startCloudSync } from './src/lib/firebase';
import { Onboarding } from './src/screens/Onboarding';
import { Home } from './src/screens/Home';
import { Dashboard } from './src/screens/Dashboard';
import { Paywall } from './src/screens/Paywall';

export default function App() {
  const { habits, activeId, isPro, theme, hydrated, addHabit, logToday, setPro, setTheme } = useStore();
  const [tab, setTab] = useState<'home' | 'stats'>('home');
  const [paywall, setPaywall] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let stop = () => {};
    startCloudSync().then((s) => (stop = s)).catch(() => {}); // offline/unconfigured: stay local
    return () => stop();
  }, []);

  // A theme that was Pro-only falls back if Pro is somehow not active.
  const t = THEMES[THEMES[theme].pro && !isPro ? 'volt' : theme];
  const habit = habits.find((h) => h.id === activeId) ?? habits[0];

  const onAdd = () => (!isPro && habits.length >= FREE_HABIT_LIMIT ? setPaywall(true) : setAdding(true));

  if (!hydrated) return <View style={styles.root} />;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root}>
        <StatusBar style="light" />
        {!habit || adding ? (
          <Onboarding
            accent={t.accent}
            onSubmit={(name) => {
              addHabit(name);
              setAdding(false);
              setTab('home');
            }}
          />
        ) : (
          <>
            <View style={{ flex: 1 }}>
              {tab === 'home' ? (
                <Home habit={habit} accent={t.accent} accent2={t.accent2} onLog={() => logToday(habit.id)} onAdd={onAdd} />
              ) : (
                <Dashboard
                  habit={habit}
                  accent={t.accent}
                  isPro={isPro}
                  theme={theme}
                  onTheme={setTheme}
                  onUpsell={() => setPaywall(true)}
                />
              )}
            </View>
            <View style={styles.tabs}>
              {(['home', 'stats'] as const).map((k) => (
                <Pressable key={k} onPress={() => setTab(k)} style={styles.tab}>
                  <Text style={[styles.tabT, tab === k && { color: t.accent }]}>{k === 'home' ? 'STREAK' : 'INSIGHTS'}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
        <Modal visible={paywall} animationType="slide" onRequestClose={() => setPaywall(false)}>
          <SafeAreaView style={styles.root}>
            <Paywall
              accent={t.accent}
              onClose={() => setPaywall(false)}
              onUnlocked={() => {
                setPro(true);
                setPaywall(false);
              }}
            />
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  tabs: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  tabT: { color: colors.muted, fontSize: 12, fontWeight: '900', letterSpacing: 3 },
});
