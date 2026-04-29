import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/rsvp
 *
 * Saves RSVP data to Google Sheets via a Google Apps Script Web App webhook.
 *
 * SETUP:
 * 1. Create a Google Sheet with columns:
 *    Timestamp | Email | Status | Attendee Count | Attendee Names | Decline First Name | Decline Last Name
 *
 * 2. In your Google Sheet, go to Extensions → Apps Script and paste this script:
 *
 *    function doPost(e) {
 *      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *      var data = JSON.parse(e.postData.contents);
 *      sheet.appendRow([
 *        new Date().toISOString(),
 *        data.email,
 *        data.status,
 *        data.attendeeCount,
 *        data.attendeeNames,
 *        data.declineFirstName,
 *        data.declineLastName
 *      ]);
 *      return ContentService
 *        .createTextOutput(JSON.stringify({ result: 'success' }))
 *        .setMimeType(ContentService.MimeType.JSON);
 *    }
 *
 * 3. Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    Copy the Web App URL.
 *
 * 4. Add to your .env.local:
 *    GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('GOOGLE_SHEETS_WEBHOOK_URL not set — RSVP not saved to sheet.');
      return NextResponse.json({ success: true, saved: false });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: body.email,
        status: body.status,
        attendeeCount: body.attendeeCount,
        attendeeNames: body.attendeeNames,
        declineFirstName: body.declineFirstName,
        declineLastName: body.declineLastName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with ${response.status}`);
    }

    return NextResponse.json({ success: true, saved: true });
  } catch (err) {
    console.error('RSVP save error:', err);
    // Still return 200 — frontend already shows confirmation
    return NextResponse.json({ success: true, saved: false, error: String(err) });
  }
}
