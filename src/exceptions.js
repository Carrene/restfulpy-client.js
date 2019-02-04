
export class BaseException extends Error {
  constructor (message, fileName, lineNumber, defaultMessage = 'Unhandled Error.') {
    if (!message && defaultMessage) {
      message = defaultMessage
    }
    super(message, fileName, lineNumber)
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

export class BadCredentialsError extends BaseException {
  constructor (...args) {
    super(...args, 'Invalid or Bad Credentials.')
  }
}

export class InvalidOperationError extends BaseException {
  constructor (...args) {
    super(...args, 'Invalid Operation')
  }
}

export class AbstractBaseClassError extends BaseException {
  constructor (object, ...args) {
    super(...args, `${object.name} must be inherited first`)
  }
}

export class MethodMustOverrideError extends BaseException {
  constructor (...args) {
    super(...args, 'Method must be overridden')
  }
}
