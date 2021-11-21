document.write("<h1>hajhou</h1>");
function log(msg){
    let logElm = document.querySelector("#log")
    logElm.textContent = `${logElm.textContent}\n[${new Date().toISOString()}]: ${msg}`
}

window.addEventListener("load",()=>{
    log("loaded event"+navigator.userAgent)
})

Office.initialize = () => {
  isOfficeInitialized = true;
  log("office initialized");
};

log("js loaded");
