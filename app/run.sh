echo "Starting server"
python -m http.server 3000 &

echo "Starting webpack watcher"
npm run-script build
