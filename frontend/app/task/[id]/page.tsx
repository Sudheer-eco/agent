'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ChatInput from '../../components/ChatInput';
import ChatMessage from '../../components/ChatMessage';

interface Message {
  id: string;
  author: string;
  text: string;
  created: number;
}

export default function TaskThread() {
  const router = useRouter();
  const params = useParams();
  const [messages, setMessages] = useState<Message[]>([]);

  const taskId = params?.id as string;

  async function load() {
    const res = await fetch(`/api/tasks/${taskId}`, { credentials: 'include' });
    if (res.status === 401) {
      router.push('/login');
      return;
    }
    if (!res.ok) {
      router.push('/');
      return;
    }
    const data = await res.json();
    setMessages(data.messages);
  }

  useEffect(() => {
    load();
  }, [taskId]);

  async function send(text: string) {
    const res = await fetch(`/api/tasks/${taskId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages((m) => [...m, msg]);
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
