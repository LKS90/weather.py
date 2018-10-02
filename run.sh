#!/bin/bash

# trap ctrl-c and redirect
trap ctrl_c INT

function ctrl_c() {
    eval "kill $(ps -efw | grep flask | grep -v grep | awk '{print $2}')"
    rm -r /home/${USER}/.cache/mozilla
    rm /home/${USER}/weather/run.lock
    (sleep 1s && ./restart.sh)&
    exit 1
}

touch run.lock
USER=linaro
FLASK_APP=weather.py
export FLASK_APP
FLASK_CMD=". /home/${USER}/weather/bin/activate weather; flask run"
eval "${FLASK_CMD} &"
ICEWEASEL_CMD="iceweasel http://localhost:5000 -foreground -browser --display=:0.0"
eval "${ICEWEASEL_CMD} &"
(sleep 4 && ./fullscreen.sh)&
