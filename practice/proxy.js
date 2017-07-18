
class MyClass {
  constructor (data) {
    this.data = {
      'a': 1,
      'b': 2
    }
  }
}

let handler = {
  get: function (target, name) {
    if (name in target.data) {
      return target.data[name]
    } else {
      return 37
    }
  }
}

let instance = new MyClass()

let c = new Proxy(instance, handler)

console.log(c.a)
console.log(c.b)
console.log(c.c)
