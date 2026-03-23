'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const now = new Date();
    router.replace(`/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`);
  }, [router]);
  return null;
}
