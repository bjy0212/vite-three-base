import { defineConfig } from "vite";

export default defineConfig({
    build: {
        target: "esnext",
        rollupOptions: {
            output: {
                manualChunks: {three: ["three"]}
            }
        }
    },
    esbuild: {
        target: "esnext",
        supported: {
            "top-level-await": true,
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            target: "esnext",
            supported: {
                "top-level-await": true
            }
        },
    },
    base: "/",
    // base: "/",
    // esbuild: {
    //     supported: {
    //         "top-level-await": true,
    //     },
    // },
});
