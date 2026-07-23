#!/usr/bin/env node

const http = require('http');
const { URL } = require('url');

const TEST_URL = process.env.TEST_URL || 'http://localhost:3000';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const REQUEST_TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS) || (IS_PRODUCTION ? 10000 : 30000);

const REQUIRED_ROUTES = [
  { path: '/', acceptedStatus: [200] },
  { path: '/safaris-tours', acceptedStatus: [200] },
  { path: '/admin/login', acceptedStatus: [200] },
  { path: '/admin/mfa', acceptedStatus: [200, 307, 308] },
  { path: '/api/admin/session', acceptedStatus: [200, 401] },
  // MFA status is auth-protected; unauthenticated check should return 401
  { path: '/api/admin/mfa-status', acceptedStatus: [401] },
];

const CRITICAL_API_ENDPOINTS = [
  // Both endpoints are intentionally protected from unauthenticated callers.
  { path: '/api/admin/mfa-setup', acceptedStatus: [401] },
  { path: '/api/settings', acceptedStatus: [401] },
];

function makeRequest(path, options = {}, acceptedStatus = []) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const url = new URL(path, TEST_URL);
    
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'GET',
        timeout: REQUEST_TIMEOUT_MS,
        ...options,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({
            name: path,
            success: res.statusCode
              ? (acceptedStatus.length > 0
                  ? acceptedStatus.includes(res.statusCode)
                  : res.statusCode < 400)
              : false,
            status: res.statusCode,
            duration: Date.now() - startTime,
          });
        });
      }
    );

    req.on('error', (error) => {
      resolve({
        name: path,
        success: false,
        error: `${error.code ? `${error.code}: ` : ''}${error.message}`,
        duration: Date.now() - startTime,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: path,
        success: false,
        error: 'Request timeout',
        duration: Date.now() - startTime,
      });
    });

    req.end();
  });
}

function testSecurityHeaders(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const parsedUrl = new URL(url);
    
    const req = http.request(
      {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname,
        method: 'HEAD',
      },
      (res) => {
        const headers = res.headers;
        const securityHeaders = {
          'x-frame-options': headers['x-frame-options'],
          'x-content-type-options': headers['x-content-type-options'],
          'x-xss-protection': headers['x-xss-protection'],
          'referrer-policy': headers['referrer-policy'],
          'content-security-policy': headers['content-security-policy'],
        };
        
        resolve({
          name: 'Security Headers',
          success: Object.values(securityHeaders).some(v => v !== undefined),
          status: res.statusCode,
          duration: Date.now() - startTime,
        });
      }
    );

    req.on('error', (error) => {
      resolve({
        name: 'Security Headers',
        success: false,
        error: `${error.code ? `${error.code}: ` : ''}${error.message}`,
        duration: Date.now() - startTime,
      });
    });

    req.end();
  });
}

async function runSmokeTests() {
  console.log('\n=== Production Smoke Tests ===\n');
  console.log(`Target: ${TEST_URL}`);
  console.log(`Mode: ${IS_PRODUCTION ? 'Production' : 'Development'}\n`);

  const readiness = await makeRequest('/', {}, [200]);
  if (!readiness.success && readiness.error) {
    console.error(`Cannot reach ${TEST_URL} (${readiness.error}).`);
    console.error('Start the application first with "npm run dev", then run this command again.');
    console.error('For a deployed environment, set TEST_URL to the deployed origin.\n');
    process.exit(1);
  }

  const results = [];

  console.log('Testing public routes...');
  for (const route of REQUIRED_ROUTES) {
    const result = await makeRequest(route.path, {}, route.acceptedStatus);
    results.push(result);
    console.log(`  ${result.success ? '✓' : '✗'} ${route.path} [${result.status ?? result.error ?? 'no response'}] (${result.duration}ms)`);
  }

  console.log('\nTesting security headers...');
  const securityResult = await testSecurityHeaders(TEST_URL);
  results.push(securityResult);
  console.log(`  ${securityResult.success ? '✓' : '✗'} Security headers ${securityResult.success ? 'present' : 'missing'}`);

  console.log('\nTesting critical API endpoints...');
  for (const endpoint of CRITICAL_API_ENDPOINTS) {
    const result = await makeRequest(endpoint.path, { method: 'HEAD' }, endpoint.acceptedStatus);
    results.push(result);
    console.log(`  ${result.success ? '✓' : '✗'} ${endpoint.path} [${result.status ?? result.error ?? 'no response'}] (${result.duration}ms)`);
  }

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const total = results.length;

  console.log('\n=== Results ===');
  console.log(`Passed: ${passed}/${total}`);
  console.log(`Failed: ${failed}/${total}`);
  
  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.name}: ${r.error || `HTTP ${r.status}`}`);
    });
  }

  if (passed === total) {
    console.log('\n✓ All smoke tests passed!\n');
    process.exit(0);
  } else {
    console.log('\n✗ Some smoke tests failed!\n');
    process.exit(1);
  }
}

runSmokeTests().catch(console.error);
