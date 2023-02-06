/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handler = void 0;
async function handler(event, context) {
    return {
        statusCode: 200,
        body: "Hello from Lambda! " + Math.random()
    };
}
exports.handler = handler;

})();

module.exports = __webpack_exports__;
/******/ })()
;