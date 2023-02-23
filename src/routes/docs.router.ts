import swaggerUi from 'swagger-ui-express'
import yaml from 'yamljs'
import { DTORouter } from '@appwise/express-dto-router'
import type { Router } from 'express'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const basicAuth = require('express-basic-auth')

export function docsRouter (): Router {
  const users = { appwise: 'password' }

  const router = new DTORouter()

  const doc = yaml.load('./_build/openapi.yaml')

  const options = {
    customSiteTitle: 'Node Core API',
    swaggerOptions: {
      filter: true,
      defaultModelExpandDepth: 2
    }
  }

  router.use(
    '/',
    basicAuth({ users, challenge: true }),
    swaggerUi.serve,
    swaggerUi.setup(doc, options)
  )

  return router.router
}
