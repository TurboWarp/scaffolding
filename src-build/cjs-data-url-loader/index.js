/**
 * @param {Buffer} raw
 */
module.exports = function (raw) {
    const url = `data:application/octet-stream;base64,${raw.toString('base64')}`;
    return `module.exports = ${JSON.stringify(url)};`;
};

module.exports.raw = true;
