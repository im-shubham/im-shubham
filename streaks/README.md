# Streaks

Minimalist, dark, hold-to-log habit tracker. Expo (TypeScript) · Zustand · Reanimated · expo-haptics · Firebase · AdMob.

## Run
```bash
cp .env.example .env   # optional: Firebase + AdMob ids
npm install
npx expo prebuild      # AdMob needs a dev build; Expo Go won't load it
npm run android        # or ios
npm test               # streak logic
npm run typecheck
```

## What's in the PRD and where
| PRD | Code |
|---|---|
| Onboarding "What are we tracking?" | `src/screens/Onboarding.tsx` |
| Hold-to-log, reverses on early release, haptics | `src/components/HoldButton.tsx` |
| Streak counter + 7-day dots | `src/screens/Home.tsx`, `DotTracker.tsx` |
| Dashboard: ring, stat cards, heatmap, native ad | `src/screens/Dashboard.tsx` + components |
| `+` → paywall (free = 1 habit) | `App.tsx`, `store/useStore.ts` |
| ₹49 / ₹199 anchors, ₹399 lifetime | `src/lib/purchases.ts`, `screens/Paywall.tsx` |
| Pro: no ads, unlimited habits, neon themes | `useStore.isPro`, `theme.ts` |

## Deliberate deviations / still open
- **Animation:** the fill-rising disc is pure Reanimated (60 FPS, no asset needed). The inverted-sandglass Lottie/Rive file isn't included; swap it into `HoldButton` and drive its progress from the `p` shared value.
- **Offline:** the Firestore JS SDK has no persistent cache on React Native, so on-device persistence is Zustand + AsyncStorage (always works offline); Firestore mirrors it in the background via anonymous auth (`src/lib/firebase.ts`).
- **Payments are a stub** (`purchase()` only succeeds in `__DEV__`). Wire Play Billing (supports UPI) or Razorpay and verify receipts server-side before setting `isPro`; locally-set `isPro` is trivially spoofable.
- **Pro extras not built:** custom app icons and home-screen widgets need native work (alternate icons, WidgetKit/App Widgets).
- Ads use Google's test ids until `EXPO_PUBLIC_ADMOB_NATIVE_ID` and real app ids in `app.json` are set. No interstitials anywhere.
- Not run on a device/emulator in this environment; only typecheck and the streak unit tests were run.
