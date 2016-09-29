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
					<div className="toolbar__button toolbar__button--filled"></div>
					<div className="toolbar__button toolbar__button--undo">Undo</div>
					<div className="toolbar__button toolbar__button--clear toolbar__button--dropdown">Clear My Sketches
					<span className="toolbar__button--dropdown__toggle"></span>
					</div>
				</div>
				<ul className="mode-list">
					<li className="mode-list__item mode-list__item--pen is-active"></li>
					<li className="mode-list__item mode-list__item--line"></li>
					<li className="mode-list__item mode-list__item--rect"></li>
					<li className="mode-list__item mode-list__item--text"></li>
				</ul>
				<div className="toolbar__share">
					<div className="toolbar__item toolbar__item--url-change">Change URL</div>
					<div className="toolbar__item toolbar__item--name">Rohan</div>
					<div className="toolbar__item toolbar__item--share">Invite / Share</div>
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
