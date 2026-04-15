require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/
})

const assert = require('chai').assert
const Elevator = require('../elevator').default
const Person = require('../person').default

describe('Elevator', function () {
  let elevator = new Elevator()
  const morning = new Date('2020-01-01T11:00:00')
  const afternoon = new Date('2020-01-01T13:00:00')

  beforeEach(function () {
    elevator.reset()
  })

  it('should bring a rider to a floor above their current floor', () => {
    const mockUser = new Person('Brittany', 2, 5)
    elevator.requests.push(mockUser)
    elevator.goToFloor(mockUser, morning)

    assert.equal(elevator.currentFloor, 0)
    assert.equal(elevator.floorsTraversed, 10)
    assert.equal(elevator.stops, 2)
  })

  it('should bring a rider to a floor below their current floor', () => {
    const mockUser = new Person('Brittany', 8, 3)
    elevator.requests.push(mockUser)
    elevator.goToFloor(mockUser, morning)

    assert.equal(elevator.currentFloor, 0)
    assert.equal(elevator.floorsTraversed, 16)
    assert.equal(elevator.stops, 2)
  })

  it('The moveUp function should move the elevator up once', () => {
    const nextFloor = elevator.currentFloor + 1
    elevator.moveUp()

    assert.equal(elevator.currentFloor, nextFloor)
  })

  it(
    'The moveDown function should move the elevator down once until the ' +
      'bottom floor but no further',
    () => {
      elevator.currentFloor++
      const nextFloor = elevator.currentFloor - 1
      elevator.moveDown()

      assert.equal(elevator.currentFloor, nextFloor)

      elevator.currentFloor = 0
      elevator.moveDown()
      assert.equal(elevator.currentFloor, 0)
    },
  )

  it(
    'should check if the current floor of the elevator has pickup/dropoff',
    () => {
      const riderA = new Person('Bob', 4, 5)
      const riderB = new Person('John', 1, 4)
      elevator.currentFloor = elevator.floorsTraversed = 4

      elevator.requests.push(riderA)
      assert.equal(elevator.hasStop(), true)

      elevator.requests = []
      elevator.riders.push(riderB)
      assert.equal(elevator.hasStop(), true)
    },
  )

  it(
    'when checking the floor, the requesting person enters and becomes rider',
    () => {
      const request = new Person('Anne', 3, 1)
      elevator.requests.push(request)
      elevator.currentFloor = 3

      elevator.hasPickup()

      assert.equal(elevator.requests.length, 0)
      assert.equal(elevator.riders[0], request)
    },
  )

  it('dropping a person off should remove them from riders', () => {
    const rider = new Person('Anne', 1, 3)
    elevator.riders.push(rider)
    elevator.currentFloor = 3

    elevator.hasDropoff()

    assert.equal(elevator.riders.length, 0)
  })

  it('person A up, person B up should process in request order', () => {
    const personA = new Person('Oliver', 3, 6)
    const personB = new Person('Angela', 1, 5)
    elevator.requests = [personA, personB]

    elevator.dispatch(morning)

    assert.equal(elevator.stops, 4)
    assert.equal(elevator.floorsTraversed, 20)
    assert.equal(elevator.currentFloor, 0)
    assert.equal(elevator.requests.length, 0)
    assert.equal(elevator.riders.length, 0)
  })

  it('person A up, person B down should process in request order', () => {
    const personA = new Person('Beverly', 3, 6)
    const personB = new Person('James', 5, 1)
    elevator.requests = [personA, personB]

    elevator.dispatch(morning)

    assert.equal(elevator.stops, 4)
    assert.equal(elevator.floorsTraversed, 12)
    assert.equal(elevator.currentFloor, 0)
    assert.equal(elevator.requests.length, 0)
    assert.equal(elevator.riders.length, 0)
  })

  it('person A down, person B up should process in request order', () => {
    const personA = new Person('Jeanne', 7, 1)
    const personB = new Person('Karl', 2, 8)
    elevator.requests = [personA, personB]

    elevator.dispatch(morning)

    assert.equal(elevator.stops, 4)
    assert.equal(elevator.floorsTraversed, 28)
    assert.equal(elevator.currentFloor, 0)
    assert.equal(elevator.requests.length, 0)
    assert.equal(elevator.riders.length, 0)
  })

  it('person A down, person B down should process in request order', () => {
    const personA = new Person('Max', 8, 2)
    const personB = new Person('Charlie', 5, 0)
    elevator.requests = [personA, personB]

    elevator.dispatch(morning)

    assert.equal(elevator.stops, 4)
    assert.equal(elevator.floorsTraversed, 22)
    assert.equal(elevator.currentFloor, 0)
    assert.equal(elevator.requests.length, 0)
    assert.equal(elevator.riders.length, 0)
  })

  it(
    'should return to lobby with no riders and time before noon',
    () => {
      elevator.currentFloor = 5
      assert.equal(elevator.checkReturnToLobby(morning), true)
    },
  )

  it(
    'should stay on current floor with no riders and time after noon',
    () => {
      elevator.currentFloor = 5
      assert.equal(elevator.checkReturnToLobby(afternoon), false)
    },
  )

  it('should not return to lobby while requests remain queued', () => {
    elevator.currentFloor = 5
    elevator.requests.push(new Person('Anne', 8, 9))
    assert.equal(elevator.checkReturnToLobby(morning), false)
  })
})
