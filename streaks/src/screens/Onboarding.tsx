import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { colors } from '../theme';

export function Onboarding({ accent, onSubmit }: { accent: string; onSubmit: (name: string) => void }) {
  const [name, setName] = useState('');
  const ok = name.trim().length > 0;
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.wrap}>
      <Text style={styles.q}>What are we{'\n'}tracking?</Text>
      <TextInput
        autoFocus
        value={name}
        onChangeText={setName}
        placeholder="Daily Code"
        placeholderTextColor={colors.dim}
        maxLength={28}
        style={[styles.input, { borderColor: ok ? accent : colors.dim }]}
        onSubmitEditing={() => ok && onSubmit(name)}
        returnKeyType="go"
      />
      <Pressable
        disabled={!ok}
        onPress={() => onSubmit(name)}
        style={[styles.btn, { backgroundColor: ok ? accent : colors.dim }]}
      >
        <Text style={styles.btnText}>Start</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: 28, gap: 28 },
  q: { color: colors.text, fontSize: 44, fontWeight: '900', lineHeight: 50 },
  input: { color: colors.text, fontSize: 26, fontWeight: '700', borderBottomWidth: 2, paddingVertical: 10 },
  btn: { borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
});
