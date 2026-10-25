import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    css: {
        preprocessorOptions: {
            scss: {
                // Bootstrap 5 still uses Sass features that newer Sass
                // versions deprecate, so hide warnings from dependencies
                quietDeps: true,
            },
        },
    },
});
