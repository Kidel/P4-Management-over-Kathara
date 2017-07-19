#!/bin/bash

docker-compose down
$NETKIT_HOME/lclean
docker network rm netkit_${UID}_M