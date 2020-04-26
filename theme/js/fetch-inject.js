/**
 * Fetch Inject module. (https://habd.as/post/managing-async-dependencies-javascript/)
 *
 * @module fetchInject
 * @license Zlib
 * @param {(USVString|USVString[]|Request|Request[])} input Resources you wish to fetch.
 * @param {Promise} [promise] A promise to await before attempting injection.
 * @throws {Promise<ReferenceError>} Rejects with error when given no arguments.
 * @throws {Promise<TypeError>} Rejects with error on invalid arguments.
 * @throws {Promise<Error>} Whatever `fetch` decides to throw.
 * @throws {SyntaxError} Via DOM upon attempting to parse unexpected tokens.
 * @returns {Promise<Object[]>} A promise which resolves to an `Array` of
 *     Objects containing `Response` `Body` properties used by the module.
 */
const fetchInject = function(input, promise) {
	if (!input)
		throw new ReferenceError("No input argument was provided")
	if (!(input.constructor === Array || input.constructor === String))
		throw new TypeError("Expected a String on an Array")
	if (promise && promise.constructor !== Promise)
		throw new TypeError("Expected a Promise or nothing")

	const inputs = Array.isArray(input) ? input : [input]
	const resources = []
	const deferreds = promise ? [].concat(promise) : []
	//const deferreds = promise ? [].concat.apply([], promise) : []
	const thenables = []
	const inject = (parentNode, tag, resource, resolve) => {
		var elem = document.createElement(tag)
		var siblings = parentNode.getElementsByTagName(tag)
		elem.appendChild(document.createTextNode(resource.text))

		elem.addEventListener('load', listener = () => {
			this.removeEventListener('load', listener)
			resolve(elem)
		})
		/*
		elem.addEventListener('error', listener = () => {
			this.removeEventListener('error', listener)
			reject(elem)
		})
		*/

		if (siblings.length) {
			sibling = siblings[siblings.length - 1]
			sibling.parentNode.insertBefore(elem, sibling.nextSibling)
		}
		else parentNode.appendChild(elem)
	}

	inputs.forEach(input => deferreds.push(
		window.fetch(input).then(res => {
			return [res.clone().text(), res.blob()]
		}).then(promises => {
			return Promise.all(promises).then(resolved => {
				console.log('Fetched: ', input)
				resources.push({ text: resolved[0], blob: resolved[1], file: input })
			})
		})
		.catch((e) => {
			return Promise.reject(
				new Error('Fetch failed for ', input)
			)
		})
	))

	return Promise.all(deferreds).then(() => {
		console.log('Promise.all - ', inputs.join(', '))
		resources.forEach(resource => {
			thenables.push({
				then: resolve => {
					console.log('Injecting: ', resource.file)
					resource.blob.type.includes('text/css')
						? inject(document.head, 'style', resource, resolve)
						: inject(document.head, 'script', resource, resolve)
				}
			})
		})
		return Promise.all(thenables)
	})
}

//(function () {
//	if (!window.fetch) return;
	fetchInject([
		'/theme/js/prism/prism-local.css'
	], fetchInject([
		'/theme/js/prism/plugins/copy-to-clipboard/prism-copy-to-clipboard.js'
	], fetchInject([
		'/theme/js/prism/plugins/autoloader/prism-autoloader.js',
		'/theme/js/prism/plugins/toolbar/prism-toolbar.js',
		'/theme/js/prism/plugins/toolbar/prism-toolbar.css'
	], fetchInject([
		'/theme/js/clipboard/clipboard.js',
		'/theme/js/prism/components/prism-core.js',
		'/theme/js/prism/prism.css'
	]))))
	.then(() => {
		console.log('All dependencies were satisfied')
		Prism.plugins.autoloader.languages_path = '/theme/js/prism/components/'
		Prism.plugins.autoloader.use_minified = false
		/*
		Prism.hooks.add('before-highlight', (env) => {
			env.element.className += ' line-numbers'
		})
		*/
		Prism.highlightAll(/* async, callback */)
	})
	.catch((e) => {
		console.log('Something went wrong: ', e.toString())
	})
//})()
