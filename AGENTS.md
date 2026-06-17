# Agent Preferences

## Remote Linux SSH
- When running non-trivial commands on a Linux server from Windows PowerShell, use `%USERPROFILE%\code\agent-quoting.ps1` instead of embedding bash in a quoted `ssh "..."` command.
- Prefer `-Command` for one-liners and pipe a single-quoted PowerShell here-string for multi-line scripts.
- Example:
  `@'`
  `set -euo pipefail`
  `cd /var/www/example`
  `git status --short`
  `'@ | %USERPROFILE%\code\agent-quoting.ps1 -HostName server.example.com -Port <SSH_PORT> -IdentityFile %USERPROFILE%\.ssh\deploy_key`
