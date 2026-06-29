import { NextRequest, NextResponse } from 'next/server';

const GAS_URL = process.env.GAS_EKSKUL_URL!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const gasRes = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: 'follow',
    });

    if (!gasRes.ok) {
      return NextResponse.json(
        { success: false, message: `GAS error: ${gasRes.status}` },
        { status: 502 }
      );
    }

    const data = await gasRes.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: `Proxy error: ${message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'SIM Ekskul SMPN 5 Klaten' });
}
