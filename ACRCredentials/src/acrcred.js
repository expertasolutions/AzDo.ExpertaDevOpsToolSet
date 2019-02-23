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
    var azureSubscriptionEndpoint = tl.getInput("azureSubscriptionEndpoint", true);
    var resourceGroupName = tl.getInput("resourceGroupName", true);
    var containerRegistry = tl.getInput("containerRegistry", true);
    var actionType = tl.getInput("actionType", true);
    
    console.log("Azure Subscription Id: " + azureSubscriptionEndpoint);
    console.log("Resource Group: " + resourceGroupName);
    console.log("Container Registry: " + containerRegistry);
    console.log("Action Type: " + actionType);
    
} catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
}