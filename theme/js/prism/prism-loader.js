window.addEventListener('DOMContentLoaded', () => {
	const loadObj = (url, tag = 'script') => {
		return new Promise((resolve, reject) => {
			var elem = document.createElement(tag)
			var parent = 'body'
			var attr = 'src'
			switch (tag) {
				case 'script':
					elem.type = 'text/javascript'
					elem.async = true
					elem.defer = true
					break
				case 'link':
					elem.type = 'text/css'
					elem.rel = 'stylesheet'
					parent = 'head'
					attr = 'href'
					break
				default:
					reject(elem)
			}

			elem.addEventListener('load', listener = () => {
				this.removeEventListener('load', listener)
				resolve(elem)
			})
			elem.addEventListener('error', listener = () => {
				this.removeEventListener('error', listener)
				reject(elem)
			})
			elem[attr] = url
			document.getElementsByTagName(parent)[0].appendChild(elem)
		})
	}

	console.log('Initialising');
	loadObj('/theme/js/prism/prism.js', 'script')
		.then(() => {
			loadObj('/theme/js/prism/prism.css', 'link')
			console.log('Loaded Prism');
			return loadObj('/theme/js/prism/plugins/autoloader/prism-autoloader.js')
		})
		.then(() => {
			console.log('Loaded Prism AutoLoader');
			Prism.plugins.autoloader.languages_path = '/theme/js/prism/components/';
			Prism.plugins.autoloader.use_minified = false;
			Prism.hooks.add('before-highlight', (env) => {
				env.element.className += ' line-numbers';
			});
			return loadObj('/theme/js/clipboard/clipboard.js')
		})
		.then(() => {
			console.log('Loaded ClipboardJS');
			return loadObj('/theme/js/prism/plugins/toolbar/prism-toolbar.js')
		})
		.then(() => {
			loadObj('/theme/js/prism/plugins/toolbar/prism-toolbar.css', 'link')
			console.log('Loaded Prism Toolbar');
			return loadObj('/theme/js/prism/plugins/copy-to-clipboard/prism-copy-to-clipboard.js')
		})
		.then(() => {
			console.log('Loaded Copy to Clipboard');
/*
			loadObj('/theme/js/prism/plugins/command-line/prism-command-line.js')
			loadObj('/theme/js/prism/plugins/command-line/prism-command-line.css', 'link')
			loadObj('/theme/js/prism/plugins/file-highlight/prism-file-highlight.js')
			loadObj('/theme/js/prism/plugins/line-highlight/prism-line-highlight.js')
			loadObj('/theme/js/prism/plugins/line-highlight/prism-line-highlight.css', 'link')
			loadObj('/theme/js/prism/plugins/line-numbers/prism-line-numbers.js')
			loadObj('/theme/js/prism/plugins/line-numbers/prism-line-numbers.css', 'link')
			loadObj('/theme/js/prism/plugins/normalize-whitespace/prism-normalize-whitespace.js')
*/
			console.log('Finished Loading')
			Prism.highlightAll(/* async, callback */)
		})
		.catch((error) => {
			console.log('failure:', error);
		});
})
