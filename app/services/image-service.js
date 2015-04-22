'use strict';

function ImageService() {

	var obj = {};

	obj.saveImage = function (detail, thumbnail) {

		var payload = { detail: detail, thumbnail: thumbnail };

		$.ajax({
            url: "http://localhost:5000/image",
            type: "POST",
            crossDomain: true,
            data: JSON.stringify(payload),
            contentType: "application/json",
            success: function (response) {
                var resp = JSON.parse(response)
                alert(resp.status);
            },
            error: function (xhr, status) {
                alert("error");
            }
        });
	}

	obj.saveImages = function (imagesToSend) {

		var payload = imagesToSend;

		$.ajax({
            url: "http://localhost:5000/images",
            type: "POST",
            crossDomain: true,
            data: JSON.stringify(payload),
            contentType: "application/json",
            success: function (response) {
                var resp = JSON.parse(response)
                alert(resp.status);
            },
            error: function (xhr, status) {
                alert("error");
            }
        });
	}

	return obj;
}