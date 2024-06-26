// This is an autogenerated file. Don't edit this file manually.
import {ReferenceEntityTemplateSchema} from '@shopify/generate-docs'

const data: ReferenceEntityTemplateSchema = {
  name: 'app function schema',
  description: `Generates the latest [GraphQL schema](/docs/apps/functions/input-output#graphql-schema) for a function in your app. Run this command from the function directory.

  This command uses the API type and version of your function, as defined in your extension TOML file, to generate the latest GraphQL schema. The schema is written to the \`schema.graphql\` file.`,
  overviewPreviewDescription: `Fetch the latest GraphQL schema for a function.`,
  type: 'command',
  isVisualComponent: false,
  defaultExample: {
    codeblock: {
      tabs: [
        {
          title: 'app function schema',
          code: './examples/app-function-schema.example.sh',
          language: 'bash',
        },
      ],
      title: 'app function schema',
    },
  },
  definitions: [
  {
    title: 'Flags',
    description: 'The following flags are available for the `app function schema` command:',
    type: 'appfunctionschema',
  },
  ],
  category: 'app',
  related: [
  ],
}

export default data