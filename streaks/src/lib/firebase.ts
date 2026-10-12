import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import { useStore } from '../store/useStore';

const cfg = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Local-first: Zustand+AsyncStorage is the source of truth on-device (instant, fully
 * offline). Firestore mirrors it in the background and the Firestore SDK queues writes
 * made while offline, flushing them on reconnect. No-ops if Firebase isn't configured.
 */
export async function startCloudSync(): Promise<() => void> {
  if (!cfg.projectId) return () => {};
  const app = getApps()[0] ?? initializeApp(cfg);
  const auth = getAuth(app);
  const { user } = await signInAnonymously(auth);
  const ref = doc(getFirestore(app), 'users', user.uid);

  let applyingRemote = false;
  const unsubRemote = onSnapshot(ref, (snap) => {
    const d = snap.data();
    if (!d || snap.metadata.hasPendingWrites) return;
    // Only adopt remote when it has more history than local (first install on a new device).
    const local = useStore.getState();
    const count = (hs: { logs: string[] }[]) => hs.reduce((n, h) => n + h.logs.length, 0);
    if (count(d.habits ?? []) > count(local.habits)) {
      applyingRemote = true;
      local.replaceFromCloud({
        habits: d.habits,
        activeId: d.activeId ?? null,
        isPro: local.isPro || !!d.isPro,
        theme: d.theme ?? local.theme,
      });
      applyingRemote = false;
    }
  });

  let t: ReturnType<typeof setTimeout> | undefined;
  const unsubLocal = useStore.subscribe((s) => {
    if (applyingRemote) return;
    clearTimeout(t);
    t = setTimeout(() => {
      setDoc(ref, { habits: s.habits, activeId: s.activeId, isPro: s.isPro, theme: s.theme }, { merge: true }).catch(
        () => {},
      );
    }, 800);
  });

  return () => {
    clearTimeout(t);
    unsubRemote();
    unsubLocal();
  };
}
