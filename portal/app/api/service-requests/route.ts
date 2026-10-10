import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { z } from 'zod';
import { createHash } from 'crypto';

export const runtime = 'nodejs';

const schema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.email().max(320),
  service: z.string().trim().min(1).max(120),
  deviceType: z.string().trim().max(100).optional(),
  subject: z.string().trim().min(3).max(180),
  description: z.string().trim().min(10).max(10000),
  turnstileToken: z.string().min(10).max(2500),
});

const json = (body: object, status: number) => NextResponse.json(body, {
  status,
  headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': process.env.SUPPORT_ALLOWED_ORIGIN || 'null', 'Vary': 'Origin' }
});

export async function POST(request: NextRequest) {
  const allowedOrigin = process.env.SUPPORT_ALLOWED_ORIGIN;
  const origin = request.headers.get('origin');
  if (!allowedOrigin || origin !== allowedOrigin) return json({ error: 'Origin not permitted' }, 403);
  const config = ['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','TURNSTILE_SECRET_KEY','UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN'];
  if (config.some(k => !process.env[k])) return json({ error: 'Service temporarily unavailable' }, 503);
  if (Number(request.headers.get('content-length') || 0) > 16000) return json({ error: 'Request too large' }, 413);

  let raw: unknown;
  try { raw = await request.json(); } catch { return json({ error: 'Invalid request' }, 400); }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return json({ error: 'Please check the form fields' }, 400);

  // Reject requests without a Turnstile token and throttle *before* database writes.
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!
  });
  const limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3,'1 h'), prefix: 'tc:service-intake' });
  try {
    const key = createHash('sha256').update(ip).digest('hex');
    const result = await limiter.limit(key);
    if (!result.success) return json({ error: 'Too many requests. Try later.' }, 429);
  } catch { return json({ error: 'Service temporarily unavailable' }, 503); }

  let challenge: { success?: boolean; hostname?: string };
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: parsed.data.turnstileToken, remoteip: ip }),
      signal: AbortSignal.timeout(6000)
    });
    challenge = await response.json();
  } catch { return json({ error: 'Unable to verify request' }, 503); }
  if (!challenge.success || challenge.hostname !== new URL(allowedOrigin).hostname) return json({ error: 'Verification failed' }, 403);

  const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data, error } = await db.rpc('tc_create_ticket', {
    p_name: parsed.data.name, p_email: parsed.data.email.toLowerCase(),
    p_subject: parsed.data.subject, p_description: parsed.data.description,
    p_service_type: parsed.data.service,
    p_device_type: parsed.data.deviceType || null
  });
  if (error || !data) {
    console.error('Ticket creation failed', error?.code);
    return json({ error: 'Request could not be submitted' }, 503);
  }
  return json({ success: true, ticketNumber: data }, 201);
}

export function GET() { return json({ error: 'Method not allowed' }, 405); }

export function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!process.env.SUPPORT_ALLOWED_ORIGIN || origin !== process.env.SUPPORT_ALLOWED_ORIGIN) return json({ error: 'Origin not permitted' }, 403);
  return new NextResponse(null, { status: 204, headers: {
    'Access-Control-Allow-Origin': process.env.SUPPORT_ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '600', 'Vary': 'Origin'
  }});
}
