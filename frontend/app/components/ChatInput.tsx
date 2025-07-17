'use client';
import { useState } from 'react';

export default function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!value) return;
        onSend(value);
        setValue('');
      }}
      style={{ display: 'flex', gap: '0.5rem' }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ flex: 1 }}
        placeholder="Type a message"
      />
      <button type="submit">Send</button>
    </form>
  );
}
