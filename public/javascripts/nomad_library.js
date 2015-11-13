
$(function(){

		$('#saigon_pic').on('click', function (){
			      var name = 'adam'
      			  var password = 'adam'
	      	$.ajax({
	            url: '/books',
	            dataType: "json",
	            method: "GET",
	            success: function(data, textStatus, jqXHR) {
	            	var saigonArray = [];
	            	for (i = 0; i < data.length; i++) {
	            		console.log(data)
	            		if (data[i]['location_ids'][0] == 'saigon') {
	            			saigonArray.push(data[i]);
	            			$('#change').html("")
	            		}

	            	}
	            	for (i = 0; i < saigonArray.length; i++) {
	            		console.log(saigonArray)
	            		$('#change').append('<img src='+ saigonArray[i].cover_url + '>')
	            	}

	            },
	            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("Status: " + textStatus); alert("Error: " + errorThrown);
            	}

		});
	});

		$('#bogota_pic').on('click', function (){
			      var name = 'adam'
      			  var password = 'adam'
	      	$.ajax({
	            url: '/books',
	            dataType: "json",
	            method: "GET",
	            success: function(data, textStatus, jqXHR) {
	            	var bogotaArray = [];
	            	for (i = 0; i < data.length; i++) {
	            		console.log(data)
	            		if (data[i]['location_ids'][0] == 'bogota') {
	            			bogotaArray.push(data[i]);
	            			$('#change2').html("")
	            		}

	            	}
	            	for (i = 0; i < bogotaArray.length; i++) {
	            		$('#change2').append('<img src='+ bogotaArray[i].cover_url + '>')
	            	}

	            },
	            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("Status: " + textStatus); alert("Error: " + errorThrown);
            	}

		});
	});













});




