# MAKE SURE: pip, flask, virtualenv are all for Python3

virtualenv --python=python3 venv
source venv/bin/activate
pip install -r requirements.txt

cd app/client
npm install