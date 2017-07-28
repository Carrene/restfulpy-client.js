
export default class Deal extends Promise {
  constructor (func) {
    super((resolve, reject) => {
      func(
        function (...args) {
          Deal._call(resolve, args)
        },
        function (...args) {
          Deal._call(reject, args)
        }
      )
    })
  }

  done (func) {
    function wrapper (args) {
      if (args instanceof Array) {
        func(...args)
      } else {
        func(args)
      }
    }
    return super.then(wrapper, wrapper)
  }

  static _call (innerFunc, args) {
    if (args.length < 2) {
      innerFunc(...args)
    } else {
      innerFunc(args)
    }
  }
}
