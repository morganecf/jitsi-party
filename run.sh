echo "Starting server"
python -m http.server 8000 &

echo "Starting webpack watcher"
npm run-script build
