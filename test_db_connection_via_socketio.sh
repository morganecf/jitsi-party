
# Usage: bash test_db_connection_via_socketio.sh <num_clients> <events_per_second>

for i in $(seq 1 $1); do
    python3 test_db_connection_via_socketio.py $2 &
done
