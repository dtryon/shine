'use strict';

var Label = React.createClass({

	render: function() {

		if (this.props.targetName) {
			return (
				<label for="{this.props.targetName}">{this.props.content}</label>
			);
		}

		return (
				<label>{this.props.content}</label>
		);
		
	}
});

var Uploader = React.createClass({

	extractFile: function(evt) {
		var newFile = React.findDOMNode(this.refs.file).files[0];
		this.props.handleNewFile(newFile);
		evt.preventDefault();
	},
	render: function() {
		return (
			<input id="file" name="file" onChange={this.extractFile} type="file" ref="file" multiple/>
		);
	}
});

var ImageViewer = React.createClass({

	render: function() {
		
		if (this.props.files.length > 0) {
			return (
				<div id="viewer">
					{this.props.files[0].name}
				</div>
			);
		}
		return (
			<div id="viewer"></div>
		);
	}
});

var FileUploader = React.createClass({

	getInitialState: function() {
		return {files: []};
	},
	handleFileUploaded: function(file) {
		this.state.files.push(file);		
		this.setState({files: this.state.files});
	},
	render: function() {
		return (
			<form name="frm">
				<Label targetName="file" content="Upload Files:"/><br/>
				<Uploader handleNewFile={this.handleFileUploaded}/><br/><br/>
				<Label content="Viewer:"/><br/>
				<ImageViewer files={this.state.files} />
			</form>
		);
	}
});

React.render(
	<FileUploader />,
	document.getElementById('file-uploader')
);