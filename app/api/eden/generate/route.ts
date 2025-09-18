import { NextRequest, NextResponse } from 'next/server';

const EDEN_API_KEY = process.env.EDEN_API_KEY;
const EDEN_BASE_URL = process.env.NEXT_PUBLIC_EDEN_BASE_URL || 'https://api.eden.art';

export async function POST(request: NextRequest) {
  if (!EDEN_API_KEY) {
    return NextResponse.json(
      { error: 'Eden API key not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    // Forward request to Eden API
    const response = await fetch(`${EDEN_BASE_URL}/v2/tasks/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${EDEN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Eden API error: ${error}` },
        { status: response.status }
      );
    }

    const task = await response.json();
    return NextResponse.json({ taskId: task.id });

  } catch (error) {
    console.error('Error creating Eden task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}