# ModbusTraining

## Client

## Server

### "Lift" -application

#### Interface

##### Coils (r/w)

Addess 0x00 - 0x05-->
* bit 0 Landing call to ground floor
* bit [1-5] Landing call to n:th floor

Addess 0x10 -0x15 -->
* bit 10 Car call to ground floor
* bit [11-15] Car call to n:th floor

Addess 0x20 -0x25 -->
* bit 20 Enter car from ground floor
* bit [21-25] Enter car from n:th floor

Addess 0x30 -0x35 -->
* bit 30 Exit car at ground floor
* bit [31-35] Exit car at n:th floor

##### Discrete inputs (r)

Addess 0x00 -->
* bit 0 Landing call accepted

Addess 0x01 -->
* bit 1 Car in ground floor
* bit [2-6] Car in n:th floor

Addess 0x07 -->
* bit 7 Car call to ground floor accepted
* bit [8-12] Car call to n:th floor accepted
