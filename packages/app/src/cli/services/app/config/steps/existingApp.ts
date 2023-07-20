/* eslint-disable eslint-comments/disable-enable-pair */
import {selectAppPrompt} from '../../../../prompts/dev.js'
import {fetchAppFromApiKey} from '../../../dev/fetch.js'
import {transition} from '../utils/transition.js'
import {ensureAuthenticatedPartners} from '@shopify/cli-kit/node/session'

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function existingApp(options: any) {
  const token = await ensureAuthenticatedPartners()
  const selectedAppApiKey = await selectAppPrompt(options.apps, options.organization.id, options.token, {
    directory: options?.directory,
  })

  const fullSelectedApp = await fetchAppFromApiKey(selectedAppApiKey, token)

  const nextOptions = {...options, fullSelectedApp}

  await transition({state: 'success', options: nextOptions})
}