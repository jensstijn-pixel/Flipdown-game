import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Relative base so the built site works from a project subpath (GitHub Pages)
  // as well as from a domain root (Vercel).
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Everything the game needs is precached: after the first load it runs
        // with the phone in airplane mode.
        globPatterns: ['**/*.{js,css,html,woff2,png,svg,json}'],
      },
      manifest: {
        name: 'Flipdown',
        short_name: 'Flipdown',
        description: 'A two-player deduction game. Two phones, no connection.',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FAF8F3',
        theme_color: '#221E19',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
