import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** Vite configuration kept intentionally small for easy deployment to Vercel. */
export default defineConfig({ plugins: [react()] });
