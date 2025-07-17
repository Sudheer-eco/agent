import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { taskId } = await req.json();
  if (!taskId) {
    return NextResponse.json({ error: 'taskId required' }, { status: 400 });
  }

  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const chatMessages = messages.map((m: any) => ({
    role: m.author,
    content: m.text,
  }));

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: chatMessages,
  });

  const reply = completion.choices[0].message?.content || '';

  await supabase
    .from('messages')
    .insert({ task_id: taskId, text: reply, author: 'assistant' });

  return NextResponse.json({ text: reply, tokens: completion.usage?.total_tokens });
}
