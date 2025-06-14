#!/bin/bash

TEST_DIR=.maestro
PLATFORM="$1"

run_and_check() {
    local func_name="$1"
    shift
    local output
    output=$( "$func_name" "$@" 2>&1 )

    local status=$?
    if [ $status -ne 0 ]; then
        echo "$output"
        exit 1
    fi
}

prepare_server() {
  echo "🔧 - Preparing server"

  if [ -d "./Grouptivate-Server/" ]; then
    echo "Deleting Grouptivate-Server"
    rm -rf "./Grouptivate-Server/"
  fi

  # Clone server
  run_and_check git clone https://github.com/AAU-SW8-FASABA/Grouptivate-Server.git --recurse-submodules

  # Install dependencies
  (
    run_and_check npm install --prefix Grouptivate-Server
  )
}

run_test() {
  echo "🧪 - Testing: $1 on $PLATFORM"

  # Start server
  npm run server --prefix Grouptivate-Server -- --local > server_output.log 2>&1 &
  SERVER_PID=$!

  # Wait until "Configuring Cron Jobs" appears in the output
  echo "⏱ - Waiting for 'Configuring Cron Jobs' to appear in server output..."

  while ! grep -q "Configuring Cron Jobs" server_output.log; do
    sleep 0.5
  done

  echo "✅ - 'Configuring Cron Jobs' detected. Continuing..."
  
  # Build the application for release using local server
  echo "📲 - Building and installing the app"
  if [ "$PLATFORM" = "--ios" ]; then
    EXPO_RELEASE_CONFIG="--configuration Release"
  elif [ "$PLATFORM" = "--android" ]; then
    EXPO_RELEASE_CONFIG="--variant release"
  fi

  strippedPlatform=${PLATFORM//-}
  
  if ! OUTPUT=$(PLATFORM=$strippedPlatform ENDTOEND=true npx expo run:$strippedPlatform --no-bundler $EXPO_RELEASE_CONFIG 2>&1); then
    echo "$OUTPUT"
  fi

  # Run the tests on the given platform
  echo "🧪 - Running test file: $1"
  if ! MAESTRO_OUTPUT=$(maestro test $1 2>&1); then
    echo "❌ - Failed running test: $1"
    echo "$MAESTRO_OUTPUT"
  else
    echo "✅ - Test passed: $1"
  fi

  # Stop the server
  kill $SERVER_PID
}

main() {
  prepare_server
  
  # Run every test
  for testFile in "$TEST_DIR"/*
  do
    if [[ "$testFile" == *.yml ]]; then
      run_test $testFile
    fi
  done

  exit 0
}

# Ensure correct argument is passed
if [ "$PLATFORM" != "--ios" ] && [ "$PLATFORM" != "--android" ]; then
  echo "❌ - Usage: $0 --ios | --android"
  exit 1
fi

main

exit 1
