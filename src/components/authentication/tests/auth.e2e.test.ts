import request from 'supertest'
import { randEmail, randPassword } from '@ngneat/falso'
import bcrypt from 'bcryptjs'
import createApp from '../../../entrypoints/api'
import { UserRepository } from '../../users/repositories/user.repository'
import { setupUser } from '../../users/tests/user.seeder'
import { getTestClient } from './client.seeder'

describe('Test authentication', () => {
  const app = createApp()

  describe('Login', () => {
    it('should return 400 when authentication fails', async () => {
      const client = await getTestClient()

      const response = await request(app)
        .post('/api/auth/token')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(new URLSearchParams({
          client_id: client.uuid,
          client_secret: client.secret,
          grant_type: 'password',
          scope: 'read write',
          username: randEmail(),
          password: randPassword()
        }).toString())

      expect(response.status).toBe(400)
    })

    it('should return 200 when authentication succeeds', async () => {
      const client = await getTestClient()
      const { user } = await setupUser()

      const userRepository = new UserRepository()

      user.password = await bcrypt.hash('password', 10)

      await userRepository.save(user)

      const response = await request(app)
        .post('/api/auth/token')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(new URLSearchParams({
          client_id: client.uuid,
          client_secret: client.secret,
          grant_type: 'password',
          scope: 'read write',
          username: user.email,
          password: 'password'
        }).toString())

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('access_token')
    })

    it('should return 400 with invalid scope', async () => {
      const client = await getTestClient()
      const { user } = await setupUser()

      const userRepository = new UserRepository()

      user.password = await bcrypt.hash('password', 10)

      await userRepository.save(user)

      const response = await request(app)
        .post('/api/auth/token')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(new URLSearchParams({
          client_id: client.uuid,
          client_secret: client.secret,
          grant_type: 'password',
          scope: 'read write admin',
          username: user.email,
          password: 'password'
        }).toString())

      expect(response.status).toBe(400)
      expect(response.body.error_description).toBe('Invalid scope')
    })
  })

  describe('Revoke', () => {
    it('should return 401 when authentication fails', async () => {
      const response = await request(app)
        .post('/api/auth/revoke')

      expect(response.status).toBe(401)
    })

    it('should return 200 when authentication succeeds', async () => {
      const client = await getTestClient()
      const { user } = await setupUser()

      const userRepository = new UserRepository()

      user.password = await bcrypt.hash('password', 10)

      await userRepository.save(user)

      const tokenResponse = await request(app)
        .post('/api/auth/token')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(new URLSearchParams({
          client_id: client.uuid,
          client_secret: client.secret,
          grant_type: 'password',
          scope: 'read write',
          username: user.email,
          password: 'password'
        }).toString())

      const response = await request(app)
        .post('/api/auth/revoke')
        .set('Authorization', `Bearer ${tokenResponse.body.access_token as string}`)
        .send(new URLSearchParams({
          refreshToken: tokenResponse.body.refresh_token as string
        }).toString())

      expect(response.status).toBe(200)
    })
  })

  describe('Userinfo', () => {
    it('should return 401 when authentication fails', async () => {
      const response = await request(app)
        .get('/api/auth/userinfo')

      expect(response.status).toBe(401)
    })

    it('should return 200 when authentication succeeds', async () => {
      const { token } = await setupUser()

      const response = await request(app)
        .get('/api/auth/userinfo')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('uuid')
    })

    it('should return 403 when scope is missing', async () => {
      const client = await getTestClient()
      const { user } = await setupUser()

      const userRepository = new UserRepository()

      user.password = await bcrypt.hash('password', 10)

      await userRepository.save(user)

      const tokenResponse = await request(app)
        .post('/api/auth/token')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(new URLSearchParams({
          client_id: client.uuid,
          client_secret: client.secret,
          grant_type: 'password',
          scope: 'write',
          username: user.email,
          password: 'password'
        }).toString())

      const response = await request(app)
        .get('/api/auth/userinfo')
        .set('Authorization', `Bearer ${tokenResponse.body.access_token as string}`)

      expect(response.status).toBe(403)
      expect(response.body.errors[0].code).toBe('missing_scope')
    })
  })
})
