import { Browser } from '@capacitor/browser';

export async function openBrowser(url) {
  try {
    await Browser.open({ url });
  } catch (e) {
    window.open(url, '_blank');
  }
}
