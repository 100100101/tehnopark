module.exports = {
	'*:not(head):not(script):not(title):not(style), :before, :after': {
	  boxSizing: 'border-box',
	  margin: 0,
	  padding: 0,
	  border: 'none',
	  outline: 'none',
	},

	'body, html': {
	  display: 'block',
	  overflow: 'hidden',
	  width: '100%',
	  height: '100%',
	  position: 'relative',
	  /*min-height: 100vh;*/
	},

	html: {
	  fontSize: '100%',
	},

	body: {
		fontSize: '12px',
		color: vars => vars.colors[1][2],
		fontFamily: 'Roboto-Regular',
		background: vars => vars.colors[2][1],
		overflow: 'hidden',
	},

	svg: {
	  maxWidth: '100%',
	  maxHeight: '100%',
	},

	a: {
	  backgroundColor: 'transparent',
		color: 'inherit',
		textDecoration: 'none',
		cursor: 'pointer',
	},

	mark: {
	  background: 'inherit',
	},

	small: {
	  fontSize: 'inherit',
	},

	'sub, sup': {
	  fontSize: 'inherit',
	  lineHeight: 'inherit',
	  verticalAlign: 'baseline',
	  position: 'relative',
	},

	sup: {
	  top: 0,
	},

	sub: {
	  bottom: 0,
	},

	// 'button, input, optgroup, select, textarea': {
	//   color: 'inherit',
	//   font: 'inherit',
	//   background:  'transparent',
	// },

	li: {
	  listStyle: 'none',
	},

	'::selection': {
		background: vars => vars.colors[3][2],
	},
};
