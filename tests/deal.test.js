import Deal from '../src/deal'

describe('Deal', function () {
  it('then', function (done) {
    (new Deal((resolve, reject) => {
      resolve(1)
    })).then(a => {
      expect(a).toEqual(1)
      done()
    })
  })
  it('reject', function (done) {
    (new Deal((resolve, reject) => {
      reject(1, 2, 3)
    })).catch(a => {
      expect(a).toEqual([1, 2, 3])
      done()
    })
  })
  it('done reject', function (done) {
    (new Deal((resolve, reject) => {
      resolve(1, 2, 3)
    })).done((a, b, c) => {
      expect(a).toEqual(1)
      expect(b).toEqual(2)
      expect(c).toEqual(3)
      done()
    })
  })
  it('done reject', function (done) {
    (new Deal((resolve, reject) => {
      reject(1, 2, 3)
    })).done((a, b, c) => {
      expect(a).toEqual(1)
      expect(b).toEqual(2)
      expect(c).toEqual(3)
      done()
    })
  })
})
