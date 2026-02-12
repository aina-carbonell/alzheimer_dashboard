import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "vite-plugin-react-component-tagger";

export default defineConfig(({ mode }) => ({
    server: {
        host: "::0",
        port: 5173,
    },
    plugins: [react(), mode === "production" && componentTagger()].filter(Boolean),
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
}));