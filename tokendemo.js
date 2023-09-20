var token = "";
var userDetails = {

    email: null,
    id: null,
    name: null,
    username: null
}


if (document.readyState === "complete") {
    // Fully loaded!


}
else if (document.readyState === "interactive") {
    // DOM ready! Images, frames, and other subresources are still downloading.
}
else {
    // Loading still in progress.
    // To wait for it to complete, add "DOMContentLoaded" or "load" listeners.

    window.addEventListener("DOMContentLoaded", () => {
        // DOM ready! Images, frames, and other subresources are still downloading.

    });

    window.addEventListener("load", () => {
        // Fully loaded!

		var element = document.getElementById("tokenContainer");

		element.innerHTML = token;


    });
}




// Obtain a reference to the platformClient object
const platformClient = require('platformClient');

// Implicit grant credentials
const CLIENT_ID = '39c538ad-b879-43aa-8e15-7390c2498f42'; ///'202478fd-e993-4321-ba71-f4815e9a1503';

// Genesys Cloud environment
const ENVIRONMENT = 'usw2.pure.cloud'; ///'mypurecloud.com';usw2.pure.cloud


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\#&]" + name + "=([^&#]*)"),
        results = regex.exec(location.hash);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

if (window.location.hash) {
    console.log(location.hash);
    token = getParameterByName('access_token');

    $.ajax({
        url: `https://api.${ENVIRONMENT}/api/v2/users/me`,
        type: "GET",
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'bearer ' + token); },
        success: function (result, status, xhr) {


            const obj = JSON.parse(JSON.stringify(result));

            userDetails.email = obj.email;
            userDetails.id = obj.id;
            userDetails.name = obj.name;
            userDetails.username = obj.username;

			
		var userName = document.getElementById("userName");
		console.log(userDetails.username);
		userName.innerHTML = userDetails.username;

        }
    });

    location.hash = ''

} else {
    var queryStringData = {
        response_type: "token",
        client_id: CLIENT_ID,
        redirect_uri: "https://stoltenbergpeter.github.com/acdconference.html"
    }
    window.localStorage.clear();

    console.log(`https://login.${ENVIRONMENT}/oauth/authorize?` + jQuery.param(queryStringData));
    window.location.replace(`https://login.${ENVIRONMENT}/oauth/authorize?` + jQuery.param(queryStringData));
}



function reAuth() {

    var queryStringData = {
        response_type: "token",
        client_id: CLIENT_ID,
        redirect_uri: "https://stoltenbergpeter.github.com/acdconference.html"
    }
    window.localStorage.clear();

    window.location.replace(`https://login.${ENVIRONMENT}/oauth/authorize?` + jQuery.param(queryStringData));
}


function getUserPresence(userId) {

    if (userDetails.id == null) {
        console.log("No user id found, reauth");
        reAuth();
    }
    else {
        $.ajax({
            url: `https://api.${ENVIRONMENT}` + "/api/v2/users/" + userId + "/presences/purecloud",
            type: "GET",
            contentType: 'application/json',
            dataType: 'json',
            async: true,
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'bearer ' + token); },
            success: function (result, status, xhr) {
                console.log(result);
                const obj = JSON.parse(JSON.stringify(result));
                var presence = obj.presenceDefinition.systemPresence;
                console.log(presence);
                if (presence == "OFFLINE" || presence == "Offline") {
                    setTimeout(function () {
                        getUserPresence(userId)
                    }, 5000);
                }
                else {               

                 }

            }
        });
    }
}

