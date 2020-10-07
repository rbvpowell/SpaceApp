import {NASANeoWClient} from "../../../Clients/NASAAPODClient/src/NASANeoWClient"
import {expect} from "chai"
import { assert } from "console";

describe("NASANeoWClient", ()  => {
    it("should get list of Near Earth Objects when getNeoFeed is called", async () => {
        var nasaNeoWClient = new NASANeoWClient("https://api.nasa.gov", "0aJNryHORCh4Tm92eVkaBY5OiVeMBhQ6pegs6pWO");

        let startDate: Date = new Date(2020, 9, 1);
        let endDate: Date = new Date(2020, 9, 4);
        var result = await nasaNeoWClient.getNeoFeedAsync(startDate, endDate);

        assert(result.statusCode == 200);
    });
});