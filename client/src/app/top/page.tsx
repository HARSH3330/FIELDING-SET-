import { redirect } from 'next/navigation';

// /top simply redirects to feed with top sort pre-selected
export default function TopPage() {
  redirect('/feed?sort=top');
}
