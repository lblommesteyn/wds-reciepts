import { NextResponse } from 'next/server';

import { helloWorldQuery } from '@/lib/supabase';

export async function GET() {
  try {
    const data = await helloWorldQuery();
    return NextResponse.json({
      ok: true,
      message: 'Supabase connection succeeded',
      data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown Supabase error';
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
