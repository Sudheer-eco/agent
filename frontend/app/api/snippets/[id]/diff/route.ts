import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';
import { diffLines } from 'diff';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const snippetId = params.id;
  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('snippet_id', snippetId)
    .order('version', { descending: true })
    .limit(2);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length < 2) {
    return NextResponse.json({ diff: '' });
  }

  const [latest, previous] = data;
  const diff = diffLines(previous.code || '', latest.code || '');

  return NextResponse.json({ diff });
}
