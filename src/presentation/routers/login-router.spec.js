const LoginRouter = require('./LoginRouter')
const MissingParamError = require('../helpers/missing-param-error')

// Evitar quando mudar a instancia de uma classe quebre todos
// os testes
const makeSut = () => {
  // Classe mocada
  class AuthUseCaseSpy {
    auth (email, password) {
      this.email = email
      this.password = password
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()

  // Injeção de dependencia
  const sut = new LoginRouter(authUseCaseSpy)

  return {
    sut,
    authUseCaseSpy
  }
}

describe('login router', () => {
  test('Should return 400 if no email is provider', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provider', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'iago@email.com'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 500 if no httpRequest is provider', () => {
    const { sut } = makeSut()
    const httpResponse = sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if no httpRequest has no body', () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should call AuthUseCase with correct params', () => {
    const { authUseCaseSpy, sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'iago@email.com',
        password: '12345678'
      }
    }
    sut.route(httpRequest)

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('Should return 401 when invalid credential are provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'invalid_mail@mail.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
  })
})
