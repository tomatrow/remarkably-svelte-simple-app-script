import App from "./App.svelte"

const target = new Proxy(
	{},
	{
		get(_, key) {
			throw new Error(`Trid to access property on faux render target - ${String(key)}`)
		}
	}
) as Element

const app = new App({ target })

export default app
