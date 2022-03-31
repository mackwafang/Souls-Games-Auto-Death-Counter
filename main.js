const update_counter = function(amount, set, update=false) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == XMLHttpRequest.DONE) {
	        document.getElementById("counter").innerHTML = JSON.parse(xhr.responseText)['counter'];
	    }
	}
	xhr.open('POST', 'server', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({"counter": amount, "set": set, "update_pulse": update}));
};

// update page on enter
window.onload = function() {
	update_counter(0, false, true);
}

// counting values
document.getElementById("increment_button").addEventListener("click", function(args) {
	console.log("you died!");
	update_counter(1, false);
});


// setting death values
document.getElementById("init_user_value_confirm_button").addEventListener("click", function() {
	update_counter(parseInt(document.getElementById("init_user_value").value), true);
});

var intervalid = setInterval(update_counter, 10000,
	0, false, true
);