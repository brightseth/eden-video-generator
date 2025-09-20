import { NextRequest, NextResponse } from 'next/server';

const EDEN_API_KEY = process.env.EDEN_API_KEY;
const EDEN_BASE_URL = 'https://api.eden.art/v2'; // v2 API from jmill

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

    // Use hello-eden's correct payload structure
    const edenPayload = {
      tool: "create",
      args: {
        prompt: body.prompt || body.args?.text_input,
        output: "video", // Always video for this endpoint
        model_preference: body.model_preference || "veo"
      },
      makePublic: true // As per hello-eden example
    };

    console.log('Eden v2 payload:', JSON.stringify(edenPayload, null, 2));

    const response = await fetch(`${EDEN_BASE_URL}/tasks/create`, {
      method: 'POST',
      headers: {
        'X-Api-Key': EDEN_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(edenPayload)
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

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Eden response:', e);
      return NextResponse.json(
        { error: 'Invalid response from Eden API' },
        { status: 500 }
      );
    }

    // Extract taskId following hello-eden pattern
    const taskId = data.task?._id || data.taskId || data.task_id || data.id || data._id;

    if (!taskId) {
      console.error('No taskId found in response:', data);
      return NextResponse.json(
        { error: 'No taskId returned from Eden API' },
        { status: 500 }
      );
    }

    console.log('Task created successfully:', taskId);
    return NextResponse.json({ taskId });

  } catch (error) {
    console.error('Error creating Eden task:', error);
    return NextResponse.json(
      { error: `Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}