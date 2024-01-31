import {AppInterface, Web, isCurrentAppSchema} from '../../models/app/app.js'
import {joinPath} from '@shopify/cli-kit/node/path'
import {glob, readFile} from '@shopify/cli-kit/node/fs'
import {renderWarning} from '@shopify/cli-kit/node/ui'
import {captureOutput} from '@shopify/cli-kit/node/system'
import {decodeToml} from '@shopify/cli-kit/node/toml'

interface RemixRoute {
  path: string
  children?: RemixRoute[]
}

function flattenedRemixRoutes(routes: RemixRoute[]): RemixRoute[] {
  return routes.reduce((flatRoutes: RemixRoute[], route: RemixRoute) => {
    if (typeof route.path === 'string') flatRoutes.push(route)
    flatRoutes.push(...flattenedRemixRoutes(route.children ?? []))
    return flatRoutes
  }, [])
}

async function usesLocalStorage(remixApp: Web): Promise<boolean> {
  const target = joinPath(remixApp.directory, '*/**.{js,ts}')
  const sourceFiles = await glob(target, {ignore: ['**.d.ts', '**.test.ts']})
  for await (const file of sourceFiles) {
    const fileContents = await readFile(file)
    if (fileContents.includes('localStorage')) {
      return true
    }
  }
  return false
}

export async function lintRemix(app: AppInterface, remixApp: Web): Promise<void> {
  const serverPath = joinPath(remixApp.directory, 'app/shopify.server.{js,ts}')
  let serverFiles = await glob(serverPath, {ignore: ['**.d.ts', '**.test.ts']})
  if (serverFiles.length > 0) {
    const fileContents = await readFile(serverFiles[0]!)
    if (!fileContents.includes('billing')) {
      renderWarning({
        headline: 'Billing configuration not detected',
        body: [
          'Billing has not been set up for your app. Your app will not be able to charge merchants for usage in a manner compliant with app store regulations. For more information, see',
          {
            link: {
              url: 'https://shopify.dev/docs/api/shopify-app-remix/v1/apis/billing',
              label: 'Billing with Remix'
            },
          }
        ],
        reference: [
          {
            link: {
              url: 'https://shopify.dev/docs/apps/billing',
              label: 'Billing documentation'
            },
          }
        ],
      })
    }
  }

  const remixRoutes = flattenedRemixRoutes(
    JSON.parse(
      await captureOutput(
        app.packageManager,
        [
          'exec',
          'remix',
          'routes',
          app.packageManager === 'npm' ? '--' : '',
          '--json',
        ],
        {cwd: remixApp.directory}
      ),
    ),
  )

  const appConfig = decodeToml(await readFile(joinPath(app.directory, 'shopify.app.toml'))) as {
    application_url: string
    auth?: {redirect_urls?: string[]}
    embedded: boolean
  }

  if (isCurrentAppSchema(app.configuration)) {
    function pathMatches(routePath: string, concretePath: string): boolean {
      return new RegExp(`^/?${routePath.replace(/\/\*$/, '.*')}$`).test(concretePath)
    }

    const appHomePath = new URL(appConfig.application_url).pathname
    const appHomeRemixRoute = remixRoutes.find(({path}) => pathMatches(path, appHomePath))
    if (!appHomeRemixRoute) {
      renderWarning({
        headline: 'Application URL does not match any routes',
        body: [
          'The application URL you have configured does not match any of the routes in your app. This means that when a merchant installs your app, they will see an error page.',
        ],
      })
    } else {
      // We have a match, but we need to check if it uses OAuth
      console.log(appHomeRemixRoute)
    }

    const oauthCallbackPaths = appConfig.auth?.redirect_urls?.map((url) => new URL(url).pathname)
    if (oauthCallbackPaths) {
      if (!oauthCallbackPaths.some((url) => remixRoutes.some(({path}) => pathMatches(path, url)))) {
        renderWarning({
          headline: 'OAuth callback URLs not handled',
          body: [
            'Your app does not contain a handler for the registered OAuth callback URL(s). You must implement OAuth to authenticate merchants. For more information, see',
            {
              link: {
                url: 'https://shopify.dev/docs/api/shopify-app-remix/v2/authenticate/admin',
                label: 'Authentication with Remix'
              },
            }
          ],
          reference: [
            {
              link: {
                url: 'https://shopify.dev/docs/apps/auth',
                label: 'Authentication and authorization overview'
              },
            }
          ],
        })
      }
    }
  }

  if (appConfig.embedded === true) {
    if (await usesLocalStorage(remixApp)) {
      renderWarning({
        headline: 'Use of local storage detected',
        body: [
          'Embedded apps should not use local storage. For more information, see',
          {
            link: {
              url: 'https://shopify.dev/docs/apps/store/requirements#a-embedding-into-the-shopify-admin',
              label: 'Embedding into the Shopify admin',
            },
          },
        ],
        reference: [
          {
            link: {
              url: 'https://shopify.dev/docs/apps/store/requirements',
              label: 'Requirements for apps in the Shopify App Store',
            },
          },
        ],
      })
    }
  }
}