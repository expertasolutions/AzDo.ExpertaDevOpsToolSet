"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });

var tl = require('vsts-task-lib');

try {
    var stringToAnalyze = tl.getInput("stringToAnalyze", true);
    
    console.log("Current string analyzed: " + stringToAnalyze);

    var result = stringToAnalyze.match("([0-9]{1,}).([0-9]{1,}).([0-9]{1,})");

    var major = result[1];
    var minor = result[2];
    var patch = result[3];

    console.log("Version string details:");
    console.log("");
    console.log("fullVersion: " + result[0]);
    console.log("versionMajor: " + major);
    console.log("versinMinor: " + minor);
    console.log("versionPatch: " + patch);

    tl.setVariable("versionMajor", major);
    tl.setVariable("versionMinor", minor);
    tl.setVariable("versionPatch", patch);
    tl.setVariable("fullVersion", result[0]);
} catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
}