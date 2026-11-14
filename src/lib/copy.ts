import { toast } from 'sonner';
import { sounds } from '@/lib/sounds';

/**
 * Shared copy action: clipboard + click sound + sonner toast.
 * Used by the code drawer and the colour swatches so every copy behaves the same.
 */
export async function copyToClipboard(value: string, message = 'Copied to clipboard') {
  try {
    await navigator.clipboard.writeText(value);
    sounds.playClick();
    toast.success(message);
    return true;
  } catch {
    toast.error('Could not copy. Your browser blocked clipboard access.');
    return false;
  }
}
