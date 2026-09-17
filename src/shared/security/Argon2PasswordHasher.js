import argon2 from 'argon2'
import { PasswordHasher } from './PasswordHasher.js'

export class Argon2PasswordHasher extends PasswordHasher {
  async hash(password) {
    return await argon2.hash(password)
  }
  async verify(password, hash) {
    return await argon2.verify(hash, password)
  }
}
