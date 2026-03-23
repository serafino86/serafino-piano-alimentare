import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const now = new Date();
  redirect(`/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`);
}
