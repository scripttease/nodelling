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
        // add filter for fork here
        if (obj.languages_url && !obj.fork) {
            langObj = {
                langUri: obj.languages_url
            }
            langArray.push(langObj)
        }
    })
    return langArray;
}

// takes array in format:
//[ { JavaScript: 20345 }, 
//  { Scala: 925, SuperCollider: 13 }, 
//  { Scala: 130713 }, 
//  { Elixir: 181476, Shell: 74 }, ... ] 
// from getLangInfo
// returns single object with all language
//keys and the summed lines.
function combineLangData(langObjArray) {

    let summedLangObj = {};
    langObjArray.forEach(repoObj => {
        // console.log(repoObj);
        // Object.keys generates an array of keys
        Object.keys(repoObj).forEach(langKey => {
            // if key exists in return Object
            // get its exisiting line value, or 0
            const existingCount = summedLangObj[langKey] || 0;
            const newCount = existingCount + repoObj[langKey]
            // in js if key doesn't exist it is created
            summedLangObj[langKey] = newCount
        })
    })
    return summedLangObj
}
module.exports.getMainLang = getMainLang;
module.exports.getLangUris = getLangUris;
module.exports.combineLangData = combineLangData;
