
export class BaseException extends Error {
  constructor (message, fileName, lineNumber, defaultMessage = undefined) {
    if (!message && defaultMessage) {
      message = defaultMessage
    }
    super(message, fileName, lineNumber)
  }
}

export class NotImplementedYetButShouldBeImplementedSoon extends BaseException {
  constructor (...args) {
    super(...args, 'Not Implemented Yet But Should Be Implemented Soon.')
  }
}

export class AlreadyAuthenticatedError extends BaseException {
  constructor (...args) {
    super(...args, 'Already Authenticated.')
  }
}

export class AuthenticationRequiredError extends BaseException {
  constructor (...args) {
    super(...args, 'Authentication Required.')
  }
}

export class BadCredentialsError extends BadCredentialsError {
  constructor (...args) {
    super(...args, 'Invalid or Bad Credentials.')
  }
}
