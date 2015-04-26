'use strict';

jest.dontMock('../../../views/file-uploader/file-uploader');

describe('file-uploader component', function() {

	var React = require('react/addons');
	var TestUtils = React.addons.TestUtils;

	describe('renders in a form', function() {
		var FileUploader = require('../../../views/file-uploader/file-uploader').FileUploader;
		it('has a form', function() {
			var fileUploaderDocument = TestUtils.renderIntoDocument(
					<FileUploader />
			);
			var form = TestUtils.findRenderedDOMComponentWithTag(fileUploaderDocument, 'form');
			expect(form.props.name).toEqual('uploader-form');
		});
	});

	describe('Label sub component', function() {
		var Label = require('../../../views/file-uploader/file-uploader').Label;
		it('has the correct target element name', function() {
			var labelDocument = TestUtils.renderIntoDocument(
					<Label targetName="foobar" content="Upload Files:"/>
			);

			var label = TestUtils.findRenderedDOMComponentWithTag(labelDocument, 'label');
			expect(label.getDOMNode().getAttribute('for')).toEqual('{this.props.targetName}');
		});
	});
	
});