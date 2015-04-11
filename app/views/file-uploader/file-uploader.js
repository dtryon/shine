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
		var files = React.findDOMNode(this.refs.file).files;
		this.props.handleFiles(files);
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
		return {}
	},
	componentWillMount: function() {
		if (this.props.file) {
			var reader = new FileReader();
			
			reader.readAsDataURL(this.props.file);

			reader.onload = function(imgSrc) {
				this.setState({image: {src: imgSrc.target.result, width: this.props.file.width, height: this.props.file.height}});
			}.bind(this);
		}
	},
	componentDidUpdate: function() {
		if (this.state.image) {	

			var viewer = React.findDOMNode(this.refs.viewer);
			var canvasImage = React.findDOMNode(this.refs.canvasImage);
			var canvasLayover = React.findDOMNode(this.refs.canvasLayover);
			var context = canvasImage.getContext('2d');
			var img = new Image();
			
			img.onload = function() {
				var width = img.width;
				var height = img.height;

				viewer.setAttribute('style','position:relative;height:'+(height+5)+'px');

				canvasImage.width = width;
				canvasImage.height = height;
				canvasLayover.width = width;
				canvasLayover.height = height;

				context.drawImage(img, 0, 0);
			}.bind(this);

			img.src = this.state.image.src;

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
				    	var measurements = 'w: ' + Math.abs(boxWidth) + "\n" + 'h: ' + Math.abs(boxHeight);
				    	contextLayover.fillText(measurements, xInterval+10, yInterval+10);
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
		
		if (this.state.image) {		

			return (
					<div style={{position: 'relative'}} ref="viewer">
						<canvas style={{position: 'absolute', left: 0, top: 0, zIndex: 0, border: 1}} ref="canvasImage"/>
						<canvas style={{position: 'absolute', left: 0, top: 0, zIndex: 1, border: 1}} ref="canvasLayover"/>
					</div>
				)
		}
		return (<div></div>);
	}
});

var FileUploader = React.createClass({

	getInitialState: function() {
		return {files: []};
	},
	handleFileUploads: function(files) {
		if (files) {
			this.state.files = files;		
			this.setState({files: this.state.files});
		}
	},
	render: function() {
		var imageViewers = [];
		for (var i = 0; i < this.state.files.length; i++) {
			imageViewers.push(<ImageViewer file={this.state.files[i]} key={'file' + i} />);
		}
		return (
			<form name="frm">
				<Label targetName="file" content="Upload Files:"/><br/>
				<Uploader handleFiles={this.handleFileUploads}/><br/><br/>
				<Label content="Viewer:"/><br/>
				{imageViewers}
			</form>
		);
	}
});

React.render(
	<FileUploader />,
	document.getElementById('file-uploader')
);