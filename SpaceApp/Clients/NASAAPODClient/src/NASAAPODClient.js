"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NASAAPODClient = void 0;
const RestClient = require("typed-rest-client/RestClient");
class NASAAPODClient {
    constructor(uri, apiKey) {
        this.restClient = new RestClient.RestClient("rest-test", uri);
        this.apiKey = apiKey;
    }
    /*
    *
    * Sometimes todays data has not been set, in which case the API returns 404 until later in the day.
    */
    getAPODAsync(date = new Date(), hd = false) {
        return __awaiter(this, void 0, void 0, function* () {
            var dateFormat = require('dateformat');
            var dateString = dateFormat(date, "yyyy-mm-dd");
            let options = {
                queryParameters: {
                    params: {
                        "date": dateString,
                        "hd": hd ? "True" : "False",
                        "api_key": this.apiKey
                    }
                }
            };
            let response = yield this.restClient.get("/planetary/apod", options);
            return response;
        });
    }
}
exports.NASAAPODClient = NASAAPODClient;
//# sourceMappingURL=NASAAPODClient.js.map