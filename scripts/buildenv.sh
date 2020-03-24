#!/bin/sh

echo "Creating .env file..."
tee -a .env <<EOF
HUMAN_API_URL=$HUMAN_API_URL
EOF