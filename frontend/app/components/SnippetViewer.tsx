'use client';

export default function SnippetViewer({ code }: { code: string }) {
  return (
    <pre style={{ background: '#f0f0f0', padding: '1rem' }}>
      <code>{code}</code>
    </pre>
  );
}
