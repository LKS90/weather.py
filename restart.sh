USER=linaro
sleep 7s
/usr/bin/timeout -s 2 3h /home/${USER}/weather/run.sh
(/home/${USER}/weather/fullscreen.sh)&
