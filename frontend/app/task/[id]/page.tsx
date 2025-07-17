'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ChatInput from '../../components/ChatInput';
import ChatMessage from '../../components/ChatMessage';

interface Message {
  id: string;
  author: string;
  text: string;
  created: number;
}

export default function TaskThread() {
  const params = useParams();
  const [messages, setMessages] = useState<Message[]>([]);

  const taskId = params?.id as string;

  async function load() {
    const res = await fetch(`/api/tasks/${taskId}/chat`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  }

  useEffect(() => {
    load();
  }, [taskId]);

  async function send(text: string) {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, text }),
    });

    if (res.ok) {
      const userMsg = await res.json();
      setMessages((m) => [...m, userMsg]);
      const gptRes = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      if (gptRes.ok) {
        const bot = await gptRes.json();
        setMessages((m) => [
          ...m,
          {
            id: Math.random().toString(),
            author: 'assistant',
            text: bot.text,
            created: Date.now(),
          },
        ]);
      }
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Task {taskId}</h1>
      <div style={{ minHeight: '300px', marginBottom: '1rem' }}>
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
      </div>
      <ChatInput onSend={send} />
    </main>
  );
}
