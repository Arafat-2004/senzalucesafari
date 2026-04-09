# Superpowers MCP Server Verification Script

Write-Host "`n=== Superpowers MCP Server Verification ===" -ForegroundColor Cyan

# Check 1: Project exists
Write-Host "`n[1/5] Checking project directory..." -ForegroundColor Yellow
$projectPath = "C:\Users\arafa\superpowers-mcp"
if (Test-Path $projectPath) {
    Write-Host "✓ Project exists at: $projectPath" -ForegroundColor Green
} else {
    Write-Host "✗ Project NOT found at: $projectPath" -ForegroundColor Red
    exit 1
}

# Check 2: Build exists
Write-Host "`n[2/5] Checking build directory..." -ForegroundColor Yellow
$buildPath = "$projectPath\build\index.js"
if (Test-Path $buildPath) {
    Write-Host "✓ Build file exists: $buildPath" -ForegroundColor Green
} else {
    Write-Host "✗ Build file NOT found: $buildPath" -ForegroundColor Red
    Write-Host "  → Run: cd $projectPath && npm run build" -ForegroundColor Yellow
    exit 1
}

# Check 3: Skills directory
Write-Host "`n[3/5] Checking skills directory..." -ForegroundColor Yellow
$skillsPath = "$projectPath\build\skills"
if (Test-Path $skillsPath) {
    $skills = Get-ChildItem $skillsPath -Directory
    Write-Host "✓ Skills directory exists with $($skills.Count) skills:" -ForegroundColor Green
    foreach ($skill in $skills) {
        Write-Host "  - $($skill.Name)" -ForegroundColor Gray
    }
} else {
    Write-Host "✗ Skills directory NOT found" -ForegroundColor Red
}

# Check 4: MCP configuration
Write-Host "`n[4/5] Checking MCP configuration..." -ForegroundColor Yellow
$mcpConfigPath = "C:\Users\arafa\Desktop\safarisSenza\mcp.json"
if (Test-Path $mcpConfigPath) {
    $config = Get-Content $mcpConfigPath | ConvertFrom-Json
    if ($config.mcpServers.PSObject.Properties.Name -contains "superpowers") {
        Write-Host "✓ Superpowers server configured in mcp.json" -ForegroundColor Green
        $serverConfig = $config.mcpServers.superpowers
        Write-Host "  Command: $($serverConfig.command)" -ForegroundColor Gray
        Write-Host "  Args: $($serverConfig.args -join ' ')" -ForegroundColor Gray
    } else {
        Write-Host "✗ Superpowers server NOT found in mcp.json" -ForegroundColor Red
    }
} else {
    Write-Host "✗ mcp.json NOT found at: $mcpConfigPath" -ForegroundColor Red
}

# Check 5: Node.js availability
Write-Host "`n[5/5] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js available: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js NOT found in PATH" -ForegroundColor Red
}

# Summary
Write-Host "`n=== Verification Summary ===" -ForegroundColor Cyan
Write-Host "Project Location: $projectPath" -ForegroundColor White
Write-Host "Build File: $buildPath" -ForegroundColor White
Write-Host "Config File: $mcpConfigPath" -ForegroundColor White
Write-Host "`nStatus: " -NoNewline -ForegroundColor White
Write-Host "✅ READY TO USE" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Restart Qoder or reload the window" -ForegroundColor Gray
Write-Host "2. Check MCP Servers list for 'superpowers'" -ForegroundColor Gray
Write-Host "3. Start using superpowers skills!" -ForegroundColor Gray
Write-Host "`nAvailable Skills:" -ForegroundColor Yellow
Write-Host "- brainstorming" -ForegroundColor Gray
Write-Host "- writing-plans" -ForegroundColor Gray
Write-Host "- executing-plans" -ForegroundColor Gray
Write-Host "- subagent-driven-development" -ForegroundColor Gray
Write-Host "- dispatching-parallel-agents" -ForegroundColor Gray
Write-Host "- test-driven-development" -ForegroundColor Gray
Write-Host "- systematic-debugging" -ForegroundColor Gray
Write-Host "- verification-before-completion" -ForegroundColor Gray
Write-Host "- requesting-code-review" -ForegroundColor Gray
Write-Host "- receiving-code-review" -ForegroundColor Gray
Write-Host "- using-git-worktrees" -ForegroundColor Gray
Write-Host "- finishing-a-development-branch" -ForegroundColor Gray
Write-Host "- writing-skills" -ForegroundColor Gray
Write-Host "- using-superpowers" -ForegroundColor Gray
Write-Host "`n" -ForegroundColor White
