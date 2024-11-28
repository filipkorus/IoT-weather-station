// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
       react(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: false, // Enable during development
            },
            manifest: {
                name: 'Ski Weather Station',
                short_name: 'Ski Weather',
                description: 'Stacja pogodowa dla stoków narciarskich',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                icons: [
                    {
                        "src": "/icons/pwa-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png",
                        "purpose": "any"
                    },
                    {
                        "src": "/icons/pwa-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "any"
                    },
                    {
                        "src": "/icons/pwa-maskable-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png",
                        "purpose": "maskable"
                    },
                    {
                        "src": "/icons/pwa-maskable-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "maskable"
                    }
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            // Map the custom paths to their respective directories
            "@/api": "/src/api",
            "@/assets": "/src/assets",
            "@/components": "/src/components",
            "@/config": "/src/config",
            "@/context": "/src/context",
            "@/hooks": "/src/hooks",
            "@/pages": "/src/pages",
            "@/styles": "/src/styles",
            "@/theme": "/src/theme",
            "@/types": "/src/types",
            "@/utils": "/src/utils",
            "@/store": "/src/store",
            "@/services": "/src/services",
        },
    },
    server: {
        open: true, // Open the browser when starting Vite development server
    },
    build: {
        // Your build configuration options here
    },
});
