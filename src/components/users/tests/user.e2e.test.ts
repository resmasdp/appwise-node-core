import { randEmail, randUuid } from '@ngneat/falso'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import createApp from '../../../entrypoints/api'
import { Role } from '../models/user.model'
import { UserRepository } from '../repositories/user.repository'
import { createRandomUser, setupUser } from './user.seeder'

describe('Test users', () => {
  const app = createApp()

  describe('Get users', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/users')

      expect(response.status).toBe(401)
    })

    it('should return users', async () => {
      await createRandomUser({ save: true })

      const { token } = await setupUser()

      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
    })
  })

  describe('Get user', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${randUuid()}`)

      expect(response.status).toBe(401)
    })

    it('should return 404 when user not found', async () => {
      const { token } = await setupUser()

      const response = await request(app)
        .get(`/api/v1/users/${randUuid()}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(404)
    })

    it('should return 400 when invalid uuid', async () => {
      const { user, token } = await setupUser()

      const response = await request(app)
        .get(`/api/v1/users/${user.uuid}s`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(400)
    })

    it('should return user', async () => {
      const { user, token } = await setupUser()

      const response = await request(app)
        .get(`/api/v1/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
    })

    it('should return 403 when user is not admin', async () => {
      const { token } = await setupUser()

      const user = await createRandomUser({ save: true })

      const response = await request(app)
        .get(`/api/v1/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(403)
    })

    it('should return user when user is admin', async () => {
      const { token } = await setupUser(Role.ADMIN)

      const user = await createRandomUser({ save: true })

      const response = await request(app)
        .get(`/api/v1/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
    })
  })

  describe('Create user', () => {
    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({})

      expect(response.status).toBe(400)
    })

    it('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({
          email: randEmail()
        })

      expect(response.status).toBe(400)
    })

    it('should return 200', async () => {
      const dto = await createRandomUser()

      const response = await request(app)
        .post('/api/v1/users')
        .send(dto)

      expect(response.status).toBe(200)
    })
  })

  describe('Update user', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post(`/api/v1/users/${randUuid()}`)
        .send({})

      expect(response.status).toBe(401)
    })

    it('should return 200 when user is self', async () => {
      const { user, token } = await setupUser()

      const response = await request(app)
        .post(`/api/v1/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'John',
          lastName: 'Doe'
        })

      expect(response.status).toBe(200)
    })

    it('should return 404 when user not found', async () => {
      const { token } = await setupUser()

      const response = await request(app)
        .post(`/api/v1/users/${randUuid()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})

      expect(response.status).toBe(404)
    })

    it('should return 403 when user is not admin', async () => {
      const { token } = await setupUser()

      const user = await createRandomUser({ save: true })

      const response = await request(app)
        .post(`/api/v1/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'John',
          lastName: 'Doe'
        })

      expect(response.status).toBe(403)
    })

    it('should return 200 when user is admin', async () => {
      const { token } = await setupUser(Role.ADMIN)

      const user = await createRandomUser({ save: true })

      const response = await request(app)
        .post(`/api/v1/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'John',
          lastName: 'Doe'
        })

      expect(response.status).toBe(200)
      expect(response.body.firstName).toBe('John')
    })
  })

  describe('Delete user', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .delete(`/api/v1/users/${randUuid()}`)

      expect(response.status).toBe(401)
    })

    it('should return 404 when user not found', async () => {
      const { token } = await setupUser()

      const response = await request(app)
        .delete(`/api/v1/users/${randUuid()}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(404)
    })

    it('should return 403 when user is not admin', async () => {
      const { token } = await setupUser()

      const user = await createRandomUser({ save: true })

      const response = await request(app)
        .delete(`/api/v1/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(403)
    })

    it('should return 200 when user is admin', async () => {
      const { token } = await setupUser(Role.ADMIN)

      const user = await createRandomUser({ save: true })

      const response = await request(app)
        .delete(`/api/v1/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
    })

    it('should return 200 when user is self', async () => {
      const { user, token } = await setupUser()

      const response = await request(app)
        .delete(`/api/v1/users/${user.uuid}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
    })
  })

  describe('Change password', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post(`/api/v1/users/${randUuid()}/password`)
        .send({})

      expect(response.status).toBe(401)
    })

    it('should return 404 when user not found', async () => {
      const { token } = await setupUser()

      const response = await request(app)
        .post(`/api/v1/users/${randUuid()}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send({})

      expect(response.status).toBe(404)
    })

    it('should return 403 when user is not admin', async () => {
      const { token } = await setupUser()

      const user = await createRandomUser({ save: true })

      const response = await request(app)
        .post(`/api/v1/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send({})

      expect(response.status).toBe(403)
    })

    it('should return 200 when user is self', async () => {
      const { user, token } = await setupUser()

      const userRepository = new UserRepository()

      user.password = await bcrypt.hash('password', 10)

      await userRepository.save(user)

      const response = await request(app)
        .post(`/api/v1/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'newPassword',
          oldPassword: 'password'
        })

      expect(response.status).toBe(200)
    })

    it('should return 400 when password is missing', async () => {
      const { user, token } = await setupUser()

      const response = await request(app)
        .post(`/api/v1/users/${user.uuid}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send({})

      expect(response.status).toBe(400)
    })
  })
})
