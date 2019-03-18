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
var fs = require('fs');

try {
    var fileToConvert = tl.getInput("fileToConvert", true);
    console.log("fileToConvert: " + fileToConvert);

    var fileContent = fs.readFileSync(fileToConvert, 'utf8');
    var base64File = Buffer.from(fileContent).toString('base64');
    tl.setVariable("base64Content", base64File);
} catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
}