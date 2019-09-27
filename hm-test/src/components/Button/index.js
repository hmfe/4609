import React from 'react';

import './style.css';

class Button extends React.Component {

	render() {
		return (
			<button
				className="fancy-button"
				aria-label="Delete"
			>Delete</button>
		)
	}
}

export default Button;