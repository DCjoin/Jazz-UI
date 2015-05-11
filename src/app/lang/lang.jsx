
function f(key,...args) {
    console.log('return key');
    return key;
}

function getMessage(errorCode) {
    var i18n = window.I18N;
    if(i18n){
        return i18n['M'+errorCode];
    }
    return errorCode;
}


module.exports = {
    f:f,
    getMessage:getMessage
};
