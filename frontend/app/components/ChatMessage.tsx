'use client';

interface Message {
  id: string;
  author: string;
  text: string;
  created: number;
}

export default function ChatMessage({ message }: { message: Message }) {
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <strong>{message.author}</strong>: {message.text}
    </div>
  );
}
