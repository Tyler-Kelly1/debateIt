import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from '../vite.config.js'
import { config } from 'dotenv'

config({ path: '../.env' })

export default mergeConfig(viteConfig, defineConfig({
    test: {
        environment: 'node',
    }
}))