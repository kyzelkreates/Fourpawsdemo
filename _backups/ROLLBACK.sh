#!/bin/bash
# ROLLBACK SCRIPT — restores to snapshot_20260530_162822
SNAP="/app/_backups/snapshot_20260530_162822"
echo "🔄 Rolling back to snapshot..."
rsync -a --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='_backups' \
  "$SNAP/" /app/
echo "✅ Rollback complete. Files restored to snapshot state."
