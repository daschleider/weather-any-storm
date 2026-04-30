import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('GOOGLE_SHEETS_WEBHOOK_URL not set.');
      return NextResponse.json({ success: true, saved: false });
    }

    // Build flat row data: timestamp, status, count, then pairs of name+email per attendee
    const attendees = body.attendees || [];

    // Max 10 attendees supported in sheet columns
    const attendeeCols: Record<string, string> = {};
    for (let i = 0; i < 10; i++) {
      attendeeCols[`attendee${i + 1}Name`] = attendees[i]?.name || '';
      attendeeCols[`attendee${i + 1}Email`] = attendees[i]?.email || '';
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: body.status,
        attendeeCount: body.attendeeCount,
        attendeeNames: body.attendeeNames, // readable summary
        ...attendeeCols,
        declineFirstName: body.declineFirstName,
        declineLastName: body.declineLastName,
        declineEmail: body.declineEmail,
      }),
    });

    if (!response.ok) throw new Error(`Webhook responded with ${response.status}`);

    return NextResponse.json({ success: true, saved: true });
  } catch (err) {
    console.error('RSVP save error:', err);
    return NextResponse.json({ success: true, saved: false, error: String(err) });
  }
}
