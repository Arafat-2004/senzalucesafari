#!/usr/bin/env node

const http = require('http');

const BASE_URL = process.env.HEALTH_URL || 'http://localhost:3000';

function makeRequest(path) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE_URL);
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'GET',
        timeout: 5000,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode ?? 0, data: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode ?? 0, data: {} });
          }
        });
      }
    );
    req.on('error', () => {
      resolve({ status: 0, data: {} });
    });
    req.end();
  });
}

async function checkHealth() {
  const checks = [];
  
  console.log('Running health checks...\n');

  // Check main application
  const mainCheck = await makeRequest('/');
  checks.push({
    name: 'main',
    status: mainCheck.status === 200 ? 'healthy' : 'unhealthy',
    message: mainCheck.status === 200 ? 'Application responding' : `HTTP ${mainCheck.status}`,
    timestamp: new Date().toISOString(),
  });
  console.log(`  ${mainCheck.status === 200 ? '✓' : '✗'} Main application`);

  // Check admin routes
  const adminCheck = await makeRequest('/admin/login');
  checks.push({
    name: 'admin',
    status: adminCheck.status === 200 ? 'healthy' : 'unhealthy',
    message: adminCheck.status === 200 ? 'Admin responding' : `HTTP ${adminCheck.status}`,
    timestamp: new Date().toISOString(),
  });
  console.log(`  ${adminCheck.status === 200 ? '✓' : '✗'} Admin routes`);

  // Check API endpoints
  const sessionCheck = await makeRequest('/api/admin/session');
  checks.push({
    name: 'api_session',
    status: sessionCheck.status === 200 ? 'healthy' : 'unhealthy',
    message: sessionCheck.status === 200 ? 'Session API working' : `HTTP ${sessionCheck.status}`,
    timestamp: new Date().toISOString(),
  });
  console.log(`  ${sessionCheck.status === 200 ? '✓' : '✗'} Session API`);

  // Check MFA API
  const mfaCheck = await makeRequest('/api/admin/mfa-status');
  const mfaEndpointHealthy = [200, 401].includes(mfaCheck.status);
  checks.push({
    name: 'api_mfa',
    status: mfaEndpointHealthy ? 'healthy' : 'unhealthy',
    message: mfaCheck.status === 401 ? 'MFA API protected and responding' : (mfaEndpointHealthy ? 'MFA API working' : `HTTP ${mfaCheck.status}`),
    timestamp: new Date().toISOString(),
  });
  console.log(`  ${mfaEndpointHealthy ? '✓' : '✗'} MFA API`);

  // Check database connectivity (indirect via any DB-dependent endpoint)
  const settingsCheck = await makeRequest('/api/settings');
  const settingsEndpointReachable = settingsCheck.status > 0 && settingsCheck.status < 500;
  checks.push({
    name: 'database',
    status: settingsEndpointReachable ? 'healthy' : 'unhealthy',
    message: settingsEndpointReachable ? 'Settings endpoint responded' : `Endpoint unavailable (HTTP ${settingsCheck.status})`,
    timestamp: new Date().toISOString(),
  });
  console.log(`  ${settingsEndpointReachable ? '✓' : '✗'} Settings endpoint`);

  // Calculate overall status
  const healthyCount = checks.filter(c => c.status === 'healthy').length;
  const totalCount = checks.length;
  const healthyRatio = healthyCount / totalCount;

  let overallStatus;
  if (healthyRatio === 1) {
    overallStatus = 'healthy';
  } else if (healthyRatio >= 0.6) {
    overallStatus = 'degraded';
  } else {
    overallStatus = 'unhealthy';
  }

  const status = {
    status: overallStatus,
    checks,
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  };

  return status;
}

async function main() {
  console.log('\n=== Health Check ===\n');
  
  const status = await checkHealth();
  
  console.log('\n=== Result ===');
  console.log(`Overall: ${status.status.toUpperCase()}`);
  console.log(`Healthy: ${status.checks.filter(c => c.status === 'healthy').length}/${status.checks.length}`);
  console.log(`Timestamp: ${status.timestamp}\n`);

  if (status.status === 'unhealthy') {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Health check failed:', error);
  process.exit(1);
});
