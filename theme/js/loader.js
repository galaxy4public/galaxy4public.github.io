	const inject = (parentNode, tag, url) => new Promise((resolve, reject) => {
		var elem = document.createElement(tag)
		var siblings = parentNode.getElementsByTagName(tag)
		var attr = 'src'

		switch (tag) {
			case 'script':
				elem.defer = true
				break;
			case 'link':
				attr = 'href'
				elem.type = 'text/css'
				elem.rel = 'stylesheet'
				break
			default:
				return Promise.reject(new ReferenceError('Unknown tag specified'))
		}
		elem[attr] = url
		//elem.appendChild(document.createTextNode(resource.text))

		elem.addEventListener('load', listener => {
			this.removeEventListener('load', listener)
			resolve(elem)
		})
		elem.addEventListener('error', listener => {
			this.removeEventListener('error', listener)
			reject(elem)
		})

		if (siblings.length) {
			sibling = siblings[siblings.length - 1]
			sibling.parentNode.insertBefore(elem, sibling.nextSibling)
		}
		else parentNode.appendChild(elem)
	})

const loader = (input, promise) => {
	const inputs = Array.isArray(input) ? input : [input]
	const resources = []
	const deferreds = promise ? [].concat.apply([], Array.isArray(promise) ? promise : [promise]) : []

	inputs.forEach(input => {
		var tag
		switch (input.split('.').pop()) {
			case 'css':
				tag = 'link'
				break;
			case 'js':
				tag = 'script'
				break;
			default:
				return Promise.reject(new ReferenceError('Unknown extension'))
		}
		deferreds.push(inject(document.head, tag, input))
	})

	return Promise.all(deferreds)
}

loader([
	'/theme/css/reset.css',
	'/theme/css/fonts/Icons.css',
	'/theme/css/fonts/Exo2.css',
	'/theme/css/fonts/Oswald.css',
	'/theme/css/fonts/DancingScript.css',
	'/theme/css/fonts/FiraCode.css',
	'/theme/css/base.css',
	'/theme/js/visited.js',
	'/theme/js/service.js',
//	'/theme/js/p-fixups.js',
])
.then(() => {
	console.log('Loaded essentials')
})

// Only load PrismJS if there is something to highlight
if (document.getElementsByTagName('pre').length)
	loader([
		'/theme/js/prism/prism-local.css'
		], loader([
		'/theme/js/prism/plugins/copy-to-clipboard/prism-copy-to-clipboard.js',
		'/theme/js/prism/plugins/command-line/prism-command-line.js',
		'/theme/js/prism/plugins/command-line/prism-command-line.css',
		'/theme/js/prism/plugins/file-highlight/prism-file-highlight.js',
		'/theme/js/prism/plugins/line-highlight/prism-line-highlight.js',
		'/theme/js/prism/plugins/line-highlight/prism-line-highlight.css',
		'/theme/js/prism/plugins/line-numbers/prism-line-numbers.js',
		'/theme/js/prism/plugins/line-numbers/prism-line-numbers.css',
		'/theme/js/prism/plugins/normalize-whitespace/prism-normalize-whitespace.js'
		], loader([
		'/theme/js/prism/plugins/autoloader/prism-autoloader.js',
		'/theme/js/prism/plugins/toolbar/prism-toolbar.js',
		'/theme/js/prism/plugins/toolbar/prism-toolbar.css'
		], loader([
		'/theme/js/clipboard/clipboard.js',
		'/theme/js/prism/components/prism-core.js',
		'/theme/js/prism/prism.css'
	]))))
	.then(() => {
		console.log('PrismJS loaded')
		Prism.plugins.autoloader.languages_path = '/theme/js/prism/components/'
		Prism.plugins.autoloader.use_minified = false
		Prism.hooks.add('before-highlight', (env) => {
			var match = env.code.match(/\n(?!$)/g)
			var linesNum = match ? match.length + 1 : 1
			if (linesNum > 10)
				env.element.className += ' line-numbers'
			if (env.element.parentNode.className.includes('language-shell')) {
				env.element.parentNode.className += ' command-line'
				env.element.parentNode.dataset.prompt = '$'
			}
		})
		Prism.highlightAll(/* async, callback */)
	})

// loader('/theme/js/twitter.js').then(() => { console.log('twitter.js loaded') })

