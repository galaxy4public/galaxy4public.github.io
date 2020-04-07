Prism.languages.ssh_config= {
	'comment': /^[ \t]*#.*$/m,
	'selector': /^[ \t]*(Host|Match)[ \t]+.*?/m,
	'constant': /^[ \t]*[^\s=]+?(?=[ \t]*=)/m,
	'attr-value': {
		pattern: /=.*/,
		inside: {
			'punctuation': /^[=]/
		}
	}
};
