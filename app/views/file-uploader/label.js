
if (typeof module != 'undefined') {
	React = require('react/addons'); 	
}

var Label = React.createClass({

	render: function() {

		if (this.props.targetName) {
			return (
				<label htmlFor={this.props.targetName}>{this.props.content}</label>
			);
		}

		return (
				<label>{this.props.content}</label>
		);
	}
});

if (typeof module != 'undefined') {
	module.exports = Label;
}