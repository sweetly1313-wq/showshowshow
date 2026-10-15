import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: '쑈쑈쑈 — 취향이 모이면, 새로운 쑈', description: '작은 아이디어부터 대담한 프로젝트까지. 나의 작업을 선보이고, 마음에 드는 작업에 응원을 남기는 크리에이티브 쇼케이스.' };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="ko" suppressHydrationWarning><body>{children}</body></html>; }
