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


var sigFieldId = "_podpis_"
function addSignatureHandler() {
    log("running add signature handler");
    Word.run(function (context) {
        var id = "sigid_" + Math.floor(Math.random() * 1000000000)
        sigFieldId = id;
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


function sendToSignHandler() {
    // load pdf data
    var pdfFile = document.getElementById("pdf").files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function () {
        next1(reader.result.replace(/^[^,]+,/,""));
    }, false);
    reader.readAsDataURL(pdfFile);


    // prepare params for request replacements
    function next1(pdfData) {
        var params = {
            gn:document.getElementById("fldGn").value,
            fn:document.getElementById("fldFn").value,
            birthYear:document.getElementById("fldBirthYear").value,
            email:document.getElementById("fldEmail").value,
            mobile:document.getElementById("fldMobile").value,
            invChan:"none",
            documentName:"dokument-k-podpisu",
            documentContent:pdfData,
            sigType:"hand",
            signFieldPattern: sigFieldId
        }
        console.log(JSON.stringify(params,null,2));

        prepareRequest(params,next2)
    }


    // send request
    function next2(requestBody) {
        var accessToken = JSON.parse(localStorage["session"]).tokenResponse.access_token
        var xhr = new XMLHttpRequest();
        xhr.open('POST', "https://server.cgi.esigner360.eu/esigner360/EsignRestApi/v1/PrepareTransaction", true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('x-biosignauthorization', accessToken);        
        xhr.onreadystatechange = function () {//Call a function when the state changes.
            if (xhr.readyState == 4 && xhr.status == 200) {
                var responseJson = xhr.responseText;
                console.log(responseJson)
                var response = JSON.parse(responseJson)
                transactionId = response.Data;
                console.log(transactionId);
                checkTxStatus(transactionId);
            }
        }
        xhr.send(requestBody);    
    }
}


function checkTxStatus(transactionId) {
    var accessToken = JSON.parse(localStorage["session"]).tokenResponse.access_token
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://server.cgi.esigner360.eu/esigner360/EsignRestApi/v1/Transaction/"+transactionId, true);
    xhr.setRequestHeader('x-biosignauthorization', accessToken);        
    xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState == 4 && xhr.status == 200) {
            var responseJson = xhr.responseText;
            //console.log(responseJson)
            var dto = JSON.parse(responseJson)
            processDto(dto, function (continueChecking) {
                if (continueChecking) {
                    setTimeout(function () { checkTxStatus(transactionId) }, 5000);                                       
                }
            })
        }
        if (xhr.readyState == 4 && xhr.status == 404) {
            setTimeout(function () { checkTxStatus(transactionId) }, 1000);
        }
    }

    xhr.send();    
}

function processDto(dto, continueChecking) {
    var elm = document.getElementById("tx-state");

    elm.innerHTML = dto.presentState + "<br>" + dto.clientStates[0].state
    
    if (dto.state === "Finalized") {
        elm.innerHTML="<h3>SIGNED!</h3><p>...getting signed PDF</p>"
        downloadPdf(dto.sections[0].documents[0].dfid, function () {
            continueChecking(false)
        });
    } else {
        continueChecking(true);
    }
}


function downloadPdf(dfid, resolve) {
    var accessToken = JSON.parse(localStorage["session"]).tokenResponse.access_token
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://server.cgi.esigner360.eu/esigner360/EsignRestApi/v1/Object/"+dfid, true);
    xhr.setRequestHeader('x-biosignauthorization', accessToken);
    xhr.responseType = "blob"
    xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState == 4 && xhr.status == 200) {
            var responseBlob = xhr.response;
            var elm = document.getElementById("tx-state");
            elm.innerHTML="<h3>SIGNED!</h3><p><a download='signed.pdf' href='"+URL.createObjectURL(responseBlob)+"'>Download signed PDF</a></p>"
        }
    }
    xhr.send();    
    
}



function fetchRequestTemplate(resolve) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "request-template.json", true);
    xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = xhr.responseText;
            resolve(response);
        }
    }
    xhr.send();
}

function prepareRequest(params,resolve) {
    fetchRequestTemplate(function (template) {
        var workTemplate = template;
        for (var key in params){
            var paramVal = params[key];
            console.log("replacing key",key)
            workTemplate = workTemplate.replace("##" + key + "##", paramVal);
        }
        resolve(workTemplate)
    })
}

