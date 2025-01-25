import { NextResponse } from 'next/server';

if (!process.env.AURA_URL || !process.env.AURA_KEY) {
  throw new Error('Missing AURA_URL or AURA_KEY environment variables');
}

export async function GET() {
  try {
    const response = await fetch(process.env.AURA_URL, {
      headers: {
        Authorization: `Bearer ${process.env.AURA_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Aura API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching aura data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch aura data' },
      { status: 500 }
    );
  }
} 