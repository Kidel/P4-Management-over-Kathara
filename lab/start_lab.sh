#!/bin/bash

docker-compose up -d
docker exec -ti master sysctl net.ipv4.conf.all.rp_filter=0
docker network create netkit_${UID}_M
docker connect netkit_${UID}_M master
docker exec -ti master ifconfig eth1 10.0.0.1/24 up
$NETKIT_HOME/lstart