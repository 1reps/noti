const log = console.log

console.log('Arr -----------------')
const arr = [1, 2, 3]
let iter1 = arr[Symbol.iterator]()
iter1.next()
for (const a of iter1) {
  console.log(a)
}

console.log('Set -----------------')
const set = new Set([1, 2, 3])
for (const a of set) {
  // console.log(a)
}

console.log('Map -----------------')
const map = new Map([['a', 1], ['b', 2], ['c', 3]])
for (const a of map) {
  // console.log(a)
}

// log(
//   arr[Symbol.iterator]()
// )
// log(
//   set[Symbol.iterator]()
// )
// log(
//   map[Symbol.iterator]()
// )

// log(arr[Symbol.iterator]) // [Function: values]
// log(arr[Symbol.iterator]()) // Object [Array Iterator] {}

// let iterator = arr[Symbol.iterator]()
// log(iterator.next()) // { value: 1, done: false }