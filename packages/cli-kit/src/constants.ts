import {join as pathJoin} from './path.js'
import {findPackageVersionUp} from './version.js'
import envPaths from 'env-paths'

const identifier = 'shopify-cli'

const cacheFolder = () => {
  if (process.env.XDG_CACHE_HOME) return process.env.XDG_CACHE_HOME
  return envPaths(identifier).cache
}

const constants = {
  environmentVariables: {
    alwaysLogAnalytics: 'SHOPIFY_CLI_ALWAYS_LOG_ANALYTICS',
    debugGoBinary: 'SHOPIFY_DEBUG_GO_BINARY',
    env: 'SHOPIFY_ENV',
    firstPartyDev: 'SHOPIFY_CLI_1P_DEV',
    identityEnv: 'SHOPIFY_IDENTITY_ENV',
    noAnalytics: 'SHOPIFY_CLI_NO_ANALYTICS',
    partnersEnv: 'SHOPIFY_PARTNERS_ENV',
    partnersToken: 'SHOPIFY_CLI_PARTNERS_TOKEN',
    runAsUser: 'SHOPIFY_RUN_AS_USER',
    shopifyEnv: 'SHOPIFY_SHOPIFY_ENV',
    spin: 'SPIN',
    spinHost: 'SPIN_HOST',
    spinInstance: 'SPIN_INSTANCE',
    spinNamespace: 'SPIN_NAMESPACE',
    spinWorkspace: 'SPIN_WORKSPACE',
    themeToken: 'SHOPIFY_CLI_THEME_TOKEN',
    unitTest: 'SHOPIFY_UNIT_TEST',
    verbose: 'SHOPIFY_FLAG_VERBOSE',
  },
  paths: {
    executables: {
      dev: '/opt/dev/bin/dev',
    },
    directories: {
      cache: {
        path: () => {
          return cacheFolder()
        },
        vendor: {
          path: () => {
            return pathJoin(cacheFolder(), 'vendor')
          },
          binaries: () => {
            return pathJoin(cacheFolder(), 'vendor', 'binaries')
          },
        },
      },
    },
  },
  versions: {
    cliKit: async () => {
      return findPackageVersionUp({fromModuleURL: import.meta.url})
    },
  },
  keychain: {
    service: 'shopify-cli',
  },
  session: {
    expirationTimeMarginInMinutes: 4,
  },
}

export const bugsnagApiKey = '9e1e6889176fd0c795d5c659225e0fae'

export default constants
