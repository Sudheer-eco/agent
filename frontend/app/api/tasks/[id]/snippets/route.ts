import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const taskId = params.id;
  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('task_id', taskId)
    .order('version', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
