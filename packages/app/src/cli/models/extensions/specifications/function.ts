import {createExtensionSpecification} from '../specification.js'
import {BaseSchema} from '../schemas.js'
import {defaultFunctionsFlavors} from '../../../constants.js'
import {zod} from '@shopify/cli-kit/node/schema'
import {joinPath} from '@shopify/cli-kit/node/path'
import {fileExists} from '@shopify/cli-kit/node/fs'

export type FunctionConfigType = zod.infer<typeof FunctionExtensionSchema>
export const FunctionExtensionSchema = BaseSchema.extend({
  build: zod.object({
    command: zod
      .string()
      .transform((value) => (value.trim() === '' ? undefined : value))
      .optional(),
    path: zod.string().optional(),
  }),
  configurationUi: zod.boolean().optional().default(true),
  ui: zod
    .object({
      enable_create: zod.boolean().optional(),
      paths: zod
        .object({
          create: zod.string(),
          details: zod.string(),
        })
        .optional(),
    })
    .optional(),
  apiVersion: zod.string(),
  input: zod
    .object({
      variables: zod
        .object({
          namespace: zod.string(),
          key: zod.string(),
        })
        .optional(),
    })
    .optional(),
})

const spec = createExtensionSpecification({
  identifier: 'function',
  additionalIdentifiers: [
    'order_discounts',
    'cart_checkout_validation',
    'cart_transform',
    'delivery_customization',
    'payment_customization',
    'product_discounts',
    'shipping_discounts',
    'fulfillment_constraints',
  ],
  surface: 'admin',
  schema: FunctionExtensionSchema,
  supportedFlavors: defaultFunctionsFlavors,
  partnersWebIdentifier: 'function',
  graphQLType: 'function',
  appModuleFeatures: (_) => ['function', 'bundling'],
  findEntryPath: async (directory) => {
    return (
      await Promise.all(
        ['src/index.js', 'src/index.ts', 'src/main.rs']
          .map((relativePath) => joinPath(directory, relativePath))
          .map(async (sourcePath) => ((await fileExists(sourcePath)) ? sourcePath : undefined)),
      )
    ).find((sourcePath) => sourcePath !== undefined)
  },
})

export default spec