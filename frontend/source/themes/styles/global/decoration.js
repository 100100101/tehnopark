export default {
	'[_decoration~="dashed-line__trigger_bottom"]': {
			'&:hover': {
					'& [_text-decoration~="dashed-line__text_bottom"]': {
						backgroundImage: 'linear-gradient(90deg, #ddd 50%, #ddd 50%)',
					}
			},
	},
	/**/
	'[_decoration~="dashed-line_bottom"]': {
    display: 'inline',
	},
		/**/
		'[_decoration~="dashed-line__text_bottom"]': {
	    display: 'inline',
			backgroundColor: 'transparent',
			backgroundImage: 'linear-gradient(90deg, transparent 50%, #ccc 50%)',
			backgroundRepeat: 'repeat-x',
			backgroundSize: '3px 1px',
			backgroundPosition: 'bottom',
		},

};
