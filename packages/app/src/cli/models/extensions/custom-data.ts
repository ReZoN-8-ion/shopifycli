import {zod} from '@shopify/cli-kit/node/schema'

const metafieldTypes = [
  'boolean',
  'color',
  'date',
  'date_time',
  'dimension',
  'json',
  'money',
  'multi_line_text_field',
  'number_decimal',
  'number_integer',
  'rating',
  'rich_text_field',
  'single_line_text_field',
  'url',
  'volume',
  'weight',
]

const referenceTypes = [
  'collection_reference',
  'file_reference',
  'metaobject_reference',
  'mixed_reference',
  'page_reference',
  'product_reference',
  'variant_reference',
]

const listTypes = [
  'list.collection_reference',
  'list.color',
  'list.date',
  'list.date_time',
  'list.dimension',
  'list.file_reference',
  'list.metaobject_reference',
  'list.mixed_reference',
  'list.number_integer',
  'list.number_decimal',
  'list.page_reference',
  'list.product_reference',
  'list.rating',
  'list.single_line_text_field',
  'list.url',
  'list.variant_reference',
  'list.volume',
  'list.weight',
]

const allTypes = [...metafieldTypes, ...referenceTypes, ...listTypes] as const

const validationSchemas = {
  minimumLength: zod.object({
    name: zod.literal('min'),
    value: zod.number().int(),
  }),
  maximumLength: zod.object({
    name: zod.literal('max'),
    value: zod.number().int(),
  }),
  regex: zod.object({
    name: zod.literal('regex'),
    value: zod.string(),
  }),
  allowedDomains: zod.object({
    name: zod.literal('allowed_domains'),
    value: zod.string(),
  }),
  choices: zod.object({
    name: zod.literal('choices'),
    value: zod.array(zod.string()),
  }),
  fileTypeOptions: zod.object({
    name: zod.literal('file_type_options'),
    value: zod.array(zod.string()),
  }),
  maximumPrecision: zod.object({
    name: zod.literal('max_precision'),
    value: zod.number().int(),
  }),
  minimumDate: zod.object({
    name: zod.literal('min'),
    value: zod.string().regex(/\d{4}-\d{2}-\d{2}/),
  }),
  maximumDate: zod.object({
    name: zod.literal('max'),
    value: zod.string().regex(/\d{4}-\d{2}-\d{2}/),
  }),
  minimumDateTime: zod.object({
    name: zod.literal('min'),
    value: zod.string().regex(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
  }),
  maximumDateTime: zod.object({
    name: zod.literal('max'),
    value: zod.string().regex(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
  }),
  minimumWeight: zod.object({
    name: zod.literal('min'),
    value: zod.object({
      unit: zod.string(),
      value: zod.number().int(),
    }),
  }),
  maximumWeight: zod.object({
    name: zod.literal('max'),
    value: zod.object({
      unit: zod.string(),
      value: zod.number().int(),
    }),
  }),
  minimumVolume: zod.object({
    name: zod.literal('min'),
    value: zod.object({
      unit: zod.string(),
      value: zod.number().int(),
    }),
  }),
  maximumVolume: zod.object({
    name: zod.literal('max'),
    value: zod.object({
      unit: zod.string(),
      value: zod.number().int(),
    }),
  }),
  minimumDimension: zod.object({
    name: zod.literal('min'),
    value: zod.object({
      unit: zod.string(),
      value: zod.number().int(),
    }),
  }),
  maximumDimension: zod.object({
    name: zod.literal('max'),
    value: zod.object({
      unit: zod.string(),
      value: zod.number().int(),
    }),
  }),
  minimumInteger: zod.object({
    name: zod.literal('min'),
    value: zod.number().int(),
  }),
  maximumInteger: zod.object({
    name: zod.literal('max'),
    value: zod.number().int(),
  }),
  listMinimumInteger: zod.object({
    name: zod.literal('list.min'),
    value: zod.number().int(),
  }),
  listMaximumInteger: zod.object({
    name: zod.literal('list.max'),
    value: zod.number().int(),
  }),
  minimumDecimal: zod.object({
    name: zod.literal('min'),
    value: zod.string().regex(/\d+(\.\d+)?/),
  }),
  maximumDecimal: zod.object({
    name: zod.literal('max'),
    value: zod.string().regex(/\d+(\.\d+)?/),
  }),
  minimumScale: zod.object({
    name: zod.literal('scale_min'),
    value: zod.number(),
  }),
  maximumScale: zod.object({
    name: zod.literal('scale_max'),
    value: zod.number(),
  }),
  metaobjectDefinition: zod.object({
    name: zod.literal('metaobject_definition_id'),
    value: zod.string().regex(new RegExp('gid://shopify/MetaobjectDefinition/\\d+')),
  }),
  multipleMetaobjectDefinitions: zod.object({
    name: zod.literal('metaobject_definition_ids'),
    value: zod.array(
      zod.string().regex(new RegExp('gid://shopify/MetaobjectDefinition/\\d+')),
    ),
  }),
  jsonSchema: zod.object({
    name: zod.literal('schema'),
    // Don't bother validating JSON schema, let the server side catch it!
    value: zod.object({}).catchall(zod.any()),
  }),
} as const

const listMinMax = [
  validationSchemas.listMinimumInteger,
  validationSchemas.listMaximumInteger,
] as const

const fieldValidations = {
  date_time: zod.union([
    validationSchemas.minimumDateTime,
    validationSchemas.maximumDateTime,
  ]),
  date: zod.union([
    validationSchemas.minimumDate,
    validationSchemas.maximumDate,
  ]),
  dimension: zod.union([
    validationSchemas.minimumDimension,
    validationSchemas.maximumDimension,
  ]),
  json: validationSchemas.jsonSchema,
  'list.color': zod.union(listMinMax),
  'list.date_time': zod.union([
    validationSchemas.minimumDateTime,
    validationSchemas.maximumDateTime,
    ...listMinMax,
  ]),
  'list.date': zod.union([
    validationSchemas.minimumDate,
    validationSchemas.maximumDate,
    ...listMinMax,
  ]),
  'list.dimension': zod.union([
    validationSchemas.minimumDimension,
    validationSchemas.maximumDimension,
    ...listMinMax,
  ]),
  'list.number_decimal': zod.union([
    validationSchemas.minimumDecimal,
    validationSchemas.maximumDecimal,
    validationSchemas.maximumPrecision,
    ...listMinMax,
  ]),
  'list.number_integer': zod.union([
    validationSchemas.minimumInteger,
    validationSchemas.maximumInteger,
    ...listMinMax,
  ]),
  'list.rating': zod.union([
    validationSchemas.minimumScale,
    validationSchemas.maximumScale,
    ...listMinMax,
  ]),
  'list.single_line_text_field': zod.union([
    validationSchemas.minimumInteger,
    validationSchemas.maximumInteger,
    validationSchemas.regex,
    validationSchemas.choices,
    ...listMinMax,
  ]),
  'list.url': zod.union([
    validationSchemas.allowedDomains,
    ...listMinMax,
  ]),
  'list.volume': zod.union([
    validationSchemas.minimumVolume,
    validationSchemas.maximumVolume,
    ...listMinMax,
  ]),
  'list.weight': zod.union([
    validationSchemas.minimumWeight,
    validationSchemas.maximumWeight,
    ...listMinMax,
  ]),
  multi_line_text_field: zod.union([
    validationSchemas.minimumInteger,
    validationSchemas.maximumInteger,
    validationSchemas.regex,
  ]),
  number_decimal: zod.union([
    validationSchemas.minimumDecimal,
    validationSchemas.maximumDecimal,
    validationSchemas.maximumPrecision,
  ]),
  number_integer: zod.union([
    validationSchemas.minimumInteger,
    validationSchemas.maximumInteger,
  ]),
  rating: zod.union([
    validationSchemas.minimumScale,
    validationSchemas.maximumScale,
  ]),
  single_line_text_field: zod.union([
    validationSchemas.minimumInteger,
    validationSchemas.maximumInteger,
    validationSchemas.regex,
    validationSchemas.choices,
  ]),
  url: validationSchemas.allowedDomains,
  volume: zod.union([
    validationSchemas.minimumVolume,
    validationSchemas.maximumVolume,
  ]),
  weight: zod.union([
    validationSchemas.minimumWeight,
    validationSchemas.maximumWeight,
  ]),
  'list.product_reference': zod.union(listMinMax),
  'list.collection_reference': zod.union(listMinMax),
  'list.variant_reference': zod.union(listMinMax),
  file_reference: validationSchemas.fileTypeOptions,
  'list.file_reference': zod.union([
    validationSchemas.fileTypeOptions,
    ...listMinMax,
  ]),
  metaobject_reference: validationSchemas.metaobjectDefinition,
  'list.metaobject_reference': zod.union([
    validationSchemas.metaobjectDefinition,
    ...listMinMax,
  ]),
  mixed_reference: validationSchemas.metaobjectDefinition,
  'list.mixed_reference': zod.union([
    validationSchemas.metaobjectDefinition,
    ...listMinMax,
  ]),
  'list.page_reference': zod.union(listMinMax),
}

function commonFields(extraFields = {}) {
  const fieldsWithValidations = allTypes.map((type: typeof allTypes[number]) => {
    const rawObj = {
      key: zod.string(),
      type: zod.literal(type),
      name: zod.string(),
      description: zod.string().optional(),
      ...extraFields,
    }
    if (type in fieldValidations) {
      return zod.object({...rawObj, validations: zod.array(fieldValidations[type as keyof typeof fieldValidations]).optional()})
    } else {
      return zod.object(rawObj)
    }
  })
  // Nonsense to force TS to realize there is at least 1 element in the array
  const fieldsWithValidationsWithAtLeastOneElement = [fieldsWithValidations[0]!, ...fieldsWithValidations.slice(1)] as [typeof fieldsWithValidations[number], ...(typeof fieldsWithValidations[number])[]]
  return zod.discriminatedUnion('type', fieldsWithValidationsWithAtLeastOneElement)
}

const metafieldDefinitionSchema = commonFields({
  namespace: zod.string(),
  owner_type: zod.string(),
})

const metaobjectDefinitionSchema = zod.object({
  name: zod.string(),
  type: zod.string(),
  field_definitions: zod.array(commonFields()).optional(),
})

export const CustomDataSchema = zod.object({
  metafield_definitions: zod.array(metafieldDefinitionSchema).optional(),
  metaobject_definitions: zod.array(metaobjectDefinitionSchema).optional(),
})