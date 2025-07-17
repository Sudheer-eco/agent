'use client';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside style={{ width: '200px', borderRight: '1px solid #ccc', padding: '1rem' }}>
      {children}
    </aside>
  );
}
