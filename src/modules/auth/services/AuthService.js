import { User } from '../../users/models/User.js'
import { AuthenticationError } from '../../../shared/errors/AuthenticationError.js'
import { ConflictError } from '../../../shared/errors/ConflictError.js'

export class AuthService {
  constructor(userRepository, passwordHasher, tokenProvider) {
    this.userRepository = userRepository
    this.passwordHasher = passwordHasher
    this.tokenProvider = tokenProvider
  }

  async register(dto) {
    const existing = await this.userRepository.findByEmail(dto.email)
    if (existing) {
      throw new ConflictError('Email already registered')
    }
    const hash = await this.passwordHasher.hash(dto.password)
    const userRow = await this.userRepository.create({
      email: dto.email,
      passwordHash: hash,
      role: dto.role,
    })
    const user = new User(userRow)
    return {
      user,
      token: this.tokenProvider.sign({ sub: user.id, role: user.role }),
    }
  }

  async login(dto) {
    const userRow = await this.userRepository.findByEmail(dto.email)
    if (!userRow) throw new AuthenticationError('Invalid credentials')
    const user = new User(userRow)
    const valid = await this.passwordHasher.verify(
      dto.password,
      user.getPasswordHash(),
    )
    if (!valid) throw new AuthenticationError('Invalid credentials')
    if (!user.isActive()) throw new AuthenticationError('Account inactive')
    return {
      user,
      token: this.tokenProvider.sign({ sub: user.id, role: user.role }),
    }
  }

  async me(token) {
    const payload = this.tokenProvider.verify(token)
    const userRow = await this.userRepository.findByIdfindById(payload.sub)
    if (!userRow)(!userRow) throwthrow newnew AuthenticationError(AuthenticationError('UserUser notnot found')found')
    return new User(userRow)new User(userRow)
  }
}
