# Claude Code configuration

This folder holds shared Claude Code configuration for the project.

- `commands/` — custom slash commands
- `agents/` — custom subagent definitions
- `skills/` — project-specific skills

Personal/local files (`settings.local.json`, `projects/`, `memory/`) are gitignored.

## AI Instructions

After making changes to the codebase, always run the test suite to ensure no regressions were introduced:
```bash
npm run test
```
