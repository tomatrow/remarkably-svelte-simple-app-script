import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import autoPreprocess from "svelte-preprocess"
import fs from "fs"

export default defineConfig({
	build: {
		target: "esnext",
		minify: false,
		lib: {
			entry: "src/index.ts",
			formats: ["iife"],
			fileName: "bundle",
			name: "remarkableSvelteSimpleAppScript"
		},
		rollupOptions: {
			output: {
				dir: "build",
				format: "iife",
				banner: fs.readFileSync("./artifacts/banner.js"),
				globals: { fs: "fs" }
			},
			onwarn(warning) {
				if (warning.code === "MISSING_NODE_BUILTINS") return
			}
		}
	},
	plugins: [
		svelte({
			preprocess: autoPreprocess(),
			emitCss: false,
			compilerOptions: {
				discloseVersion: false,
				css: "none"
			}
		})
	]
})
