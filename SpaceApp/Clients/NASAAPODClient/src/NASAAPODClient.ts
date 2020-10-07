import * as RestClient from "typed-rest-client/RestClient"
import * as RestClientInterfaces from 'typed-rest-client/Interfaces';
import * as util from 'typed-rest-client/Util';
import {APOD} from "./Models/APOD"

export class NASAAPODClient {
    restClient: RestClient.RestClient;
    apiKey: string;

    constructor(uri: string, apiKey: string) {
        this.restClient = new RestClient.RestClient("rest-test", uri);
        this.apiKey = apiKey;
    }

    /*
    *
    * Sometimes todays data has not been set, in which case the API returns 404 until later in the day.
    */
    async getAPODAsync(date: Date = new Date(), hd: boolean = false) {
        var dateFormat = require('dateformat');
        var dateString: string = dateFormat(date, "yyyy-mm-dd");

        let options: RestClient.IRequestOptions = {
            queryParameters: {
                params: {
                    "date": dateString,
                    "hd": hd ? "True" : "False",
                    "api_key": this.apiKey
                }
            }
        }

        let response: RestClient.IRestResponse<APOD> = await this.restClient.get<APOD>("/planetary/apod", options);        
        return response;
    }
}