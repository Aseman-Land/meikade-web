import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    server:{
      host: "0.0.0.0",
      port: 3000
    },
    build: {
      minify: 'esbuild', // Minify JavaScript using esbuild
      sourcemap: 'inline', // Generate inline sourcemaps for easier debugging (optional)
    },
    // To access env vars here use process.env.TEST_VAR
    plugins: [react()]
  });
}
