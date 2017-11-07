#!/bin/bash
git pull
npm run build
systemctl restart dataquick
