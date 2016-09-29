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
				<div className="toolbar__controls">
					<div class="toolbar__button toolbar__button--filled"></div>
					<div class="toolbar__button toolbar-button--undo">Undo</div>
					<div class="toolbar__button toolbar-button--clear">Undo All
					</div>
				</div>
				<ul className="mode-list">
					<li className="mode-list__item mode-list__item--pen is-active"></li>
					<li className="mode-list__item mode-list__item--line"></li>
					<li className="mode-list__item mode-list__item--rect"></li>
					<li className="mode-list__item mode-list__item--text"></li>
				</ul>
				<div className="toolbar__share">
					<div className="toolbar__item toolbar__item--url">Change URL</div>
					<div className="toolbar__item toolbar__item--name">Rohan</div>
					<div className="toolbar__item-full toolbar__item--share">Invite/Share</div>
				</div>
			</header>
		)
	}
}

Toolbar.propTypes = {
	mode : React.PropTypes.string
};

Toolbar.defaultProps = {
};
