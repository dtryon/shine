'use strict';

jest.dontMock('../../../views/file-uploader/label');

describe('file-uploader component', function() {

	var React = require('react/addons');
	var TestUtils = React.addons.TestUtils;

	describe('Label sub component', function() {
		var Label = require('../../../views/file-uploader/label');
		it('has the correct target element name', function() {
			var labelDocument = TestUtils.renderIntoDocument(
					<Label targetName="foobar" content="Upload Files:"/>
			);

			var label = TestUtils.findRenderedDOMComponentWithTag(labelDocument, 'label');
			expect(label.props.htmlFor).toEqual('foobar');
		});

		it('has the correct content', function() {
			var labelDocument = TestUtils.renderIntoDocument(
					<Label targetName="foobar" content="Upload Files:"/>
			);

			var label = TestUtils.findRenderedDOMComponentWithTag(labelDocument, 'label');
			expect(label.getDOMNode().textContent).toEqual('Upload Files:');
		});
	});
	
});