import { ApolloError } from 'apollo-server-errors'

export class ForbiddenError extends ApolloError {
    constructor(message) {
        super(message, 403)
        Object.defineProperty(this, 'name', { value: 'ForbiddenError' })
    }
}

export class BadUserInputError extends ApolloError {
    constructor(message) {
        super(message, 422)
        Object.defineProperty(this, 'name', { value: 'BadUserInputError' })
    }
}

export class AuthorizationError extends ApolloError {
    constructor(message) {
        super(message, 400)
        Object.defineProperty(this, 'name', { value: 'AuthorizationError' })
    }
}

export class InternalServerError extends ApolloError {
    constructor(message) {
        super(message, 500)
        Object.defineProperty(this, 'name', { value: 'InternalServerError' })
    }
}

export class BadRequestError extends ApolloError {
    constructor(message) {
        super(message, 400)
        Object.defineProperty(this, 'name', { value: 'BadRequestError' })
    }
}