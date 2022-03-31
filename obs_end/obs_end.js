const update_counter = function(amount, set, update=false) {
	const counter_value_div = document.getElementById("counter_value");
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			const new_value = JSON.parse(xhr.responseText)['counter'];
			// fade is the value is different
			if (new_value != parseInt(counter_value_div.innerHTML)) {
				counter_value_div.style.opacity="0%";
			}

			let timer = setTimeout(function() {
				counter_value_div.innerHTML = new_value;
				counter_value_div.style.opacity="100%";
			}, 1000);
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

setInterval(update_counter, 5 * 1000, 0, false, true);