'use strict';

jest.dontMock('../../../views/file-uploader/file-uploader');

describe('file-uploader component', function() {
	it('renders a form', function() {
		var React = require('react/addons');
		var FileUploader = require('../../../views/file-uploader/file-uploader');
		var TestUtils = React.addons.TestUtils;

		var fileUploader = TestUtils.renderIntoDocument(
				<FileUploader />
		);

		var form = TestUtils.findRenderedDOMComponentWithTag(fileUploader, 'form');
		expect(form.props.name).toEqual('uploader-form');
	});
});