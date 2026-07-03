#!/bin/sh
# Clean delegation to the system's Gradle binary if wrapper jar isn't present
if command -v gradle >/dev/null 2>&1; then
  exec gradle "$@"
else
  echo "Error: Gradle is not installed on this system. Please install gradle or use standard build steps." >&2
  exit 1
fi
