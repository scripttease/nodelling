//TODO get all languages from // https://api.github.com/users/:username/repos
//for format see https://api.github.com/users/scripttease/repos
// for pagination of uris https://api.github.com/users/scripttease/repos?page=1&per_page=100
// docs for github api: https://developer.github.com/v3/#pagination

function getMainLang(reposObj) {
    let langObj;
    const langArray = [];
    reposObj.forEach(function(obj, ind){
        if (obj.language) {
            langObj = {
                lang: obj.language
            }
            langArray.push(langObj)
        }
    })
    return langArray;
}

function getLangUris(reposObj) {
    let langObj;
    const langArray = [];
    reposObj.forEach(function(obj, ind){
        if (obj.languages_url) {
            langObj = {
                langUri: obj.languages_url
            }
            langArray.push(langObj)
        }
    })
    return langArray;
}

module.exports.getMainLang = getMainLang;
module.exports.getLangUris = getLangUris;