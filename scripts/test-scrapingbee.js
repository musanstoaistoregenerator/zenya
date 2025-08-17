#!/usr/bin/env node

/**
 * Test script for ScrapingBee integration
 * Usage: node scripts/test-scrapingbee.js [URL]
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const SCRAPINGBEE_API_KEY = process.env.SCRAPINGBEE_API_KEY;
const SCRAPINGBEE_BASE_URL = 'https://app.scrapingbee.com/api/v1/';

// Test URL (default to AliExpress product)
const testUrl = process.argv[2] || 'https://www.aliexpress.com/item/1005004222717618.html';

async function testScrapingBee() {
  console.log('🧪 Testing ScrapingBee Integration');
  console.log('================================');
  console.log(`📍 Test URL: ${testUrl}`);
  console.log(`🔑 API Key: ${SCRAPINGBEE_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log('');

  if (!SCRAPINGBEE_API_KEY) {
    console.error('❌ Error: SCRAPINGBEE_API_KEY not found in .env.local');
    console.log('📝 Please:');
    console.log('   1. Copy .env.example to .env.local');
    console.log('   2. Add your ScrapingBee API key');
    console.log('   3. Sign up at https://www.scrapingbee.com/');
    process.exit(1);
  }

  try {
    console.log('🚀 Making request to ScrapingBee API...');
    
    // Build ScrapingBee URL
    const scrapingBeeUrl = new URL(SCRAPINGBEE_BASE_URL);
    scrapingBeeUrl.searchParams.append('api_key', SCRAPINGBEE_API_KEY);
    scrapingBeeUrl.searchParams.append('url', testUrl);
    scrapingBeeUrl.searchParams.append('render_js', 'true');
    scrapingBeeUrl.searchParams.append('premium_proxy', 'true');
    scrapingBeeUrl.searchParams.append('country_code', 'us');
    scrapingBeeUrl.searchParams.append('wait', '3000');
    scrapingBeeUrl.searchParams.append('wait_for', '.product-title, h1, [data-testid="title"]');

    const startTime = Date.now();
    const response = await fetch(scrapingBeeUrl.toString());
    const endTime = Date.now();
    
    console.log(`⏱️  Response time: ${endTime - startTime}ms`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    // Check response headers for usage info
    const remainingCalls = response.headers.get('spb-current-month-api-calls-remaining');
    const totalCalls = response.headers.get('spb-current-month-api-calls-count');
    
    if (remainingCalls) {
      console.log(`📈 API Usage: ${totalCalls} calls used, ${remainingCalls} remaining this month`);
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ ScrapingBee API Error: ${response.status}`);
      console.error(`📄 Error details: ${errorText}`);
      
      if (response.status === 401) {
        console.log('💡 Tip: Check your API key in .env.local');
      } else if (response.status === 402) {
        console.log('💡 Tip: You may have exceeded your monthly quota');
      }
      
      process.exit(1);
    }

    const html = await response.text();
    console.log(`📄 HTML received: ${html.length} characters`);
    
    // Test our extraction API endpoint
    console.log('');
    console.log('🧪 Testing extraction endpoint...');
    
    const extractResponse = await fetch('http://localhost:3000/api/extract-scrapingbee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: testUrl })
    });
    
    if (!extractResponse.ok) {
      console.error(`❌ Extraction API Error: ${extractResponse.status}`);
      const errorText = await extractResponse.text();
      console.error(`📄 Error details: ${errorText}`);
      process.exit(1);
    }
    
    const extractData = await extractResponse.json();
    
    console.log('✅ Extraction Results:');
    console.log('=====================');
    console.log(`📝 Title: ${extractData.data?.title || 'Not found'}`);
    console.log(`💰 Price: ${extractData.data?.price || 'Not found'}`);
    console.log(`🏷️  Brand: ${extractData.data?.brand || 'Not found'}`);
    console.log(`⭐ Rating: ${extractData.data?.rating || 'Not found'}`);
    console.log(`🖼️  Images: ${extractData.data?.images?.length || 0} found`);
    console.log(`📄 Description: ${extractData.data?.description ? extractData.data.description.substring(0, 100) + '...' : 'Not found'}`);
    console.log(`🔧 Method: ${extractData.data?.extractionMethod || 'Unknown'}`);
    console.log(`🕒 Extracted at: ${extractData.data?.extractedAt || 'Unknown'}`);
    
    if (extractData.data?.images?.length > 0) {
      console.log('');
      console.log('🖼️  Sample Images:');
      extractData.data.images.slice(0, 3).forEach((img, index) => {
        console.log(`   ${index + 1}. ${img}`);
      });
    }
    
    console.log('');
    console.log('🎉 ScrapingBee integration test completed successfully!');
    console.log('💡 You can now use enhanced URL extraction in StoreForge AI');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Tip: Make sure your development server is running (npm run dev)');
    }
    
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Test interrupted by user');
  process.exit(0);
});

// Run the test
testScrapingBee().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});