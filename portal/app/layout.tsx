import type { ReactNode } from 'react';
export default function Layout({ children }: { children: ReactNode }) { return <html lang="en"><body style={{fontFamily:'system-ui',margin:0,background:'#0b1220',color:'#f3f4f6'}}>{children}</body></html>; }
