/**
 * Created by davidbaldaro on 17/06/2018.
 */

// Functions to run upon XMPL startup
var xmplOnReady = function()
{
    var xmpControllerDriverVar = new xmpControllerDriver($('[ng-controller="XMPPersonalizedPage"]'));
    xmpControllerDriverVar.ready(function() {
        if (xmpControllerDriverVar.xmp.recipientFailed == true)
            window.location="pageError.html";
        else
        {
            var resourceDriver = new xmpResourceDriver();
            var inOptions= {adors: ['First Name', 'Email', 'Flavor']};
            resourceDriver.getRecipientADORs(xmpControllerDriverVar.xmp.recipientID, inOptions, function (data) {
                slackNotification(data['First Name'] + " (" + data['Email'] + ") is viewing their " + data['Flavor'] + " personalised page. ");
            }, null);
        }
    });
} //end xmplOnReady

function slackNotification(message){
    // This needs to be our incoming webhook, setup in our Slack app.
    var webhookURL = "https://hooks.slack.com/services/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";
    var invocation = new XMLHttpRequest();
    if(invocation) {
        invocation.open("POST", webhookURL, true);
        invocation.send(JSON.stringify({"username": "ghost-bot", "icon_emoji": ":ghost:","text": message}));
    }

}

function fireZapier() {
    //This needs to be your Zapier Web Service set up and waiting for the POST
    console.log("Zapping....");

    var xmpControllerDriverVar = new xmpControllerDriver($('[ng-controller="XMPPersonalizedPage"]'));
    xmpControllerDriverVar.ready(function() {

        // Providing that we have a recipient returned to us then we can continue
        if (xmpControllerDriverVar.xmp.recipientFailed === true)
            window.location="error_page.html";
        else
        {
            // Here we define the ADOR(s) that we want evaluated and returned before calling the getRecipientADORs function
            // We use the recipientID that has been returned by the instance of the XMPL controller
            var resourceDriver = new xmpResourceDriver();
            var inOptions= {adors: ['First Name', 'Last Name', 'Email', 'Flavor']};
            resourceDriver.getRecipientADORs(xmpControllerDriverVar.xmp.recipientID, inOptions, function (data) {

                // Set correct endpoint, based on flavour
                if (data['Flavor'] == 'BB'){var url = 'https://hooks.zapier.com/hooks/catch/124616/k8rm29/'; console.log('Added BB capsule...');}
                if (data['Flavor'] == 'FB'){var url = 'https://hooks.zapier.com/hooks/catch/124616/k8z7zj/'; console.log('Added FB capsule...');}
                if (data['Flavor'] == 'HB'){var url = 'https://hooks.zapier.com/hooks/catch/124616/k8ky6w/'; console.log('Added HB capsule...');}
                if (data['Flavor'] == 'DM'){var url = 'https://hooks.zapier.com/hooks/catch/124616/k8zl76/'; console.log('Added DM capsule...');}

                // Fire off the POST to the Zapier Web Service

                console.log(xmpControllerDriverVar.xmp.recipientID);
                var invocation = new XMLHttpRequest();
                if(invocation) {
                    invocation.open('POST', url, true);
                    var fname = data['First Name'];
                    var lname = data['Last Name'];
                    var email = data['Email'];
                    var rid = xmpControllerDriverVar.xmp.recipientID;
                    invocation.send(JSON.stringify({firstname: fname, lastname: lname, email: email, rid: rid}));
                }
                slackNotification(fname + " (" + rid + ") is requesting their personalied coupon for  " + data['Flavor'] + ". ");


            }, null);
        }
    });
}
