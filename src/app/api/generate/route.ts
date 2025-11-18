import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateAll } from '../../../lib/generator';
import type { GenerateInput } from '../../../types';

const schema = z.object({
  topic: z.string().min(3).max(160),
  durationMinutes: z.number().int().min(2).max(20),
  style: z.enum(['educational','storytelling','cinematic','listicle','tutorial','news']),
  audience: z.enum(['beginner','intermediate','advanced']),
  tone: z.enum(['friendly','authoritative','humorous','inspiring','casual','formal']),
  language: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body) as GenerateInput;
    const result = generateAll(parsed);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    if (err?.issues) {
      return NextResponse.json({ error: 'ValidationError', details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'ServerError', message: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}
