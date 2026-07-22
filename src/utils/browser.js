import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

export async function openBrowser(url) {
  try {
    // In-app browsers (Custom Tabs) trap APK downloads and block the install prompt.
    // Force APK links to the external system browser so Android handles the download natively.
    if (url.endsWith('.apk') && Capacitor.isNativePlatform()) {
      window.open(url, '_system');
      return;
    }
    await Browser.open({ url });
  } catch (e) {
    window.open(url, '_blank');
  }
}
