import React from 'react';

/**
 * My component, just for me, u no touchy.
 *
 * @class App
 * @extends React.Component
 */
export default class Toolbar extends React.Component {

	render(){
		return (
			<header className="toolbar"></header>
		)
	}
}

Toolbar.propTypes = {
	// dfasda
	mode : React.PropTypes.string
};

Toolbar.defaultProps = {
};