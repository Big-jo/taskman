#!/bin/sh

# Build the application
yarn run build

# Run migration (non-watch, must exit)
yarn run migration:run

# Start the app
yarn run start:prod
