/* istanbul ignore file */
import fs from 'fs/promises'
import path from 'path'
import Mailgun from 'mailgun.js'
import FormData from 'form-data'
import ejs from 'ejs'
import { captureException } from '@sentry/node'
import type Client from 'mailgun.js/client'
import type { User } from '../components/users/models/user.model'

export interface MailParams {
  to: string
  from: string
  subject: string
  html: string
  inline?: [{
    filename: string
    data: Buffer
  }]
}

export interface DynamicTemplateParams {
  templateName: string
  mjmlFields: { [key: string]: string }
  sendTo: User
  subject: string
  inline?: [{
    filename: string
    data: Buffer
  }]
}

class MailGunHelper {
  private readonly client: Client
  private readonly domain: string

  constructor () {
    this.client = new Mailgun(FormData).client({
      username: 'api',
      key: process.env.MAILGUN_APIKEY as string,
      url: 'https://api.eu.mailgun.net'
    })

    this.domain = process.env.MAILGUN_DOMAIN as string
  }

  public async sendEmail (email: DynamicTemplateParams): Promise<void> {
    try {
      const template = await fs.readFile(path.join(__dirname, `../../templates/html/${email.templateName}.html`), 'utf8')
      const renderedTemplate = await ejs.render(template, email.mjmlFields, { async: true })

      const params: MailParams = {
        to: email.sendTo.email,
        from: process.env.MAILGUN_SENDER as string,
        subject: email.subject,
        html: renderedTemplate,
        inline: email.inline
      }
      await this.client.messages.create(this.domain, params)
    } catch (e) {
      captureException(e)
    }
  }
}

const mailgunHelper = new MailGunHelper()

export default mailgunHelper
