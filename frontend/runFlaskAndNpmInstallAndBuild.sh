#/bin/sh

# nextJs needs a server to answer all requests during compile time
# Thus we start a small flask endpoint to satisfy the requests
# nohup python3 -m flask run --host=0.0.0.0 -p 8080 > log.txt 2>&1 &
# python3 -m flask run --host=0.0.0.0 -p 8080 &
#sleep 5
npm install
npm run build
