import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: { manualChunks: { three: ['three'] } },
    },
  },
  server: {
    // Private reference exports should not be retrievable from the local server.
    fs: { deny: ['.env', '.env.*', '**/.git/**', '**/research/**'] },
  },
});
