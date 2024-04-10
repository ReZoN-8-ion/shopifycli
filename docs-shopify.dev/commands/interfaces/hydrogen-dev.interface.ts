// This is an autogenerated file. Don't edit this file manually.
export interface hydrogendev {
  /**
   * The path to the directory of the Hydrogen storefront. Defaults to the current directory where the command is run.
   */
  '--path <value>'?: string

  /**
   * The port to run the server on. Defaults to 3000.
   */
  '--port <value>'?: string

  /**
   * Runs the app in a Node.js sandbox instead of an Oxygen worker.
   */
  '--legacy-runtime'?: ''

  /**
   * Automatically generates GraphQL types for your project’s Storefront API queries.
   */
  '--codegen'?: ''

  /**
   * Specifies a path to a codegen configuration file. Defaults to `<root>/codegen.ts` if this file exists.
   */
  '--codegen-config-path <value>'?: string

  /**
   * Controls whether sourcemaps are generated. Default to `true`. Deactivate `--no-sourcemaps`.
   */
  '--sourcemap'?: ''

  /**
   * Disable rendering fallback routes when a route file doesn't exist.
   */
  '--disable-virtual-routes'?: ''

  /**
   * Enables inspector connections to the server with a debugger such as Visual Studio Code or Chrome DevTools.
   */
  '--debug'?: ''

  /**
   * The port where the inspector is available. Defaults to 9229.
   */
  '--inspector-port <value>'?: string

  /**
   * Specifies the environment to perform the operation using its handle. Fetch the handle using the `env list` command.
   */
  '--env <value>'?: string

  /**
   * Specifies the environment to perform the operation using its Git branch name.
   */
  '--env-branch <value>'?: string

  /**
   * Skip the version check when running `hydrogen dev`
   */
  '--disable-version-check'?: ''

  /**
   * Outputs more information about the command's execution.
   */
  '--verbose'?: ''
}