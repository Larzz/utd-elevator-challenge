export default class Elevator {
  constructor() {
    this.currentFloor = 0
    this.stops = 0
    this.floorsTraversed = 0
    this.requests = []
    this.riders = [] // riders are the people in the elevator
  }


  dispatch(currentTime = new Date()){ // dispatch is the function that dispatches the elevator to the floor
    while (this.requests.length) {
      const request = this.requests[0]
      this.goToFloor(request, currentTime)
    }

    if (this.checkReturnToLobby(currentTime)) {
      this.returnToLobby()
    }
  }

  goToFloor(person, currentTime = new Date()){ // goToFloor is the function that goes to the floor
    this.moveToFloor(person.currentFloor)

    this.hasPickup() // hasPickup is the function that checks if the elevator has a pickup

    this.moveToFloor(person.dropOffFloor)

    this.hasDropoff()

    if (this.checkReturnToLobby(currentTime)) {
      this.returnToLobby()
    }
  }

  moveUp(){
    this.currentFloor++
    this.floorsTraversed++
    if(this.hasStop()){
      this.stops++
    }    
  }

  moveDown(){
    if(this.currentFloor > 0){      
      this.currentFloor--
      this.floorsTraversed++
      if(this.hasStop()){
        this.stops++
      }
    }
  }

  hasStop(){
    const nextPickup = this.requests[0]
    const nextDropoff = this.riders[0]

    if (nextDropoff) { // if the next rider is dropping off, check if the dropoff floor is the current floor
      return nextDropoff.dropOffFloor === this.currentFloor
    }

    return Boolean(nextPickup) && nextPickup.currentFloor === this.currentFloor
  }

  hasPickup(){
    const nextPickup = this.requests[0]

    if (nextPickup && nextPickup.currentFloor === this.currentFloor) {
      this.requests.shift()
      this.riders.push(nextPickup) // add the person to the riders array  
      return true
    }

    return false
  }

  hasDropoff(){
    const nextDropoff = this.riders[0]

    if (nextDropoff && nextDropoff.dropOffFloor === this.currentFloor) {
      this.riders.shift() // remove the person from the riders array
      return true
    }

    return false
  }

  checkReturnToLobby(currentTime = new Date()){
    return (
      !this.riders.length && // if there are no riders, return true
      !this.requests.length && // if there are no requests, return true
      currentTime.getHours() < 12 // if the current time is before noon, return true
    )
  }

  checkReturnToLoby(currentTime = new Date()){
    return this.checkReturnToLobby(currentTime)
  }

  // 
  returnToLobby(){
    while (this.currentFloor > 0) {
      this.moveDown() // move the elevator down
    }
  }

  returnToLoby(){
    this.returnToLobby() // return the elevator to the lobby
  }

  moveToFloor(targetFloor){
    while (this.currentFloor < targetFloor) {
      this.moveUp() // move the elevator up
    }

    while (this.currentFloor > targetFloor) {
      this.moveDown() // move the elevator down
    }
  }

  reset(){
    this.currentFloor = 0
    this.stops = 0
    this.floorsTraversed = 0
    this.requests = [] // reset the requests array
    this.riders = [] // reset the riders array
  }
}
