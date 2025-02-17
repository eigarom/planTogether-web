import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		sourcemap: true // Enable source maps
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'vue': 'vue/dist/vue.esm-bundler'
		}
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				rewrite: (path) => path.replace(/^\/api/, ''),
			}
		}
	}
})
