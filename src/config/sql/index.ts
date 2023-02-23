import 'reflect-metadata'

import pg from 'pg'

pg.types.setTypeParser(1700, 'text', parseFloat)

export * from './sources/main'
