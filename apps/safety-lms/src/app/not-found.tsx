import { redirect } from 'next/navigation';

export default function NotFound() {
  // Force redirect to home instead of showing 404
  redirect('/');
}