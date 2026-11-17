import { redirect } from 'next/navigation';

// "Dropdown" in the sidebar is a group. Opening it lands on its first page.
export default function DropdownIndexPage() {
  redirect('/components/dropdown/icon');
}
