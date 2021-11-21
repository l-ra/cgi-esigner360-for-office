function log(msg) {
    var msgTxt = "[" + new Date().toISOString() + "]: " + msg;
    console.log(msgTxt);
    var logElm = document.getElementById("log");
    var newEntry = document.createElement("div");
    newEntry.textContent = msgTxt;
    logElm.appendChild(newEntry); 
}

window.addEventListener("load", function () {
    log("window loaded");
    document.getElementById("add-sig").addEventListener("click", addSignatureHandler)
    document.getElementById("send-to-sign").addEventListener("click", sendToSignHandler)
    document.getElementById("help-toggle").addEventListener("click", function () {
        document.getElementById("export-help").style.display = "block";
    });
    document.getElementById("export-help-close").addEventListener("click", function () {
        document.getElementById("export-help").style.display = "none";
    });

    document.getElementById("egg").addEventListener("click", eggHandler);

    ensureLogin();
});

function ensureLogin() {
    if (!isLoggedIn()) {
        doLogin()
    }
    checkTokens();
}

function doLogin() {

    var redirectUri = window.location.protocol + "//" + window.location.host + window.location.pathname.replace(/\/[^/]*$/, "/consume-code.html");
    var loginFlowData = startLoginFlow(redirectUri);
    var authorizationUrl = oidcMeta().authorization_endpoint
        + "?scope=" + encodeURI("openid profile email")
        + "&response_type=code"
        + "&client_id=" + oidcClient()["resource"]
        + "&redirect_uri=" + encodeURI(redirectUri)
        + "&state=" + encodeURI(loginFlowData.state)
        + "&code_challenge=" + encodeURI(loginFlowData.code_verifier)
        + "&code_challenge_method=plain";
    log("Authorization url: " + authorizationUrl);

    document.getElementById("login-frame").style.display = "block";
    document.getElementById("login-frame").src = authorizationUrl;

    var checkLoginInterval = setInterval(function () {
        if (isLoggedIn()) {
            log("Logged in");
            document.getElementById("login-frame").style.display = "none";
            document.getElementById("login-frame").src = "";
            clearInterval(checkLoginInterval);
            checkTokens();
        } else {
            //log("not yet logged in");
        }
    }, 1000);
}


function checkTokens() {
    if (localStorage['session'] == null) {
        doLogin();
        return;
    }

    var session = JSON.parse(localStorage['session']);
    if (!session.valid) {
        doLogin();
        return;
    }

    var session = JSON.parse(localStorage["session"]);

    // todo check and refresh token

    var loggedInElm = document.getElementById("logged-in");

    if (session.valid) {
        if (loggedInElm.textContent == "" && loggedInElm.style.display == "none") {
            loggedInElm.textContent = "Logged in: " + session.userInfo.name
            loggedInElm.style.display = "block";
        }
        // check again in 5 seconds
        setTimeout(checkTokens, 5000);
    } else {
        if (loggedInElm.textContent != "" || loggedInElm.style.display != "none") {
            loggedInElm.textContent = ""
            loggedInElm.style.display = "none";
        }
    }
}

function startLoginFlow(redirect_uri) {
    var loginFlowData = {
        state: ("fid-" + Math.random()) + Math.random() + Math.random() + Math.random(),
        code_verifier: ("pkce-" + Math.random()) + Math.random() + Math.random() + Math.random(),
        redirect_uri: redirect_uri
    }
    localStorage["loginFlowData"] = JSON.stringify(loginFlowData);
    return loginFlowData;
}

function isLoggedIn() {
    if (localStorage["session"] != null) {
        loadSession();
        if (isValidSession()) {
            return true;
        }
    }
    return false;
}

var session = null;
function loadSession() {
    const sessionJson = localStorage["session"]
    if (sessionJson == null) {
        session = {
            valid: false
        }
    } else {
        session = JSON.parse(sessionJson)
        validateSession();
    }
}

function validateSession() {
    if (session == null) {
        session = {
            valid: false
        }
    } else {
        //FIXME: test session expiratoin
        session.valid = true;
    }
}

function isValidSession() {
    return session != null && session.valid;
}

Office.initialize = function () {
    isOfficeInitialized = true;
    log("office initialized");
};



function addSignatureHandler() {
    log("running add signature handler");
    Word.run(function (context) {
        var id = "sigid_" + Math.floor(Math.random() * 1000000000)
        var sigLabel =
            document.getElementById("fldGn").value
            + " " + document.getElementById("fldFn").value
            + " (" + document.getElementById("fldBirthYear").value + ")"
            ;

        const p2 = context.document.body.insertParagraph("", Word.InsertLocation.end);
        p2.spaceBefore = 72;
        p2.spaceAfter = 1;
        const txt = p2.insertText(" " + id + " ", Word.InsertLocation.end);
        txt.font.color = "#aaaaaa";
        txt.font.size = 5;

        const p1 = context.document.body.insertParagraph("Signature " + sigLabel, Word.InsertLocation.end);
        p1.spaceBefore = 1;
        p1.spaceAfter = 1;
        p1.font.color = "black";
        p1.font.size = 12;

        context.sync()
            .then(function () {
                log("signature added");
            })
            .catch(function (e) {
                log("failed signature add " + e)
            })
    })
}



function eggHandler() {
    Word.run(function (context) {
        log("egg start")
        try {
            var title = context.document.body.insertParagraph("Smlouva o zápůjčce", "Start");
            title.font.size = 24;
            title.font.color = "black";
            title.alignment = "Centered";
    
            var lastPara = title;
            for (var i=0; i<8; i++){
                var l = lorem(1,Lorem_TYPE.PARAGRAPH);
                var newPara = lastPara.insertParagraph(l, "After");
                newPara.font.size = 10;
                newPara.alignment = "Justified";
                lastPara = newPara;
            }    
        } catch (e){
            log(e)
        }

        context.sync()
            .then(function () {
                log("egg added");
            })
            .catch(function (e) {
                log("failed egg add " + e)
            })
    })
}


function sendToSignHandler(){
    var req = {
        
    }
}


