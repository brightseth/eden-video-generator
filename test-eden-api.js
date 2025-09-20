// Test Eden API video generation
// Run with: EDEN_API_KEY=your_key_here node test-eden-api.js

const EDEN_API_KEY = process.env.EDEN_API_KEY || 'db10962875d98d2a2dafa8599a89c850766f39647095c002';
const EDEN_BASE_URL = 'https://api.eden.art/v2';

async function testVideoGeneration() {
  console.log('🎬 Testing Eden Video Generation API...\n');

  // Step 1: Create a video task
  console.log('1️⃣ Creating video task...');

  const payload = {
    tool: "create",
    args: {
      prompt: "A serene digital landscape with floating geometric shapes, ethereal lighting, cinematic",
      output: "video",
      model_preference: "veo"
    },
    makePublic: true
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const createResponse = await fetch(`${EDEN_BASE_URL}/tasks/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': EDEN_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const responseText = await createResponse.text();
    console.log('Response status:', createResponse.status);
    console.log('Response:', responseText);

    if (!createResponse.ok) {
      console.error('❌ Failed to create task:', responseText);
      return;
    }

    const data = JSON.parse(responseText);
    const taskId = data.task?._id || data.taskId || data.task_id || data.id || data._id;

    if (!taskId) {
      console.error('❌ No taskId found in response:', data);
      return;
    }

    console.log('✅ Task created successfully! ID:', taskId);

    // Step 2: Poll for completion
    console.log('\n2️⃣ Polling for video generation...');

    let attempts = 0;
    const maxAttempts = 60;
    const pollInterval = 5000; // 5 seconds

    while (attempts < maxAttempts) {
      attempts++;

      await new Promise(resolve => setTimeout(resolve, pollInterval));

      const statusResponse = await fetch(`${EDEN_BASE_URL}/tasks/${taskId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': EDEN_API_KEY
        }
      });

      if (!statusResponse.ok) {
        console.error('❌ Failed to check status:', await statusResponse.text());
        return;
      }

      const statusData = await statusResponse.json();
      const task = statusData.task || statusData;

      console.log(`Attempt ${attempts}/${maxAttempts} - Status: ${task.status}`);

      if (task.status === 'completed') {
        const videoUrl = task.result?.[0]?.output?.[0]?.url ||
                        task.result?.[0]?.output?.[0]?.uri ||
                        task.output?.url ||
                        task.output?.uri;

        if (videoUrl) {
          console.log('\n🎉 VIDEO GENERATION COMPLETE!');
          console.log('Video URL:', videoUrl);
          console.log('\nYou can view your video at:', videoUrl);
          return;
        } else {
          console.log('Task completed but no video URL found:', JSON.stringify(task, null, 2));
        }
        break;
      }

      if (task.status === 'failed') {
        console.error('❌ Task failed:', task.error || 'Unknown error');
        console.log('Full task data:', JSON.stringify(task, null, 2));
        return;
      }
    }

    console.log('⏱️ Timeout - generation took too long');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
testVideoGeneration();