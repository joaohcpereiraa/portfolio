import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {resolve, dirname} from 'path'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VERCEL ? "/" : "/portfolio/",
  resolve: {
    alias: {
      '#constants': resolve(dirname(fileURLToPath(import.meta.url)), 'src/shared/constants'),
      '#shared': resolve(dirname(fileURLToPath(import.meta.url)), 'src/shared'),
      '#bedroom': resolve(dirname(fileURLToPath(import.meta.url)), 'src/bedroom'),
      '#landing': resolve(dirname(fileURLToPath(import.meta.url)), 'src/landing'),
      '#macos': resolve(dirname(fileURLToPath(import.meta.url)), 'src/macos'),
    },
  },
})
