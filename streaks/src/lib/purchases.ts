export type PlanId = 'monthly' | 'yearly' | 'lifetime';

export const PLANS: { id: PlanId; label: string; price: string; sub: string; anchor: boolean }[] = [
  { id: 'monthly', label: 'Monthly', price: '₹49', sub: 'per month', anchor: true },
  { id: 'yearly', label: 'Yearly', price: '₹199', sub: 'per year', anchor: true },
  { id: 'lifetime', label: 'Lifetime Pro', price: '₹399', sub: 'one-time · pay once via UPI', anchor: false },
];

/**
 * Payment seam. Wire a real provider here (Google Play Billing supports UPI in India;
 * Razorpay/Cashfree for web or sideloaded builds), and VERIFY the receipt server-side
 * (e.g. a Cloud Function that sets `isPro` on the user's Firestore doc) before returning true.
 * Until then this resolves false so Pro can never be unlocked by accident in production.
 */
export async function purchase(_plan: PlanId): Promise<boolean> {
  if (__DEV__) return true; // dev-only stub so the unlocked flow can be exercised
  throw new Error('Payments not configured');
}
