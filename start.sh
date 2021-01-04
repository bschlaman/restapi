PID=`pgrep node`
[ $? -eq 0 ] && { echo PID: $PID.  Killing and starting new instance... ; kill $PID ; } \
	|| echo No instace was up. Starting...
#nohup node app.js > /dev/null 2>&1 &
#node app.js > stdout 2>&1 &
[ -f ./nohup.out ] && rm ./nohup.out
nohup node server.js &
