import { notify } from '@/lib/toast';
import { sounds } from '@/lib/sounds';

/**
 * Shared copy action: clipboard + click sound + toast.
 * Used by the code view and the colour swatches so every copy behaves the same.
 */
export async function copyToClipboard(value: string, message = 'Copied to clipboard') {
  try {
    await navigator.clipboard.writeText(value);
    sounds.playClick();
    notify.success(message);
    return true;
  } catch {
    notify.error('Could not copy. Your browser blocked clipboard access.');
    return false;
  }
}
