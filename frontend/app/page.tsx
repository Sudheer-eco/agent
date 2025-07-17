'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  async function load() {
    const res = await fetch('/api/tasks', { credentials: 'include' });
    if (res.status === 401) {
      router.push('/login');
      return;
    }
    const data = await res.json();
    setTasks(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function newTask() {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) {
      const t = await res.json();
      router.push(`/task/${t.id}`);
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Tasks</h1>
      <button onClick={newTask}>Start new task</button>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <a href={`/task/${t.id}`}>{t.id}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
