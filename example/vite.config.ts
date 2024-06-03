import { defineConfig } from 'vite'
import path from 'path'
import GlobEagerAutoDeclarePlugin from '../dist/bundle.min.mjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    GlobEagerAutoDeclarePlugin(
        [
          path.resolve(__dirname, 'src/service/constant'),
          path.resolve(__dirname, 'src/common/properties'),
          {
            path: path.resolve(__dirname, 'src/service/api/modules'),
            mountedName: 'api'
          },
          {
            path: path.resolve(__dirname, 'src/service/store/modules'),
            mountedName: 'store'
          }
        ],
        path.resolve(__dirname, 'types'),
        {
          keepLog: false,
          keepCompile: true,
          nodeModulesLibs: ['pinia-plugin-persistedstate']
        }
    )
  ]
})
