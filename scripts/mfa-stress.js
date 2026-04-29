#!/usr/bin/env node

import http from 'http';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const CONCURRENT_REQUESTS = parseInt(process.env.CONCURRENT || '10', 10);

function makeRequest(path, options = {}) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data ? JSON.parse(data) : {},
        });
      });
    });

    req.on('error', () => {
      resolve({ status: 0, error: 'Network error' });
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runStressTest() {
  console.log(`\n=== MFA Authentication Stress Test ===`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Concurrent requests: ${CONCURRENT_REQUESTS}\n`);

  const results = {
    successful: 0,
    authErrors: 0,
    csrfErrors: 0,
    rateLimited: 0,
    serverErrors: 0,
    networkErrors: 0,
    timings: [],
  };

  const requests = [];
  const startTime = Date.now();

  for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
    requests.push(
      makeRequest('/api/admin/mfa-verify', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': `stress-test-${i}`,
          'Content-Type': 'application/json',
        },
        body: {
          code: `${i.toString().padStart(6, '0')}`,
          method: 'totp',
        },
      }).then(result => {
        results.timings.push(Date.now() - startTime);
        if (result.status === 0) {
          results.networkErrors++;
        } else if (result.status === 200) {
          results.successful++;
        } else if (result.status === 401) {
          results.authErrors++;
        } else if (result.status === 403) {
          results.csrfErrors++;
        } else if (result.status === 429) {
          results.rateLimited++;
        } else if (result.status >= 500) {
          results.serverErrors++;
        }
        return result;
      })
    );
  }

  const responses = await Promise.all(requests);
  const duration = Date.now() - startTime;

  console.log('=== Results ===');
  console.log(`Total duration: ${duration}ms`);
  console.log(`Total requests: ${responses.length}`);
  console.log(`Successful: ${results.successful}`);
  console.log(`Auth errors: ${results.authErrors}`);
  console.log(`CSRF errors: ${results.csrfErrors}`);
  console.log(`Rate limited: ${results.rateLimited}`);
  console.log(`Server errors: ${results.serverErrors}`);
  console.log(`Network errors: ${results.networkErrors}`);

  const avgTime = results.timings.reduce((a, b) => a + b, 0) / results.timings.length;
  const maxTime = Math.max(...results.timings);
  const minTime = Math.min(...results.timings);
  console.log(`\nResponse times:`);
  console.log(`  Avg: ${Math.round(avgTime)}ms`);
  console.log(`  Min: ${minTime}ms`);
  console.log(`  Max: ${maxTime}ms`);

  const crashRate = (results.serverErrors + results.networkErrors) / responses.length;
  console.log(`\nStability: ${((1 - crashRate) * 100).toFixed(1)}%`);

  if (crashRate > 0.1) {
    console.log('\n⚠️  WARNING: High failure rate detected!');
    process.exit(1);
  }

  if (results.rateLimited > 0) {
    console.log('\n✓ Rate limiting is working');
  }

  console.log('\n=== Test Complete ===\n');
  process.exit(0);
}

async function runBruteForceSimulation() {
  console.log('\n=== Brute Force Attack Simulation ===\n');

  let rateLimited = false;
  let attempts = 0;
  const maxAttempts = 20;

  for (let i = 0; i < maxAttempts && !rateLimited; i++) {
    attempts++;
    const result = await makeRequest('/api/admin/mfa-verify', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': `brute-force-${i}`,
        'Content-Type': 'application/json',
      },
      body: {
        code: '000000',
        method: 'totp',
      },
    });

    if (result.status === 429) {
      rateLimited = true;
      console.log(`Rate limited after ${attempts} attempts`);
    }
  }

  if (rateLimited) {
    console.log('✓ Brute force protection is working');
    console.log(`  Blocked after ${attempts} attempts`);
  } else {
    console.log('⚠️  WARNING: Rate limiting not triggered!');
  }

  console.log('\n=== Test Complete ===\n');
}

async function runSessionRaceTest() {
  console.log('\n=== Session Race Condition Test ===\n');

  const userId = 'race-test-user';
  const cookies = `admin_session=${userId}`;

  const requests = [];
  for (let i = 0; i < 5; i++) {
    requests.push(
      makeRequest('/api/admin/mfa-verify', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': `race-test-${i}`,
          'Content-Type': 'application/json',
          'Cookie': cookies,
        },
        body: { code: '123456', method: 'totp' },
      })
    );
  }

  const responses = await Promise.all(requests);
  const statuses = responses.map(r => r.status);

  console.log(`Responses: ${statuses.join(', ')}`);

  const uniqueStatuses = [...new Set(statuses)];
  console.log(`Unique statuses: ${uniqueStatuses.length}`);

  if (uniqueStatuses.every(s => [200, 401, 403].includes(s))) {
    console.log('✓ No crashes under concurrent session access');
  } else {
    console.log('⚠️  WARNING: Unexpected responses!');
  }

  console.log('\n=== Test Complete ===\n');
}

const command = process.argv[2] || 'stress';

if (command === 'stress') {
  runStressTest();
} else if (command === 'bruteforce') {
  runBruteForceSimulation();
} else if (command === 'race') {
  runSessionRaceTest();
} else {
  console.log('Usage: node scripts/mfa-stress.js [stress|bruteforce|race]');
  process.exit(1);
}