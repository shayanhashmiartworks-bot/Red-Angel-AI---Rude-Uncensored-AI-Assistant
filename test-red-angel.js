/**
 * Test script to verify Red Angel model is working correctly
 */

const { AIBackend } = require('./ai-backend.js');

async function testRedAngel() {
    console.log('😈 Testing Red Angel Model...');
    
    const ai = new AIBackend();
    
    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test questions
    const testQuestions = [
        "What is your name?",
        "Hey",
        "Are you Neural Daredevil?",
        "Who are you?"
    ];
    
    for (const question of testQuestions) {
        console.log(`\n🤔 Question: ${question}`);
        try {
            const response = await ai.generateResponse(question);
            console.log(`😈 Red Angel: ${response}`);
        } catch (error) {
            console.error(`❌ Error: ${error.message}`);
        }
    }
    
    console.log('\n✅ Red Angel testing complete!');
}

// Run the test
testRedAngel().catch(console.error);
