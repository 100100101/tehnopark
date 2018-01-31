export default {
	'[_space*="wrapper"]': {

	},
	'[_space~="wrapper1"]': {
		paddingLeft: 20,
		paddingRight: 20,
		display: 'flex',
	},
	/*ALIGN-ITEMS*/
	'[_space~="align-start"]': {
		alignItems:  'flex-start',
	},
	'[_space~="align-end"]': {
		alignItems: 'flex-end',
	},
	'[_space~="align-center"]': {
		alignItems:  'center',
	},
	'[_space~="align-baseline"]': {
		alignItems:  'baseline',
	},
	/*JUSTIFY-CONTENT*/
	'[_space~="justify-start"]': {
		justifyContent: 'flex-start',
	},
	'[_space~="justify-end"]': {
		justifyContent: 'flex-end',
	},
	'[_space~="justify-center"]': {
		justifyContent: 'center',
	},
	'[_space~="justify-between"]': {
		justifyContent: 'space-between',
	},
	'[_space~="justify-around"]': {
		justifyContent: 'space-around',
	},
	/**/
	'[_space~="wrap"]': {
		flexWrap: 'wrap',
	},
	/**/
	'[relative]': {
		position: 'relative',
	},
	/**/
	'[_space~="absolute"]': {
		position: 'absolute',
	},
};
