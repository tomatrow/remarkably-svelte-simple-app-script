<script lang="ts">
  import fs from "fs"
  
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
  
  fs.readFileSync("./log.md", 'utf8')
</script>

<svelte:options accessors />

