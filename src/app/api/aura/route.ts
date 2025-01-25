import { NextResponse } from 'next/server';
import { google } from 'googleapis';

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

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const tokens = requestUrl.searchParams.get('tokens');
    if (!tokens) {
        return NextResponse.json({ error: 'No tokens provided' }, { status: 400 });
    }

    const parsedTokens = JSON.parse(tokens).tokens;
    console.log(parsedTokens);
    if (!parsedTokens.access_token) {
        return NextResponse.json({ error: 'Invalid tokens provided' }, { status: 400 });
    }

    oauth2Client.setCredentials(parsedTokens);

    // Verify auth is working before proceeding
    const calendar = google.calendar({
        version: 'v3',
        auth: oauth2Client,
    });

    // Construct the full URL with query parameters
    const url = new URL(BASE_URL as string);
    url.searchParams.append('start_datetime', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    url.searchParams.append('end_datetime', new Date().toISOString());

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AURA_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Aura API responded with status: ${response.status}`);
    }

    const data = await response.json() as OuraResponse;
    
    // Get calendar events
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), 
      timeMax: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    // Create a map to store heart rates associated with each attendee
    const attendeeHeartRates: Map<string, number[]> = new Map();

    // Process each event and match with heart rate data
    events.data.items?.forEach(event => {
      const eventStart = new Date(event.start?.dateTime || event.start?.date || '');
      const eventEnd = new Date(event.end?.dateTime || event.end?.date || '');

      // Find heart rates during this event
      const eventHeartRates = data.data?.filter(hr => {
        const hrTime = new Date(hr.timestamp);
        return hrTime >= eventStart && hrTime <= eventEnd;
      });

      // Associate heart rates with each attendee
      event.attendees?.forEach(attendee => {
        if (attendee.email) {
          const existingRates = attendeeHeartRates.get(attendee.email) || [];
          eventHeartRates?.forEach(hr => {
            existingRates.push(hr.bpm);
          });
          attendeeHeartRates.set(attendee.email, existingRates);
        }
      });
    });

    // Calculate average heart rate per attendee and transform into visualization data
    const transformedData = Array.from(attendeeHeartRates.entries()).map(([email, rates], index) => {
      const avgBpm = rates.length > 0 ? rates.reduce((a, b) => a + b, 0) / rates.length : 0;
      return {
        id: index.toString(),
        name: email,
        bpm: Math.round(avgBpm),
        auraColors: {
          from: `rgb(${Math.min(255, avgBpm)}, 100, 255)`,
          to: `rgb(100, ${Math.min(255, avgBpm)}, 255)`,
        }
      };
    });

    return NextResponse.json({ transformedData, events });
  } catch (error) {
    console.error('Error fetching aura data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch aura data' },
      { status: 500 }
    );
  }
} 