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
const NASANeoWClient_1 = require("../../../Clients/NASAAPODClient/src/NASANeoWClient");
const console_1 = require("console");
describe("NASANeoWClient", () => {
    it("should get list of Near Earth Objects when getNeoFeed is called", () => __awaiter(void 0, void 0, void 0, function* () {
        var nasaNeoWClient = new NASANeoWClient_1.NASANeoWClient("https://api.nasa.gov", "0aJNryHORCh4Tm92eVkaBY5OiVeMBhQ6pegs6pWO");
        let startDate = new Date(2020, 9, 1);
        let endDate = new Date(2020, 9, 4);
        var result = yield nasaNeoWClient.getNeoFeedAsync(startDate, endDate);
        console_1.assert(result.statusCode == 200);
    }));
});
//# sourceMappingURL=NASANeoWClientTests.js.map