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
			<header className="toolbar">
				<ul className="mode-list">
					<li className="mode-list__item mode-list__item--pen"></li>
					<li className="mode-list__item mode-list__item--line"></li>
					<li className="mode-list__item mode-list__item--rect"></li>
					<li className="mode-list__item mode-list__item--text"></li>
				</ul>
			</header>
		)
	}
}

Toolbar.propTypes = {
	mode : React.PropTypes.string
};

Toolbar.defaultProps = {
};