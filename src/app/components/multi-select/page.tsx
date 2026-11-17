import { redirect } from 'next/navigation';

// The filter dropdown now lives with the other dropdowns. Old links still work.
export default function MultiSelectRedirectPage() {
  redirect('/components/dropdown/filter');
}
