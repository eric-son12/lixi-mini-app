"use client"
import WebApp from '@twa-dev/sdk'
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  WebApp.ready();

  const navigateHome = () => {
    router.push('/home');
  }
  
  return (
    <p onClick={navigateHome}>
      Hello everyone... 
    </p>
  )
}
