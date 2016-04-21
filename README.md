# ModbusTraining

## Client

## Server

### "Lift" -application

#### Interface

##### Coils (r/w)

Addess 0x00 - 0x05-->
* bit 0 Landing call to ground floor
* bit [1-5] Landing call to n:th floor

Addess 0x06 -0x0B -->
* bit 0 Car call to ground floor
* bit [1-5] Car call to n:th floor


##### Discrete inputs (r)

Addess 0x00 -->
* bit 0 Landing call accepted

Addess 0x01 -->
* bit 1 Car in ground floor
* bit [2-6] Car in n:th floor

Addess 0x07 -->
* bit 7 Car call to ground floor accepted
* bit [8-12] Car call to n:th floor accepted
