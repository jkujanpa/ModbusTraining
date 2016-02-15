# ModbusTraining

## Server

### "Lift" -application

#### Interface

##### Coils (r/w)

Addess 0x00 -->
bit 0   Landing call to ground floor
bit 1   Landing call to 1st floor
bit 2   Landing call to 2nd floor
bit 3   Landing call to 3rd floor
bit 4   Landing call to 4th floor
bit 5   Landing call to 5th floor

Addess 0x01 -->
bit 0   Enter car
bit 1   Exit car

Addess 0x02 -->
bit 0   Car call to ground floor
bit 1   Car call to 1st floor
bit 2   Car call to 2nd floor
bit 3   Car call to 3rd floor
bit 4   Car call to 4th floor
bit 5   Car call to 5th floor


##### Discrete inputs (r)

Addess 0x00 -->
bit 0   Landing call accepted

Addess 0x01 -->
bit 0   Car in ground floor
bit 1   Car in 1st floor
bit 2   Car in 2nd floor
bit 3   Car in 3rd floor
bit 4   Car in 4th floor
bit 5   Car in 5th floor

Addess 0x02 -->
bit 0   Car call to ground floor accepted
bit 1   Car call to 1st floor accepted
bit 2   Car call to 2nd floor accepted
bit 3   Car call to 3rd floor accepted
bit 4   Car call to 4th floor accepted
bit 5   Car call to 5th floor accepted
