'use strict';

jest.dontMock('../../../views/file-uploader/file-uploader');
jest.dontMock('../../../views/file-uploader/label');

describe('file-uploader component', function() {

	var React = require('react/addons');
	var TestUtils = React.addons.TestUtils;

	describe('renders in a form', function() {
		var FileUploader = require('../../../views/file-uploader/file-uploader');
		it('has a form', function() {
			var fileUploaderDocument = TestUtils.renderIntoDocument(
					<FileUploader />
			);
			var form = TestUtils.findRenderedDOMComponentWithTag(fileUploaderDocument, 'form');
			expect(form.props.name).toEqual('uploader-form');
		});
	});
});