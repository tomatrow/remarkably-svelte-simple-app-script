<script lang="ts">
	import { onMount } from "svelte"

	onMount(() => {
		console.log("Child.onMount")
		return () => console.log("Child.onDestroy")
	})
</script>
