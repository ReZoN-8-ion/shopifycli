import {selectApp} from '../select-app.js'
import {AppInterface, getAppScopes, isLegacyAppSchema} from '../../../models/app/app.js'
import {OutputMessage, outputContent, outputToken} from '@shopify/cli-kit/node/output'

type Format = 'json' | 'text'

export async function showEnv(app: AppInterface): Promise<OutputMessage> {
  return outputEnv(app, 'text')
}

export async function outputEnv(app: AppInterface, format: Format): Promise<OutputMessage> {
  const selectedApp = await selectApp()

  if (format === 'json') {
    return outputContent`${outputToken.json({
      SHOPIFY_API_KEY: selectedApp.apiKey,
      SHOPIFY_API_SECRET: selectedApp.apiSecretKeys[0]?.secret,
      SCOPES: isLegacyAppSchema(app.configuration)
        ? app.configuration.scopes
        : app.configuration.access_scopes?.scopes ?? '',
    })}`
  } else {
    return outputContent`
    ${outputToken.green('SHOPIFY_API_KEY')}=${selectedApp.apiKey}
    ${outputToken.green('SHOPIFY_API_SECRET')}=${selectedApp.apiSecretKeys[0]?.secret ?? ''}
    ${outputToken.green('SCOPES')}=${getAppScopes(app.configuration)}
  `
  }
}
