# ModbusTraining

## Client

## Server

### "Lift" -application

#### Interface

##### Coils (r/w)

Addess 0x00 -->
* bit 0 Landing call to ground floor
* bit [1-5] Landing call to n:th floor

Addess 0x01 -->
* bit 0   Enter car
* bit 1   Exit car

Addess 0x02 -->
* bit 0 Car call to ground floor
* bit [1-5] Car call to n:th floor


##### Discrete inputs (r)

Addess 0x00 -->
* bit 0 Landing call accepted

Addess 0x01 -->
* bit 0 Car in ground floor
* bit [1-5] Car in n:th floor

Addess 0x02 -->
* bit 0 Car call to ground floor accepted
* bit [1-5] Car call to n:th floor accepted
