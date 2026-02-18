
const BASE_URL = 'http://localhost:3000';

async function testElevenLabsRoute() {
    console.log('Testing /api/elevenlabs...');

    // Test 1: Missing text
    try {
        const res = await fetch(`${BASE_URL}/api/elevenlabs`, {
            method: 'POST',
            body: JSON.stringify({}),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.status === 400) console.log('✅ Missing text check passed');
        else console.error('❌ Missing text check failed', res.status);
    } catch (e) { console.error('Error connecting', e.message); }

    // Test 2: Text too long
    try {
        const longText = 'a'.repeat(5001);
        const res = await fetch(`${BASE_URL}/api/elevenlabs`, {
            method: 'POST',
            body: JSON.stringify({ text: longText }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.status === 400) console.log('✅ Text length check passed');
        else console.error('❌ Text length check failed', res.status);
    } catch (e) { console.error('Error connecting', e.message); }
}

async function testAIEditRoute() {
    console.log('Testing /api/ai/edit-element...');

    // Test 1: Missing params
    try {
        const res = await fetch(`${BASE_URL}/api/ai/edit-element`, {
            method: 'POST',
            body: JSON.stringify({}),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.status === 400) console.log('✅ Missing params check passed');
        else console.error('❌ Missing params check failed', res.status);
    } catch (e) { console.error('Error connecting', e.message); }
}

async function run() {
    console.log('Starting Security Verification...');
    await testElevenLabsRoute();
    await testAIEditRoute();
    console.log('Verification Complete.');
}

run();
