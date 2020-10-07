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
exports.NASANeoWClient = exports.Miss_Distance = exports.Relative_Velocity = exports.Close_Approach_Data = exports.Feet = exports.Miles = exports.Meters = exports.Kilometers = exports.Estimated_Diameter = exports.Links1 = exports.Neo = exports.Links = exports.NeoCollection = void 0;
const RestClient = require("typed-rest-client/RestClient");
class NeoCollection {
}
exports.NeoCollection = NeoCollection;
class Links {
}
exports.Links = Links;
class Neo {
}
exports.Neo = Neo;
class Links1 {
}
exports.Links1 = Links1;
class Estimated_Diameter {
}
exports.Estimated_Diameter = Estimated_Diameter;
class Kilometers {
}
exports.Kilometers = Kilometers;
class Meters {
}
exports.Meters = Meters;
class Miles {
}
exports.Miles = Miles;
class Feet {
}
exports.Feet = Feet;
class Close_Approach_Data {
}
exports.Close_Approach_Data = Close_Approach_Data;
class Relative_Velocity {
}
exports.Relative_Velocity = Relative_Velocity;
class Miss_Distance {
}
exports.Miss_Distance = Miss_Distance;
class NASANeoWClient {
    constructor(uri, apiKey) {
        this.restClient = new RestClient.RestClient("rest-test", uri);
        this.apiKey = apiKey;
    }
    getNeoFeedAsync(startDate = new Date(), endDate = new Date()) {
        return __awaiter(this, void 0, void 0, function* () {
            var dateFormat = require('dateformat');
            var startDateString = dateFormat(startDate, "yyyy-mm-dd");
            var endDateString = dateFormat(endDate, "yyyy-mm-dd");
            let options = {
                queryParameters: {
                    params: {
                        "start_date": startDateString,
                        "end_date": endDateString,
                        "api_key": this.apiKey
                    }
                }
            };
            let response = yield this.restClient.get("/neo/rest/v1/feed", options);
            return response;
        });
    }
}
exports.NASANeoWClient = NASANeoWClient;
//# sourceMappingURL=NASANeoWClient.js.map