const translator = require("open-google-translator");

translator.supportedLanguages();

async function translate(text) {
    const data = await translator.TranslateLanguageData({
        listOfWordsToTranslate: [text],
        fromLanguage: "en",
        toLanguage: "vi",
    });
    return data[0].translation;
}

module.exports = {translate}