import {NASAAPODClient} from "../../../Clients/NASAAPODClient/src/NASAAPODClient"
import {expect} from "chai"
import { assert } from "console";

describe("NASAAPODClient", ()  => {
    it("should get latest NASA APOD imagery when getAPOD is called", async () => {
        var nasaApodClient = new NASAAPODClient("https://api.nasa.gov", "0aJNryHORCh4Tm92eVkaBY5OiVeMBhQ6pegs6pWO");

        let date: Date = new Date(2020, 9, 4);        
        var result = await nasaApodClient.getAPODAsync(date);

        assert(result.statusCode == 200);
    });
});