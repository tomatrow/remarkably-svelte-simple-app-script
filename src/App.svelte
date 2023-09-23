<script lang="ts">
	import fs from "node:fs"
	import { onMount } from "svelte"
	import Child from "./lib/Child.svelte"

	let mounted = false
	let showChild = false

	onMount(() => {
		mounted = true
		console.log("App.onMount")

		showChild = true
		setTimeout(() => (showChild = false), 1000)

		return () => {
			mounted = false
			console.log("App.onDestroy")
		}
	})

	$: if (mounted) console.log({ readme: fs.readFileSync("./readme.md", "utf8") })
</script>

{#if showChild}<Child />{/if}
