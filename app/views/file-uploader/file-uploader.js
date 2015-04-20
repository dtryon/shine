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
		this.props.onUpload(files);
		evt.preventDefault();
	},
	render: function() {
		return (
			<input id="file" name="file" onChange={this.extractFile} type="file" ref="file" multiple/>
		);
	}
});

var ThumbnailSelector = React.createClass({
	getInitialState: function() {
		return {}
	},
	componentWillMount: function() {
		if (this.props.file) {
			var reader = new FileReader();
			
			reader.readAsDataURL(this.props.file);

			reader.onload = function(imgSrc) {
				this.setState({image: imgSrc.target.result});
			}.bind(this);
		}
	},
	dimensionsSelected: function(x, y, w, h) {

		var IMAGE_SIZE = 100;

		var canvasCropped = React.findDOMNode(this.refs.canvasCropped);
		var contextCropped = canvasCropped.getContext('2d');

		canvasCropped.width = IMAGE_SIZE;
		canvasCropped.height = IMAGE_SIZE;

		var croppedImg = new Image();
		croppedImg.onload = function() {

				var imageWidth = croppedImg.width;
				canvasCropped.setAttribute('style','margin-bottom:5px;margin-left:' + (imageWidth+5) + 'px;');

				contextCropped.drawImage(croppedImg, x, y, w, h, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
				this.props.onSelected(this.state.image, canvasCropped.toDataURL('image/jpeg'));
			}.bind(this);

		croppedImg.src = this.state.image;
	},
	componentDidUpdate: function() {
		var self = this;
		
		if (this.state.image) {	

			var viewer = React.findDOMNode(this.refs.viewer);
			var canvasImage = React.findDOMNode(this.refs.canvasImage);
			var contextImage = canvasImage.getContext('2d');
			var canvasLayover = React.findDOMNode(this.refs.canvasLayover);
			var contextLayover = canvasLayover.getContext('2d');
			var img = new Image();
			
			img.onload = function() {
				var width = img.width;
				var height = img.height;

				viewer.setAttribute('style','display:inline-block;position:relative;height:'+(height+5)+'px');

				canvasImage.width = width;
				canvasImage.height = height;
				canvasLayover.width = width;
				canvasLayover.height = height;

				contextImage.drawImage(img, 0, 0);
			}.bind(this);

			img.src = this.state.image;

			// layover
			var originX = 0;
			var originY = 0;
			var xInterval = 0;
			var yInterval = 0;
			var boxWidth = 0;
			var boxHeight = 0;
			var paint = false;
			var interval = 10; // 10px increments

			function redraw(x, y){

				if (x && y) {
					xInterval = Math.round(x / interval) * interval;
					yInterval = Math.round(y / interval) * interval;
					originX = Math.round(originX / interval) * interval;
					originY = Math.round(originY / interval) * interval;

					boxWidth = xInterval - originX;
					boxHeight = yInterval - originY;

					// square
					boxWidth = boxWidth < boxHeight ? boxHeight : boxWidth;
					boxHeight = boxHeight < boxWidth ? boxWidth : boxHeight; 

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
				    	contextLayover.fillText(measurements, 10, 20);
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
				var x = xInterval;
				var y = yInterval;

				if (originX < xInterval) { x = originX; }
				if (originY < yInterval) { y = originY; }
				
				self.dimensionsSelected(x, y, Math.abs(boxWidth), Math.abs(boxHeight));
				
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
				<div>
					<div style={{position: 'relative', display: 'inline-block'}} ref="viewer">
						<canvas style={{position: 'absolute', left: 0, top: 0, zIndex: 0, border: 1}} ref="canvasImage"/>
						<canvas style={{position: 'absolute', left: 0, top: 0, zIndex: 1, border: 1}} ref="canvasLayover"/>
					</div>
					<canvas ref="canvasCropped"/>
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
			this.setState({files: files});
		}
	},
	handleThumbnailSelection: function(image, thumbnailImage) {

		var service = new ImageService();
		service.saveImage(image, thumbnailImage);
	},
	render: function() {
		var ThumbnailSelectors = [];
		for (var i = 0; i < this.state.files.length; i++) {
			ThumbnailSelectors.push(<ThumbnailSelector file={this.state.files[i]} onSelected={this.handleThumbnailSelection} key={'file_' + this.state.files[i].name + '_' + i} />);
		}
		return (
			<form name="frm">
				<Label targetName="file" content="Upload Files:"/><br/>
				<Uploader onUpload={this.handleFileUploads}/><br/><br/>
				<Label content="Viewer:"/><br/>
				{ThumbnailSelectors}
			</form>
		);
	}
});

React.render(
	<FileUploader />,
	document.getElementById('file-uploader')
);