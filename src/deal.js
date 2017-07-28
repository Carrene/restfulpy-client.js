
export default class Deal extends Promise {
  constructor (func) {
    super().constructor((resolve, reject) => {
      func((...args) => resolve(args), (...args) => reject(args))
    })
  }

  done (func) {
    this.then(args => func(...args), args => func(...args))
  }
}
