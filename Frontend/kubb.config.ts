import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginClient } from '@kubb/plugin-client'
import { pluginReactQuery } from '@kubb/plugin-react-query'

export default defineConfig(() => ({
  input: {
    path: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') + '/v3/api-docs',
  },
  output: {
    path: './src/api',
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: { path: 'models' },
    }),
    pluginClient({
      client: 'axios',
      importPath: '@/lib/api',
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
      output: { path: 'client' },
    }),

    // 4) Gera os hooks React Query em src/api/hooks
    pluginReactQuery({
      output: { path: 'hooks' },
    }),
  ],
}))
