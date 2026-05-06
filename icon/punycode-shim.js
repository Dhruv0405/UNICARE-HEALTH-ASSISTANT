// Replace deprecated built-in punycode module with userland alternative
const punycodeLib = require('punycode.js');

// Export all the methods from punycode.js
module.exports = punycodeLib; 