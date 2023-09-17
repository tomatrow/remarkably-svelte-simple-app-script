import { execSync } from "child_process"

let exec: (value: string) => string = () => { throw new Error() }

export function setExec(newExec: (value: string) => string) {
	exec = newExec
}

export interface Rect {
	x: number 
	y: number 
	width: number
	height: number
}

type WidgetType = "label" | "paragraph" | "button" | "textinput" | "textarea"
type JustifyType = 'left' | 'center' | 'right'

const PROBLEM_LETTERS = "ěščřžýáíéúů"

const diacriticsRepair = (text: string): string => {
	// Handle diacritics and other problem characters
	if (!text) return ""
	let i = 0
	for (const letter of text) {
		if (PROBLEM_LETTERS.toUpperCase().includes(letter)) {
			if (i !== 0) {
				text = text.slice(0, i) + letter.toLowerCase() + text.slice(i + 1)
			} else {
				text = letter.toLowerCase() + text.slice(i + 1)
			}
		}
		i++
	}
	if (PROBLEM_LETTERS.includes(text.slice(-1))) {
		text += "."
	}
	return text
}

interface LabelProps {
	rect: Rect
	text: string
	id: string
	fontSize?: number
	justify?: string
}

export class Label implements LabelProps {
	rect: Rect
	text: string
	id: string
	fontSize?: number
	justify?: string
	
	constructor({ rect, text, id, fontSize, justify }: LabelProps) {
		this.rect =  rect
		this.text = diacriticsRepair(text)
		this.id = id
		this.fontSize = fontSize
		this.justify = justify
	}

	_toString(type: WidgetType): string {
		let tempId = this.id ? `:${this.id}` : ""
		let tempText = this.text ? ` ${this.text}` : ""
		let toReturn = `${type}${tempId} ${this.rect.x} ${this.rect.y} ${this.rect.width} ${this.rect.height}${tempText}`
		if (type === "paragraph" || type === "textarea") {
			toReturn = `[${toReturn}]`
		}
		if (this.fontSize !== undefined) {
			toReturn = `${new FontSize(this.fontSize)}\n${toReturn}`
		}
		if (this.justify !== undefined) {
			toReturn = `${new Justify(this.justify)}\n${toReturn}`
		}
		return toReturn
	}

	toString(): string {
		return this._toString("label")
	}
}

export class Paragraph extends Label {
	toString() {
		return this._toString("paragraph")
	}
}

export class Button extends Label {
	toString() {
		return this._toString("button")
	}
}

export class TextInput extends Label {
	toString() {
		return this._toString("textinput")
	}
}

export class TextArea extends Label {
	toString() {
		return this._toString("textarea")
	}
}

interface ImageProps {
	rect: Rect
	path: string
	id: string
}

export class Image implements ImageProps {
	rect: Rect
	path: string
	id: string
	
	constructor({ rect, path, id } : ImageProps) {
		this.rect = rect
		this.path = path
		this.id = id
	}

	toString(): string {
		const tempId = this.id ? `:${this.id}` : ""
		return `image${tempId} ${this.rect.x} ${this.rect.y} ${this.rect.width} ${this.rect.height} ${this.path}`
	}
}

interface RangeProps {
	rect: Rect
	min: number
	max: number
	value: number
	id: string
}

class Range implements RangeProps {
	rect: Rect
	min: number
	max: number
	value: number
	id: string
	
	constructor({ rect, min, max, value, id }: RangeProps) {
		this.rect = rect
		this.min = min
		this.max = max
		this.value = value
		this.id = id
	}

	toString(): string {
		const tempId = this.id ? `:${this.id}` : ""
		return `range${tempId} ${this.rect.x} ${this.rect.y} ${this.rect.width} ${this.rect.height} ${this.min} ${this.max} ${this.value}`
	}
}

class FontSize {
	size: number
	constructor(size: number) {
		this.size = size
	}
	toString(): string {
		return `@fontsize ${this.size}`
	}
}

class Justify {
	justify: string

	constructor(justify: string) {
		this.justify = justify
	}
	toString(): string {
		return `@justify ${this.justify}`
	}
}

class Timeout {
	timeout: number

	constructor(timeout: number) {
		this.timeout = timeout
	}
	toString(): string {
		return `@timeout ${this.timeout}`
	}
}

class NoClear {
	toString(): string {
		return "@noclear"
	}
}

function parseOutput(output: string): [string, string | null] {
	if (output.startsWith('selected:')) {
		const button = output.slice(10).trim()
		return [button, null]
	} else if (output.startsWith('input:') || output.startsWith('range:')) {
		const [name, input] = output.slice(7).split(' : ')
		return [name, input.trim()]
	}
	return ['', null]
}

function passToSimple(input: string | string[], simplePath = '/opt/bin/simple'): [string, string | null] {
	const toPass = Array.isArray(input) ? input.join('\n') : input
	const result = exec(`"${toPass}" | ${simplePath}`)
	return parseOutput(result)
}

export type Widget = Label | Paragraph | Button | TextInput | TextArea | Image | Range
export type Directive = FontSize | Justify | Timeout | NoClear
export type Command = Widget | Directive

export class Scene {
	private commands: Command[]
	public input: [string, string | null]
	private readonly simplePath: string

	constructor(noClear = false, timeOut?: number, simplePath = '/opt/bin/simple') {
		this.commands = []
		this.input = ['', null]
		this.simplePath = simplePath
		
		if (noClear) {
			this.commands.push(new NoClear())
		}

		if (timeOut !== undefined) {
			this.commands.push(new Timeout(timeOut))
		}
	}

	add(...toDisplay: Command[]) {
		this.commands = [...this.commands, ...toDisplay]
	}

	display() {
		this.input = passToSimple(this.commands.map(command => command.toString()), this.simplePath)
	}

	remove(id: string) {
		this.commands = this.commands.filter(command => !('id' in command && command.id === id) )
	}
}
