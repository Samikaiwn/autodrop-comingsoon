#!/bin/bash

echo "🚀 Starting Auto Git Deployment to GitHub..."

# Initialize Git (if not already initialized)
git init

# Set main branch
git branch -M main

# Connect to remote GitHub repo
git remote add origin https://github.com/Samikaiwn/autodropplatform.shop.git 2>/dev/null

# Add all files
git add .

# Commit with standard message
git commit -m "Deploy full AutoDrop Platform with Stripe, OpenAI, and intelligent backend" || echo "⚠️ Nothing to commit."

# Push to GitHub
git push -u origin main --force

echo "✅ Deployment complete! Check GitHub repository."