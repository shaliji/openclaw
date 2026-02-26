#!/usr/bin/env bash
set -euo pipefail

echo "Starting Chromium in background..."
chromium \
  --headless=new \
  --no-sandbox \
  --disable-setuid-sandbox \
  --disable-gpu \
  --disable-dev-shm-usage \
  --remote-debugging-address=127.0.0.1 \
  --remote-debugging-port=18801 \
  --remote-allow-origins=* \
  --user-data-dir=/home/sandbox/.chrome \
  --no-first-run \
  --no-default-browser-check \
  about:blank &

# 等待 Chromium 启动
echo "Waiting for Chromium to listen on 127.0.0.1:18801..."
max_retries=30
count=0
while ! timeout 1 bash -c "cat < /dev/null > /dev/tcp/127.0.0.1/18801" 2>/dev/null; do
    sleep 1
    count=$((count + 1))
    if [ $count -ge $max_retries ]; then
        echo "Error: Chromium failed to start after $max_retries seconds."
        exit 1
    fi
done

echo "Chromium is Ready. Starting nginx to rewrite Host header to localhost..."
mkdir -p /home/sandbox/nginx/{client_body,proxy,fastcgi,uwsgi,scgi}
exec nginx -c /etc/nginx/nginx.conf -g "daemon off;"
