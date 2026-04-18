# Superpowers MCP Server Setup Guide

## ✅ Server Status: CONFIGURED

The superpowers-mcp server has been configured and is ready to use.

---

## 📍 Server Location

- **Project Path:** `C:\Users\arafa\superpowers-mcp`
- **Build Path:** `C:\Users\arafa\superpowers-mcp\build\index.js`
- **Status:** ✅ Already built and ready

---

## 🔧 Configuration Added

### Local Project Configuration (`mcp.json`)

The following configuration has been added to your project's `mcp.json`:

```json
{
  "mcpServers": {
    "superpowers": {
      "command": "node",
      "args": [
        "C:\\Users\\arafa\\superpowers-mcp\\build\\index.js"
      ]
    }
  }
}
```

---

## 🚀 Available Skills

The superpowers-mcp server provides the following skills:

1. **brainstorming** - Collaborative design through questions and incremental validation
2. **writing-plans** - Bite-sized implementation plans with exact file paths
3. **executing-plans** - Batch execution of plans with review checkpoints
4. **subagent-driven-development** - Fresh subagent per task with two-stage code review
5. **dispatching-parallel-agents** - Distribute independent tasks to concurrent agents
6. **test-driven-development** - RED-GREEN-REFACTOR cycle
7. **systematic-debugging** - 4-phase root cause analysis
8. **verification-before-completion** - Run commands, read output, then claim results
9. **requesting-code-review** - Dispatch code review and act on feedback
10. **receiving-code-review** - Technical rigor when receiving feedback
11. **using-git-worktrees** - Isolated worktrees for parallel development
12. **finishing-a-development-branch** - Structured options for merge/PR/cleanup
13. **writing-skills** - Framework for creating new skills
14. **using-superpowers** - How the skill system works

---

## 📋 Setup Instructions

### Option 1: Use in Current Project (Already Done ✅)

The server is already configured in `C:\Users\arafa\Desktop\safarisSenza\mcp.json`.

### Option 2: Global Setup (Manual Steps Required)

To make superpowers available globally across all projects:

1. **Open Qoder Settings:**
   - Press `Ctrl+,` (or `Cmd+,` on Mac)
   - Navigate to MCP Servers configuration

2. **Add New Server:**
   - Click "Add MCP Server"
   - Name: `superpowers`
   - Command: `node`
   - Args: `C:\Users\arafa\superpowers-mcp\build\index.js`

3. **Save and Restart:**
   - Save the configuration
   - Restart Qoder or reload the window

### Option 3: Manual Configuration File

Create/edit the global MCP config at:
```
C:\Users\arafa\AppData\Roaming\Qoder\mcp.json
```

Add this configuration:
```json
{
  "mcpServers": {
    "superpowers": {
      "command": "node",
      "args": [
        "C:\\Users\\arafa\\superpowers-mcp\\build\\index.js"
      ]
    }
  }
}
```

---

## 🧪 Testing the Server

To verify the server is working:

1. **Restart Qoder** or reload the window
2. **Check MCP Servers list** - You should see "superpowers" in the list
3. **Try using a skill:**
   ```
   Use the brainstorming skill to design a new feature
   ```

---

## 🔍 Troubleshooting

### Server Not Showing Up?

1. **Check if build exists:**
   ```powershell
   Test-Path "C:\Users\arafa\superpowers-mcp\build\index.js"
   ```
   Should return: `True`

2. **Rebuild if needed:**
   ```powershell
   cd C:\Users\arafa\superpowers-mcp
   npm run build
   ```

3. **Test manually:**
   ```powershell
   node C:\Users\arafa\superpowers-mcp\build\index.js
   ```

### Skills Not Available?

1. **Check skills directory:**
   ```powershell
   Get-ChildItem "C:\Users\arafa\superpowers-mcp\build\skills" -Recurse
   ```

2. **Verify skill files exist:**
   - brainstorming/SKILL.md
   - test-driven-development/SKILL.md
   - systematic-debugging/SKILL.md
   - etc.

---

## 📚 Documentation

For more information about superpowers-mcp:

- **GitHub Repository:** https://github.com/erophames/superpowers-mcp
- **README:** `C:\Users\arafa\superpowers-mcp\README.md`
- **Skills Directory:** `C:\Users\arafa\superpowers-mcp\build\skills\`

---

## ✨ Usage Examples

Once configured, you can use skills like this:

### Example 1: Brainstorming
```
Use the brainstorming skill to design a new booking system
```

### Example 2: Test-Driven Development
```
Use the test-driven-development skill to implement user authentication
```

### Example 3: Systematic Debugging
```
Use the systematic-debugging skill to fix the image loading issue
```

### Example 4: Writing Plans
```
Use the writing-plans skill to create a migration strategy
```

---

## ✅ Verification Checklist

- [x] Superpowers-mcp project exists at `C:\Users\arafa\superpowers-mcp`
- [x] Project is built (`build/` directory exists)
- [x] Configuration added to project `mcp.json`
- [ ] Server appears in Qoder MCP server list (after restart)
- [ ] Skills are accessible (after restart)
- [ ] All 14 skills are available

---

## 🎯 Next Steps

1. **Restart Qoder** to load the new MCP server configuration
2. **Verify** the server appears in the MCP servers list
3. **Start using** the superpowers skills in your workflows
4. **Explore** all 14 available skills for enhanced productivity

---

**Last Updated:** April 9, 2026  
**Status:** ✅ Configuration Complete - Ready to Use
