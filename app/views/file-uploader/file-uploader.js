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
	getInitialState: function() {
		return {images: []}
	},
	componentWillReceiveProps: function() {


		if (this.props.files.length > 0) {
			// for (var i = this.props.files.length - 1; i >= 0; i--) {
			// 	(function (ctx, counter) {
			// 		var reader = new FileReader();
			// 		var file = ctx.props.files[counter];
			// 		reader.readAsDataURL(file);
			// 		reader.onload = function(imgSrc) {
			// 			ctx.replaceState({images: [imgSrc.target.result]});
			// 			console.log('done: ', file.name);
			// 		}.bind(ctx);
			// 	})(this, i);
			// };

			var reader = new FileReader();
			var file = this.props.files[this.props.files.length-1];  // this is bad
			reader.readAsDataURL(file);
			reader.onload = function(imgSrc) {
				this.replaceState({images: [imgSrc.target.result]});
			}.bind(this);
		}
	},
	render: function() {
		if (this.state.images.length > 0) {		
			var images = [];
			for (var i = this.state.images.length - 1; i >= 0; i--) {
				var image = React.createElement('img', {'src': this.state.images[i], 'key': 'img' + i});
				images.push(image);
			};
			var viewer = React.createElement('div', {id: 'viewer'}, images);
			return viewer;
		}
		return React.createElement('div');
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