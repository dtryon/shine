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
			
			var reader = new FileReader();
			var file = this.props.files[0];
			
			reader.readAsDataURL(file);
			
			reader.onload = function(imgSrc) {
				this.setState({images: [{src: imgSrc.target.result, file: file}]});
			}.bind(this);
		}
	},
	componentDidUpdate: function() {
		if (this.state.images.length > 0) {	

			var viewer = React.findDOMNode(this.refs.viewer);
			var canvasImage = React.findDOMNode(this.refs.canvasImage);
			var canvasLayover = React.findDOMNode(this.refs.canvasLayover);
			var context = canvasImage.getContext('2d');
			var img = new Image();
			
			img.onload = function() {
				var width = img.width;
				var height = img.height;

				canvasImage.width = width;
				canvasImage.height = height;
				canvasLayover.width = width;
				canvasLayover.height = height;

				context.drawImage(img, 0, 0);
			}.bind(this);

			img.src = this.state.images[0].src;

			// layover
			var originX = 0;
			var originY = 0;
			var paint = false;
			var contextLayover = canvasLayover.getContext('2d');
			var interval = 10; // 10px increments

			function redraw(x, y){
				
				if (x && y) {
					var xInterval = Math.round(x / interval) * interval;
					var yInterval = Math.round(y / interval) * interval;
					originX = Math.round(originX / interval) * interval;
					originY = Math.round(originY / interval) * interval;

					var boxWidth = xInterval - originX;
					var boxHeight = yInterval - originY;

					if (xInterval && yInterval) {
						contextLayover.globalAlpha = 1;
						contextLayover.clearRect(0, 0, contextLayover.canvas.width, contextLayover.canvas.height);

    					var rect = new Path2D();
				        rect.rect(originX, originY, boxWidth, boxHeight);
				    	rect.fillStyle = '#000';
				    	contextLayover.fill(rect)

						contextLayover.globalCompositeOperation = 'source-out';
						contextLayover.globalAlpha = 0.5;

						contextLayover.fillStyle = '#000';
						contextLayover.fillRect(0, 0, contextLayover.canvas.width, contextLayover.canvas.height);

						contextLayover.globalCompositeOperation = 'source-over';
						contextLayover.globalAlpha = 1;

						var rect = new Path2D();
				        rect.rect(originX, originY, boxWidth, boxHeight);
				    	contextLayover.strokeStyle = '#000';
				    	contextLayover.lineWidth = 2;
				    	contextLayover.stroke(rect)

				    	contextLayover.fillStyle = '#FFF';
				    	var measurements = 'w: ' + boxWidth + "\n" + 'h: ' + boxHeight;
				    	contextLayover.fillText(measurements, xInterval+3, yInterval+3);
					}
				}
			}

			canvasLayover.addEventListener('mousedown', function(e){
				
				originX = e.pageX - viewer.offsetLeft;
				originY = e.pageY - viewer.offsetTop;

				paint = true;

				redraw();
			});

			canvasLayover.addEventListener('mousemove', function(e) {
				if(paint) {

					var mouseX = e.pageX - viewer.offsetLeft;
					var mouseY = e.pageY - viewer.offsetTop;

					redraw(mouseX, mouseY);
				}
			});

			canvasLayover.addEventListener('mouseup', function(e) {

				paint = false;
			});

			canvasLayover.addEventListener('mouseleave', function(e) {

				paint = false;
			});
		}
	},
	render: function() {
		if (this.state.images.length > 0) {		

			var width = this.state.images[0].file.width;
			var height = this.state.images[0].file.height;		

			var canvasImage = React.createElement('canvas', {width: width, 
														height: height, 
														style: {position: 'absolute', left: 0, top: 0, zIndex: 0, border: 1},
														ref: 'canvasImage'});

			var canvasLayover = React.createElement('canvas', {width: width, 
														height: height, 
														style: {position: 'absolute', left: 0, top: 0, zIndex: 1},
														ref: 'canvasLayover'});

			var viewer = React.createElement('div', {id: 'viewer', style: {position: 'relative'}, ref: 'viewer'}, canvasImage, canvasLayover);
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
		this.state.files[0] = file;		
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