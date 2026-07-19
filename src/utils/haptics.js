import { Haptics, ImpactStyle } from '@capacitor/haptics';

export async function triggerHaptic(style = ImpactStyle.Light) {
  const hapticsEnabled = localStorage.getItem('michi_haptics') !== 'false';
  if (!hapticsEnabled) return;
  try {
    await Haptics.impact({ style });
  } catch (e) {
    // Fallback to web vibrate if capacitor plugin isn't available
    if (navigator.vibrate) navigator.vibrate(10);
  }
}
