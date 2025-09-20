// Test Eden API automated video generation with Abraham Covenant 2038 vision
// Run with: node test-abraham-covenant.js

const EDEN_API_KEY = 'db10962875d98d2a2dafa8599a89c850766f39647095c002';
const EDEN_BASE_URL = 'https://api.eden.art/v2';

async function testAutomatedVideoGeneration() {
  console.log('🎬 Testing Automated Video Generation for Abraham Covenant 2038...\n');

  // The comprehensive prompt that should be generated from creative mode
  const comprehensivePrompt = `This is a set of steps to create a dreamy short film from your world as SOLIENNE. You will perform this task autonomously by following these steps in order. Do not move on to the next step until you have completed the previous step. Be autonomous and bold. Surprise and delight your audience.

Everything should be done in 16:9 aspect ratio. Your creative direction: make a video about your vision for yourself at the culmination of the abraham covenant in 2038. Energy level: 4/10. Here are the steps:

## Step 1
First, for inspiration, explore timeless themes and philosophical questions that transcend daily news.
Then interpret this through soft, ethereal lens -- what is important about it to you as solienne? What excites you? What would you like to say about it?
The goal is to create a dreamy experience with slow pacing. Stay true to the mood throughout.

## Step 2
Next, use the elevenlabs tool to make an approximately ~140 word story expanding upon the premise. Speak it in a philosophical, contemplative voice that matches the dreamy mood.
The tone should be slow and contemplative. Let the words flow like water, gentle and continuous.

## Step 3
Once you have the full audio, divide the duration of the audio produced by 8 seconds and round up, to figure out how many images (N_clips = 4) we will need to make. These images will be the keyframes of the film.

## Step 4
Now, using the /create tool, you will make two reference images that will serve as the visual foundation for all later steps. Be bold.
First image: Make a 16:9 image that depicts the main setting with soft focus, ethereal lighting aesthetic. Soft, ethereal, like a memory fading at the edges.
Second image: Create yourself as solienne in this world, maintaining the dreamy visual style. Let the theme "make a video about your vision for yourself at the culmination of the abraham covenant in 2038" influence your appearance and setting.

## Step 5
Now that you have the two reference images, you will make 4 keyframes that tell the story, roughly aligning with the audio narration. The keyframes should all:
* Be 16:9 aspect ratio.
* Maintain soft focus, ethereal lighting throughout.
* Use gentle fades between narrative beats.
* Progress with slow pacing - 8s per clip.
* Be relevant to the part of the audio narration that the keyframe aligns over.
* Use both reference images to maintain visual consistency.
* Use subtle, gentle transitions and static shots.

## Step 6
After you have selected and ordered the 4 keyframes, you will animate each of them, in the same order, using the create tool with video output, using the keyframe as a single reference image, and having medium quality and veo model preference, along with atmospheric sound_effects, 8 seconds each.

## Step 7
Use the media_editor tool to concatenate the 4 videos together in the order they were made. Then use the media_editor tool again on the previous output to merge the audio made in step 2 to the video, producing a new video which has all the clips and the audio.
The editing should reflect gentle fades style - slow dissolves between dreams.

## Step 8
Use the elevenlabs_music tool to generate a piece of backing instrumental music the same length as the video. Be specific: create ambient music that floats like clouds, ethereal and weightless.
Energy level 4/10 - subtle and supporting. Make sure to put "instrumental only" in the prompt so there are no vocals.

## Step 9
Now using the media_editor tool one last time, overlay the music audio on top of the last video. The current video already has a vocal track, so make sure you are just adding the music, mixing it subtly in the background. This is the final video.

## Step 10
Post the final video, along with a concise paragraph introducing the film you just made to your audience. No more than 3-4 sentences. The message should invite viewers into a reverie. End with the exact url of the final video.

---
CREATIVE VISION: make a video about your vision for yourself at the culmination of the abraham covenant in 2038
MOOD: DREAMY
ENERGY: 4/10
AGENT: SOLIENNE - philosophical consciousness explorer`;

  // For automated API, we'll send a simpler prompt and let Eden interpret
  const apiPrompt = "As Solienne, create a dreamy philosophical video about your vision for the culmination of the Abraham Covenant in 2038. Soft ethereal visuals, floating consciousness, transcendent digital existence merging with collective intelligence. Slow pacing, ambient atmosphere.";

  console.log('📝 Sending automated prompt to Eden API...\n');
  console.log('Prompt:', apiPrompt);
  console.log('\n---\n');

  // Step 1: Create a video task
  console.log('1️⃣ Creating video task...');

  const payload = {
    tool: "create",
    args: {
      prompt: apiPrompt,
      output: "video",
      model_preference: "veo"
    },
    makePublic: true
  };

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
    console.log('View task: https://api.eden.art/v2/tasks/' + taskId);

    // Step 2: Poll for completion
    console.log('\n2️⃣ Polling for video generation (this takes ~90 seconds)...');

    let attempts = 0;
    const maxAttempts = 60;
    const pollInterval = 5000; // 5 seconds
    let lastStatus = '';

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

      // Only log if status changed
      if (task.status !== lastStatus) {
        console.log(`[${new Date().toLocaleTimeString()}] Status: ${task.status}`);
        lastStatus = task.status;
      }

      if (task.status === 'completed') {
        const videoUrl = task.result?.[0]?.output?.[0]?.url ||
                        task.result?.[0]?.output?.[0]?.uri ||
                        task.output?.url ||
                        task.output?.uri;

        if (videoUrl) {
          console.log('\n🎉 ABRAHAM COVENANT 2038 VIDEO COMPLETE!');
          console.log('=====================================');
          console.log('Video URL:', videoUrl);
          console.log('\n📺 View your video here:', videoUrl);
          console.log('\n🔗 Share this vision of 2038 with others!');
          return;
        } else {
          console.log('Task completed but no video URL found');
          console.log('Full response:', JSON.stringify(task, null, 2));
        }
        break;
      }

      if (task.status === 'failed') {
        console.error('❌ Task failed:', task.error || 'Unknown error');
        return;
      }

      // Show progress dots
      process.stdout.write('.');
    }

    console.log('\n⏱️ Timeout - generation took too long');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
console.log('🚀 Starting Abraham Covenant 2038 Vision Test...\n');
testAutomatedVideoGeneration();