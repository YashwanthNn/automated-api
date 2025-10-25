// app/api/check/route.ts
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { monitorId, endpoint } = await request.json();

  const startTime = Date.now();
  let status = 0;
  let latency = 0;

  try {
    const response = await fetch(endpoint, { method: 'GET', signal: AbortSignal.timeout(5000) }); // 5s timeout
    latency = Date.now() - startTime;
    status = response.status;
  } catch (error) {
    // Network error, timeout, or DNS failure
    latency = Date.now() - startTime;
    status = 504; // Gateway Timeout/Server Error placeholder
  }

  // 1. Update Monitor's last status
  await supabase
    .from('monitors')
    .update({
      status: status,
      latency_ms: latency,
      last_checked_at: new Date().toISOString(),
    })
    .eq('id', monitorId);

  // 2. Insert into history
  await supabase.from('history').insert({
    monitor_id: monitorId,
    status: status,
    latency_ms: latency,
  });

  return NextResponse.json({ success: true, status, latency });
}