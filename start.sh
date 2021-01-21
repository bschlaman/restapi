PID=`pgrep node`
[ $? -eq 0 ] && { echo PID: $PID.  Killing and starting new instance... ; kill $PID ; } \
	|| echo No instace was up. Starting...
[ -f ./nohup.out ] && rm ./nohup.out
nohup node server.js & 2>&1
