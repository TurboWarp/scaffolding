// TODO: make this configurable at runtime
const CDN_URL = 'https://packagerdata.turbowarp.org/scaffolding-music-v1/';

module.exports = function () {
    const relativePath = this.resourcePath.match(/scratch3_music[/\\]assets[/\\](.*\.mp3)$/i)[1];
    return `module.exports = ${JSON.stringify(CDN_URL + relativePath)};`;
};
