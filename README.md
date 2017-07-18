# P4-Management-over-Netkit
A managing application that allows to control P4 switches in a Netkit environment.

## To do
Master and Slaves are on the same LAN. Master is 10.255.0.1, slaves are from .2 to .254, all on port 1337. 

- Master:
  - /detect -> does get requests to Slaves. If they respond they are added as subscribers (the list is emptied before). 
  - /subscribe -> adds the ip of the request to the subscribers.
  - /update -> shows a form and the subsequent post is sent to all subscribers in order to compile and run the p4 and cpp code attached.
  
- Slave:
  - automatic get to master/subscribe on startup
  - /update -> attached files are copied, P4 processes are killed and the new file is compiled and run.