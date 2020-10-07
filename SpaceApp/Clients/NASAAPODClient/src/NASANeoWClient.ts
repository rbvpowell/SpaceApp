import * as RestClient from "typed-rest-client/RestClient"
import * as RestClientInterfaces from 'typed-rest-client/Interfaces';
import * as util from 'typed-rest-client/Util';

export class NeoCollection
{
    links: Links;
    element_count: Number;
    near_earth_objects: any[];
}

export class Links
{
    next: String;
    prev: String;
    self: String;
}

export class Neo
{
    links: Links1;
    id: String;
    neo_reference_id: String;
    name: String;
    nasa_jpl_url: String
    absolute_magnitude_h: Number;
    estimated_diameter: Estimated_Diameter;
    is_potentially_hazardous_asteroid: Boolean;
    close_approach_data: Close_Approach_Data[];
    is_sentry_object: Boolean;
}

export class Links1
{
    self: String;
}

export class Estimated_Diameter
{
    kilometers: Kilometers;
    meters: Meters;
    miles: Miles;
    feet: Feet;
}

export class Kilometers
{
    estimated_diameter_min: Number;
    estimated_diameter_max: Number;
}

export class Meters
{
    estimated_diameter_min: Number;
    estimated_diameter_max: Number;
}

export class Miles
{
    estimated_diameter_min: Number;
    estimated_diameter_max: Number;
}

export class Feet
{
    estimated_diameter_min: Number;
    estimated_diameter_max: Number;
}

export class Close_Approach_Data
{
    close_approach_date: String;
    close_approach_date_full: String;
    epoch_date_close_approach: Number;
    relative_velocity: Relative_Velocity;
    miss_distance: Miss_Distance;
    orbiting_body: String;
}

export class Relative_Velocity
{
    kilometers_per_second: String;
    kilometers_per_hour: String;
    miles_per_hour: String;
}

export class Miss_Distance
{
    astronomical: String;
    lunar: String;
    kilometers: String;
    miles: String;
}

export class NASANeoWClient {
    restClient: RestClient.RestClient;
    apiKey: string;

    constructor(uri: string, apiKey: string) {
        this.restClient = new RestClient.RestClient("rest-test", uri);
        this.apiKey = apiKey;
    }

    async getNeoFeedAsync(startDate: Date = new Date(), endDate: Date = new Date()) {
        var dateFormat = require('dateformat');
        var startDateString: string = dateFormat(startDate, "yyyy-mm-dd");
        var endDateString: string = dateFormat(endDate, "yyyy-mm-dd");

        let options: RestClient.IRequestOptions = {
            queryParameters: {
                params: {
                    "start_date": startDateString,
                    "end_date": endDateString,
                    "api_key": this.apiKey
                }
            }
        }

        let response: RestClient.IRestResponse<NeoCollection> = await this.restClient.get<NeoCollection>("/neo/rest/v1/feed", options);
        
        return response;
    }
}