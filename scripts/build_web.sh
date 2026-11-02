#!/bin/bash
set -e

echo "=== TurnWise Vercel Universal Build Runner ==="
echo "Current directory: $(pwd)"

if [ -d "mobile" ]; then
  echo "-> Running from repository root."
  cd mobile
  EXPO_NO_TELEMETRY=1 EXPO_HOME=/tmp/.expo HOME=/tmp npx expo export -p web
  cd ..
  rm -rf dist
  cp -r mobile/dist ./
  echo "-> Copied build to ./dist and ./mobile/dist"

elif [ -f "App.tsx" ] || [ -f "app.json" ]; then
  echo "-> Running from mobile directory."
  EXPO_NO_TELEMETRY=1 EXPO_HOME=/tmp/.expo HOME=/tmp npx expo export -p web
  rm -rf mobile/dist
  mkdir -p mobile
  cp -r dist mobile/
  echo "-> Copied build to ./dist and ./mobile/dist"

elif [ -d "../mobile" ]; then
  echo "-> Running from subdirectory (e.g. server). Redirecting to ../mobile..."
  cd ../mobile
  EXPO_NO_TELEMETRY=1 EXPO_HOME=/tmp/.expo HOME=/tmp npx expo export -p web
  cd - >/dev/null
  rm -rf dist mobile/dist
  cp -r ../mobile/dist ./
  mkdir -p mobile
  cp -r ../mobile/dist mobile/
  echo "-> Copied build to ./dist and ./mobile/dist"

else
  echo "-> Running fallback build..."
  npx expo export -p web || npm run build:web
fi

echo "=== Build Complete! Verified output directories ==="
ls -la dist 2>/dev/null || true
ls -la mobile/dist 2>/dev/null || true
