echo "Starting server"
python3 -m http.server 3000 &

echo "Starting webpack watcher"
npm run-script build
