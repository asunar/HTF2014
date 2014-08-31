function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.lastIndexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function formatDate(date) {
	var days= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var dayName = days[date.getDay()];

	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var monthName = months[date.getMonth()];
	return dayName + " " + date.getDate() + " " + monthName;

}

function stripTimeFromDate(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getHTTPObject() {
    if (typeof XMLHttpRequest != 'undefined') {
        return new XMLHttpRequest();
    } try {
        return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
    }
    return false;
}
