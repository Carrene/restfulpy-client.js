
export class BaseException extends Error {
  constructor (message, fileName, lineNumber) {
    super(message, fileName, lineNumber)
  }
}

export class NotImplementedYetButShouldBeImplementedSoon extends BaseException {
  constructor (message, fileName, lineNumber) {
    if (!message) {
      message = 'Not Implemented Yet But Should Be Implemented Soon'
    }
    super(message, fileName, lineNumber)
  }
}