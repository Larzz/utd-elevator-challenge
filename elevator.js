export default class Elevator {
  constructor() {
    this.currentFloor = 0
    this.stops = 0
    this.floorsTraversed = 0
    this.requests = []
    this.riders = []
  }

  dispatch(currentTime = new Date()){
    while (this.requests.length) {
      const request = this.requests[0]
      this.goToFloor(request, currentTime)
    }

    if (this.checkReturnToLobby(currentTime)) {
      this.returnToLobby()
    }
  }

  goToFloor(person, currentTime = new Date()){
    this.moveToFloor(person.currentFloor)

    this.hasPickup()

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

    if (nextDropoff) {
      return nextDropoff.dropOffFloor === this.currentFloor
    }

    return Boolean(nextPickup) && nextPickup.currentFloor === this.currentFloor
  }

  hasPickup(){
    const nextPickup = this.requests[0]

    if (nextPickup && nextPickup.currentFloor === this.currentFloor) {
      this.requests.shift()
      this.riders.push(nextPickup)
      return true
    }

    return false
  }

  hasDropoff(){
    const nextDropoff = this.riders[0]

    if (nextDropoff && nextDropoff.dropOffFloor === this.currentFloor) {
      this.riders.shift()
      return true
    }

    return false
  }

  checkReturnToLobby(currentTime = new Date()){
    return (
      !this.riders.length &&
      !this.requests.length &&
      currentTime.getHours() < 12
    )
  }

  checkReturnToLoby(currentTime = new Date()){
    return this.checkReturnToLobby(currentTime)
  }

  returnToLobby(){
    while (this.currentFloor > 0) {
      this.moveDown()
    }
  }

  returnToLoby(){
    this.returnToLobby()
  }

  moveToFloor(targetFloor){
    while (this.currentFloor < targetFloor) {
      this.moveUp()
    }

    while (this.currentFloor > targetFloor) {
      this.moveDown()
    }
  }

  reset(){
    this.currentFloor = 0
    this.stops = 0
    this.floorsTraversed = 0
    this.requests = []
    this.riders = []
  }
}
