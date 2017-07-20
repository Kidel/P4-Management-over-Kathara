@echo off

CALL docker-compose up -d
CALL docker exec -ti master sysctl net.ipv4.conf.all.rp_filter=0
CALL docker network create netkit_nt_M
CALL docker network connect netkit_nt_M master
CALL docker exec -ti master ifconfig eth1 10.0.0.1/24 up
CALL %NETKIT_HOME%/lstart
