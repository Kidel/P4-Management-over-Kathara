@echo off

CALL docker-compose down
CALL %NETKIT_HOME%/lclean
CALL docker network rm netkit_nt_M
