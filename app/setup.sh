export FLASK_APP="manager.py"
export FLASK_ENV=development
export FLASK_RUN_PORT=3000

if [ -f email_config.sh ]; then
    source email_config.sh
else
    echo "WARNING: Missing email config"
fi
