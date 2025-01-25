import { NextResponse } from 'next/server';

interface HeartRateData {
  bpm: number;
  timestamp: string;
  source: string;
}

interface OuraResponse {
  data: HeartRateData[];
}

const AURA_KEY = process.env.AURA_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_AURA_URL;
const START_DATE = process.env.NEXT_PUBLIC_START_DATE;
const END_DATE = process.env.NEXT_PUBLIC_END_DATE;

if (!BASE_URL || !AURA_KEY) {
  throw new Error('Missing required environment variables');
}

export async function GET() {
  try {
    // Construct the full URL with query parameters
    const url = new URL(BASE_URL as string);
    url.searchParams.append('start_datetime', START_DATE || '2025-01-25T00:00:00-08:00');
    url.searchParams.append('end_datetime', END_DATE || '2025-01-26T00:00:00-08:00');

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AURA_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Aura API responded with status: ${response.status}`);
    }

    const data = await response.json() as OuraResponse;
    
    // Transform the Oura Ring data into friend orbs
    const transformedData = data.data?.map((item: HeartRateData, index: number) => ({
      id: index.toString(),
      name: `Heart Rate ${item.bpm}`,
      distance: Math.min(90, (item.bpm / 200) * 100), // Convert heart rate to distance (max 90%)
      auraColors: {
        from: `rgb(${Math.min(255, item.bpm)}, 100, 255)`,
        to: `rgb(100, ${Math.min(255, item.bpm)}, 255)`,
      }
    })) || [];

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching aura data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch aura data' },
      { status: 500 }
    );
  }
} 