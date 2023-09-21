import { parseHTML } from "linkedom"

// every node module I use will need to be added here
import fs from "fs"

/** mock the dom
 * - svelte uses text nodes as anchors, so, we need something dom-like
 * - where jsdom and happy-dom aim for correctness, linkedom aims for speed and minimalism
 */
;(() => {
	const linkedomHTML = fs.readFileSync('./artifacts/template.html', 'utf8')
	const window = parseHTML(linkedomHTML)
	const { document } = window
 
	global.document = document
	global.window = window
	window.console = global.console
})();

// prettier-ignore
