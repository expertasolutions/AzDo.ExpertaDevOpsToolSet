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

var tl = require('azure-pipelines-task-lib');

try {
    var stringToAnalyze = tl.getInput("stringToAnalyze", true);
    
    console.log("Current string analyzed: " + stringToAnalyze);

    let partNumber = stringToAnalyze.split('.');
    let result = undefined;
    if(partNumber.length == 3) {
        result = stringToAnalyze.match("\w*-v(([0-9]{1,}).([0-9]*).([0-9]*))");
    } else if (partNumber.length == 4){
        result = stringToAnalyze.match("\w*-v(([0-9]{1,}).([0-9]*).([0-9]*).([0-9]*))");
    }

    let fullVersion = result[1];
    let major = result[2];
    let minor = result[3];
    let patch = result[4];
    let revision = 0;
    if(partNumber.length === 4){
        revision = result[5];
    }
    let minFullVersion = major + minor + patch;
    if(revision != 0) {
        minFullVersion += minFullVersion + revision;
    }

    console.log("Version string details:");
    console.log("");
    console.log("fullVersion: " + fullVersion);
    console.log("fullVersionMin: " + minFullVersion);
    console.log("versionMajor: " + major);
    console.log("versionMinor: " + minor);
    console.log("versionPatch: " + patch);
    console.log("revision: " + revision);

    tl.setVariable("versionMajor", major);
    tl.setVariable("versionMinor", minor);
    tl.setVariable("versionPatch", patch);
    tl.setVariable("revisionNumber", revision);
    tl.setVariable("fullVersionMin", minFullVersion);
    tl.setVariable("fullVersion", fullVersion);
} catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
}
