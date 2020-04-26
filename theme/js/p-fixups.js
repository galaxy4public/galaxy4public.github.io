(() => {
	'use strict'
	const pFix = () => {
		const paragraphs = document.getElementsByTagName('p')
		const span = document.createElement('span')
		var divider;

		for (let i = 0; i < paragraphs.length; i++) {
			var p = paragraphs[i], offsetTop, offsetBottom
			p.appendChild(span)
			offsetTop = span.offsetTop
			offsetBottom = span.offsetTop + span.offsetHeight
			p.removeChild(span)
			if (offsetTop == p.offsetTop) {
				if (!p.className.match(/\bone-liner\b/))
					p.className += (p.className != "" ? ' ' : '') + 'one-liner'
			}
			else
				p.className = p.className.replace(/\bone-liner\b/g, "")
		}
	}
	window.onresize = pFix
	pFix()
})()
