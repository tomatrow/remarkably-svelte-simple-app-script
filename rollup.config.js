import svelte from "rollup-plugin-svelte"
import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import autoPreprocess from "svelte-preprocess"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import fs from "fs"

/** @type {import('rollup').RollupOptions} */
export default {
	input: "src/index.ts",
	output: {
		file: "build/bundle.js",
		format: "iife",
		sourcemap: true,
		banner: fs.readFileSync("./artifacts/banner.js"),
		globals: {
			fs: "fs"
		}
	},
	onwarn(warning) {
		if (warning.code === "MISSING_NODE_BUILTINS") return
	},
	plugins: [
		svelte({
			preprocess: autoPreprocess(),
			emitCss: false,
			compilerOptions: {
				discloseVersion: false,
				css: "none"
			}
		}),
		resolve({
			browser: false,
			exportConditions: ["svelte"],
			extensions: [".svelte"]
		}),
		commonjs({
			include: /node_modules/,
			requireReturnsDefault: "auto"
		}),
		typescript(),
		json()
	]
}
