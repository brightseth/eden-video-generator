import { NextRequest, NextResponse } from 'next/server';

const EDEN_API_KEY = process.env.EDEN_API_KEY;
const EDEN_BASE_URL = 'https://api.eden.art'; // Main Eden API

export async function POST(request: NextRequest) {
  if (!EDEN_API_KEY) {
    console.error('Eden API key not configured');
    return NextResponse.json(
      { error: 'Eden API key not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    console.log('Creating Eden task with body:', JSON.stringify(body, null, 2));
    console.log('Using Eden API URL:', `${EDEN_BASE_URL}/tasks/create`);

    // Forward request to Eden API - trying different endpoints
    // First try the main API
    const response = await fetch(`${EDEN_BASE_URL}/tasks/create`, {
      method: 'POST',
      headers: {
        'X-Api-Key': EDEN_API_KEY,  // Changed from Bearer to X-Api-Key
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const responseText = await response.text();
    console.log('Eden API response status:', response.status);
    console.log('Eden API response:', responseText);

    if (!response.ok) {
      console.error('Eden API error:', responseText);
      return NextResponse.json(
        { error: `Eden API error (${response.status}): ${responseText}` },
        { status: response.status }
      );
    }

    let task;
    try {
      task = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Eden response:', e);
      return NextResponse.json(
        { error: 'Invalid response from Eden API' },
        { status: 500 }
      );
    }

    console.log('Task created successfully:', task.id);
    return NextResponse.json({ taskId: task.id });

  } catch (error) {
    console.error('Error creating Eden task:', error);
    return NextResponse.json(
      { error: `Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}