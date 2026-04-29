#!/usr/bin/env node

import http from 'http';
import https from 'https';
import { URL } from 'url';

const TEST_URL = process.env.TEST_URL || 'http://localhost:3000';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const REQUIRED_ROUTES = [
  '/',
  '/safaris-tours',
  '/admin/login',
  '/admin/mfa',
  '/api/admin/session',
  '/api/admin/mfa-status',
];

const CRITICAL_API_ENDPOINTS = [
  '/api/admin/mfa-verify',
  '/api/admin/mfa-setup',
  '/api/settings',
];

interface TestResult {
  name: string;
  success: boolean;
  status?: number;
  error?: string;
  duration: number;
}

function makeRequest(path: string, options = {}): Promise<TestResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const url = new URL(path, TEST_URL);
    
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'GET',
        timeout: 10000,
        ...options,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({
            name: path,
            success: res.statusCode ? res.statusCode < 400 : false,
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
        error: error.message,
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

function testSecurityHeaders(url: string): Promise<TestResult> {
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
        error: error.message,
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

  const results: TestResult[] = [];

  console.log('Testing public routes...');
  for (const route of REQUIRED_ROUTES) {
    const result = await makeRequest(route);
    results.push(result);
    console.log(`  ${result.success ? '✓' : '✗'} ${route} [${result.status}] (${result.duration}ms)`);
  }

  console.log('\nTesting security headers...');
  const securityResult = await testSecurityHeaders(TEST_URL);
  results.push(securityResult);
  console.log(`  ${securityResult.success ? '✓' : '✗'} Security headers ${securityResult.success ? 'present' : 'missing'}`);

  console.log('\nTesting critical API endpoints...');
  for (const endpoint of CRITICAL_API_ENDPOINTS) {
    const result = await makeRequest(endpoint, { method: 'HEAD' });
    results.push(result);
    console.log(`  ${result.success ? '✓' : '✗'} ${endpoint} [${result.status}] (${result.duration}ms)`);
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