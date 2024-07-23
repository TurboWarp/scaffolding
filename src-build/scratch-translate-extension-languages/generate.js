// scratch-translate-extension-languages contains translations of every language into
// every other language, so it is quite large. This generates a new languages.json file
// that has just the metadata that the translate extension actually needs at runtime
// outside of the editor.

// See also https://github.com/TurboWarp/scratch-translate-extension-languages-mirror

const fs = require('fs');
const path = require('path');

const languageNames = require('scratch-translate-extension-languages');
const menuMap = languageNames.menuMap;
for (const [languageCode, languageMenu] of Object.entries(menuMap)) {
  const keepLanguages = [
    languageCode,
    languageCode.split('-')[0]
  ];
  const newMenu = languageMenu.filter(({code}) => keepLanguages.includes(code));
  // Empty list can cause crashes at runtime
  if (newMenu.length === 0) {
    throw new Error('menuMap is empty for ' + languageCode);
  }
  menuMap[languageCode] = newMenu;
}
delete languageNames.spokenLanguages;

fs.writeFileSync(path.join(__dirname, 'languages.json'), JSON.stringify(languageNames));
