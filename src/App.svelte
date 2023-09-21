<script lang="ts">
	import fs from "fs"
	import { onMount } from "svelte"
	import Child from "./lib/Child.svelte"

	export let showChild = false
	export let filename: string | undefined

	export function watch(newFilename: string) {
		unwatch()

		filename = newFilename
		console.log({ watch: filename })
	}

	export function unwatch() {
		if (!filename) return
		console.log({ unwatch: filename })
	}

	function handleMount() {
		console.log("hello")

		showChild = true

		setTimeout(() => (showChild = false), 1000)
	}

	function handleUnmount() {
		console.log("a good time")
	}

	onMount(() => {
		handleMount()

		return handleUnmount
	})

	const readme = fs.readFileSync("./readme.md", "utf8")

	console.log({ readme })
</script>

{#if showChild}<Child />{/if}
