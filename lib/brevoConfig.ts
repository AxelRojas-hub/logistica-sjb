import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo'

if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is required')
}

export const transactionalEmailsApi = new TransactionalEmailsApi()
transactionalEmailsApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)

export const BREVO_CONFIG = {
    senderEmail: 'logisticasjb1@gmail.com',
    senderName: 'Logística SJB',
    baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000'
}
