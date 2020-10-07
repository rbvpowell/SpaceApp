/// <reference path="../node_modules/@types/jquery/index.d.ts"/>
import {NASAAPODClient} from "../../../Clients/NASAAPODClient/src/NASAAPODClient"
import {NASANeoWClient} from "../../../Clients/NASAAPODClient/src/NASANeoWClient"

class NASAService {
    apodClient: NASAAPODClient;
    neoWClient: NASANeoWClient;

    constructor() {
        var url = "https://api.nasa.gov";
        var apiKey = "0aJNryHORCh4Tm92eVkaBY5OiVeMBhQ6pegs6pWO";
        this.apodClient = new NASAAPODClient(url, apiKey);
        this.neoWClient = new NASANeoWClient(url, apiKey);
    }

    async getAPODAsync(date) {
        try {
            var apod = await this.apodClient.getAPODAsync(date, true);
        } catch(er) {
            date.setDate(date.getDate() - 1);
            apod = await this.apodClient.getAPODAsync(date, true);
        }
        
        // NASA may not have yet selected the picture of the day, in which case, the previous day should be tried.
        if ((apod.statusCode == 400) || (apod.statusCode == 404)) {
            date.setDate(date.getDate() - 1);
            apod = await this.apodClient.getAPODAsync(date, true);
        }

        return apod.result;
    }
    
    async getNeosAsync() {
        let date = new Date();
        var neos = await this.neoWClient.getNeoFeedAsync(date, date);
        
        return neos.result ;
    }

    generateCardPromise(date: Date) {
        return new Promise((resolve, reject) => {
            this.generateCard(date, resolve, reject);
        });
    }
    
    generateCard(date: Date, resolve, reject) {
        var imagePromise = nasaService.getAPODAsync(date);
        imagePromise.then((apod) => {
            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec(apod.url)[1]; 
            var isVideo = ext.indexOf("/") !== -1;
            var apodCardContainer = $("<div class='apodCardContainer flip-card-container'>");
            var apodCard = $("<div class='apodCard'>");
            if(!isVideo) {
                apodCard.addClass("flip-card");
            }

            var apodCardFront = $("<div class='card-front'>");

            if (isVideo) {
                var video = $("<iframe class='cardVideo' src=\"" + apod.url + "\"></iframe>");
                apodCardFront.append(video);   
            } else {
                var cardImage = $("<img class='cardImage' src=\"" + apod.url + "\" />");
                apodCardFront.append(cardImage);   
            }
            
            var cardClose = $("<button class='cardCloseFront' onClick='$(\".modalContent\").removeClass(\"show\"); $(\".uiButtonList\").removeClass(\"invisible\");'>X</button>");
            apodCardFront.append(cardClose);
    
            apodCard.append(apodCardFront);

            var apodCardBack = $("<div class='card-back'>");

            var cardBackBody = $("<div class='cardBackBody'>");

            var cardTitle = $("<div class='cardTitle'>" + apod.title + "</div>");
            cardBackBody.append(cardTitle);
    
            var cardDate = $("<div class='cardDate'>" + apod.date + "</div>");
            cardBackBody.append(cardDate);
    
            var cardDescription = $("<div class='cardDescription'>" + apod.explanation + "</div>");
            cardBackBody.append(cardDescription);

            apodCardBack.append(cardBackBody);
            
            var cardCloseBack = $("<button class='cardCloseBack' onClick='$(\".modalContent\").removeClass(\"show\"); $(\".uiButtonList\").removeClass(\"invisible\");'>X</button>");
            apodCardBack.append(cardCloseBack);

            apodCard.append(apodCardBack);
            apodCardContainer.append(apodCard);
            $("#loading").before(apodCardContainer);
            resolve();
        });
    }

    updateFilter() {
        var selectField = (<HTMLSelectElement>this.fieldSelect[0]);
        var selectType = (<HTMLSelectElement>this.typeSelect[0]);
        var inputValue = (<HTMLInputElement>this.valueInput[0]);

        var filterVal = selectField.options[selectField.selectedIndex].value;
        var typeVal = selectType.options[selectType.selectedIndex].value;
      
        // var filter = filterVal == "function" ? customFilter : filterVal;
      
        if(filterVal == "function" ){
            selectType.disabled = true;
            inputValue.disabled = true;
        } else {
            selectType.disabled = false;
            inputValue.disabled = false;
        }
      
        if(filterVal){
            this.neoTable.setFilter(filterVal,typeVal, inputValue.value);
        }
    }

    neoTable: any;
    fieldSelect: JQuery;
    typeSelect: JQuery;
    valueInput: JQuery;
    generateNeoTable() {        
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        var self = this;

        var neosPromise = nasaService.getNeosAsync();
        neosPromise.then((neos) => {
            $(document).ready(function () {
                var modal = $("<div class='modalContent' id='neoModal'>");
                var modalHeader = $("<div class='modalHeader'>");

                var modalHeaderText = $("<div class='modalHeaderText'>");

                var date = new Date();
                modalHeaderText.text("Nearest earth objects - " + date.getFullYear() + "-" + zeroPad(date.getMonth(), 2) + "-" + zeroPad(date.getDate(), 2));
                modalHeader.append(modalHeaderText);

                var modalClose = $("<button class='modalClose' onClick='$(\".modalContent\").removeClass(\"show\"); $(\".uiButtonList\").removeClass(\"invisible\");'>X</button>");
                modalHeader.append(modalClose);

                modal.append(modalHeader);
                
                var modalBody = $("<div class='modalBody'>");

                var tabulatorWrapper = $("<div class=\"tabulatorWrapper\">");

                var tableFilter = $("<div id=\"neoFilter\">");
                
                var fieldLabel = $("<div class='filterLabel'>Field: </div>");
                tableFilter.append(fieldLabel);

                self.fieldSelect = $("<select id=\"filter-field\">");
                self.fieldSelect.change(function() {
                    self.updateFilter();
                });
                
                var emptyOption = $("<option></option>"); self.fieldSelect.append(emptyOption);
                var nameOption = $("<option value=\"name\">Name</option>"); self.fieldSelect.append(nameOption);
                var urlOption = $("<option value=\"nasa_jpl_url\">URL</option>"); self.fieldSelect.append(urlOption);
                var magnitudeOption = $("<option value=\"absolute_magnitude_h\">Magnitude</option>"); self.fieldSelect.append(magnitudeOption);
                var hazardousOption = $("<option value=\"is_potentially_hazardous_asteroid\">Potentially Hazardous</option>"); self.fieldSelect.append(hazardousOption);
                var distanceOption = $("<option value=\"miss_distance\">Miss distance</option>"); self.fieldSelect.append(distanceOption);
                var orbitingOption = $("<option value=\"orbiting_body\">Orbiting body</option>"); self.fieldSelect.append(orbitingOption);
                var velocityOption = $("<option value=\"relative_valocity\">Velocity</option>"); self.fieldSelect.append(velocityOption);
                var collisionOption = $("<option value=\"is_sentry_object\">Collision predicted</option>"); self.fieldSelect.append(collisionOption);
                tableFilter.append(self.fieldSelect);

                var typeLabel = $("<div class='filterLabel'>Type: </div>");
                tableFilter.append(typeLabel);

                self.typeSelect = $("<select id=\"filter-type\">");
                self.typeSelect.change(function() {
                    self.updateFilter();
                });

                var likeOption = $("<option value=\"like\">like</option>"); self.typeSelect.append(likeOption);
                var equalsOption = $("<option value=\"=\">=</option>"); self.typeSelect.append(equalsOption);        
                var lessThanOption = $("<option value=\"<\"><</option>"); self.typeSelect.append(lessThanOption);
                var lessThanOrEqualOption = $("<option value=\"<=\"><=</option>"); self.typeSelect.append(lessThanOrEqualOption);
                var greaterThanOption = $("<option value=\">\">></option>"); self.typeSelect.append(greaterThanOption);
                var greaterThanOrEqualOption = $("<option value=\">=\">>=</option>"); self.typeSelect.append(greaterThanOrEqualOption);
                var notEqualOption = $("<option value=\"!=\">!=</option>"); self.typeSelect.append(notEqualOption);
                tableFilter.append(self.typeSelect);

                var valueLabel = $("<div class='filterLabel'>Value: </div>");
                tableFilter.append(valueLabel);

                self.valueInput = $("<input id=\"filter-value\" type=\"text\" placeholder=\"value to filter\">");
                self.valueInput.keyup(function() {
                    self.updateFilter();
                });

                tableFilter.append(self.valueInput);

                var clearButton = $("<button id=\"filter-clear\">Clear filter</button>");
                clearButton.click(function() {
                    self.fieldSelect.val("");
                    self.typeSelect.val("like");
                    self.valueInput.val("");
                    self.neoTable.clearFilter();
                });

                tableFilter.append(clearButton);

                tabulatorWrapper.append(tableFilter);

                var tableDiv = $("<div id=\"neoTable\">");
                tabulatorWrapper.append(tableDiv);

                modalBody.append(tabulatorWrapper);
                
                modal.append(modalBody);

                $(".targetArea").append(modal);

                for (var prop in neos.near_earth_objects) {
                    if (Object.prototype.hasOwnProperty.call(neos.near_earth_objects, prop)) {
                        var data = [neos.near_earth_objects[prop].length];
                        for (var a = 0; a < neos.near_earth_objects[prop].length; a++) {
                            var unformatted = neos.near_earth_objects[prop][a];
                            data[a] = {};
                            data[a].name = unformatted.name;
                            data[a].nasa_jpl_url = unformatted.nasa_jpl_url;
                            data[a].absolute_magnitude_h = unformatted.absolute_magnitude_h;
                            data[a].is_potentially_hazardous_asteroid = unformatted.is_potentially_hazardous_asteroid;
                            data[a].miss_distance = unformatted.close_approach_data[0].miss_distance.kilometers;
                            data[a].orbiting_body = unformatted.close_approach_data[0].orbiting_body;
                            data[a].relative_valocity = unformatted.close_approach_data[0].relative_velocity.kilometers_per_second;
                            data[a].is_sentry_object = unformatted.is_sentry_object;
                        }

                        var Tabulator = require('tabulator-tables');
                        self.neoTable = new Tabulator("#neoTable", {
                            data: data,
                            columns:[
                                {title:"Name", field:"name"},                        
                                {title:"URL", field:"nasa_jpl_url", formatter: "link"},
                                {title:"Magnitude", field:"absolute_magnitude_h"},
                                {title:"Potentially Hazardous", field:"is_potentially_hazardous_asteroid",  hozAlign:"center", formatter:"tickCross", sorter:"boolean"},
                                {title:"Miss distance (km)", field:"miss_distance"},
                                {title:"Orbiting body", field:"orbiting_body"},
                                {title:"Velocity (km/s)", field:"relative_valocity"},
                                {title:"Collision predicted", field:"is_sentry_object",  hozAlign:"center", formatter:"tickCross", sorter:"boolean"}
                            ]
                        });

                        return;
                    }
                }        
            });
        });
    }
}

var nasaService = new NASAService();
let date = new Date();
var imagePromise = nasaService.getAPODAsync(date);
imagePromise.then((apod) => {
    $(document).ready(function() {
        var modal = $("<div class='modalContent' id='apodModal'>");
        var modalHeader = $("<div class='modalHeader'>");
        
        var modalHeaderText = $("<div class='modalHeaderText'>");
        modalHeaderText.text("Astronomical picture of the day - " + apod.date);
        modalHeader.append(modalHeaderText);

        var modalClose = $("<button class='modalClose' onClick='$(\".modalContent\").removeClass(\"show\"); $(\".uiButtonList\").removeClass(\"invisible\");'>X</button>");
        modalHeader.append(modalClose);

        modal.append(modalHeader);
        
        var modalBody = $("<div class='modalBody'>");
        
        var pictureBoxImageWrapper = $("<div class='pictureBoxImageWrapper'>");

        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(apod.url)[1]; 
        var isVideo = ext.indexOf("/") !== -1;
        if(isVideo) {
            var video = $("<iframe class='pictureBoxVideo' width=\"420\" height=\"315\" src=\"" + apod.url + "\"></iframe>");
            pictureBoxImageWrapper.append(video);
        } else {
            var pictureBoxImage = $("<img class='pictureBoxImage' src=\"" + apod.url + "\" />");
            pictureBoxImageWrapper.append(pictureBoxImage);   
            
            var pictureBoxOverlay = $("<div class='pictureBoxOverlay'>");
            var pictureBoxContent = $("<div class='pictureBoxContent'>");

            var pictureBoxClose = $("<div class='pictureBoxClose' onClick='$(\".pictureBoxOverlay\").addClass(\"hide\"); $(\".pictureBoxOpen\").removeClass(\"hide\");'>ᐯ</div>");
            pictureBoxContent.append(pictureBoxClose);

            var pictureBoxTitle = $("<div class='pictureBoxTitle'>" + apod.title + "</div>");
            pictureBoxContent.append(pictureBoxTitle);

            var pictureBoxDescription = $("<div class='pictureBoxDescription'>" + apod.explanation + "</div>");
            pictureBoxContent.append(pictureBoxDescription);

            pictureBoxOverlay.append(pictureBoxContent);
            pictureBoxImageWrapper.append(pictureBoxOverlay);

            var pictureBoxOpen = $("<div class='pictureBoxOpen hide' onClick='$(\".pictureBoxOverlay\").removeClass(\"hide\"); $(\".pictureBoxOpen\").addClass(\"hide\");'>ᐱ</div>");
            pictureBoxImageWrapper.append(pictureBoxOpen);
        }
        
        modalBody.append(pictureBoxImageWrapper);
        modal.append(modalBody);
        $(".targetArea").append(modal);
    });
});

$(document).ready(async function() {
    var modal = $("<div class='modalContent' id='apodsModal'>");
    var modalInner = $("<div class='modalInner'>");
    modal.append(modalInner);

    // var scrollable = modal[0];
    // scrollable.addEventListener('mousedown', function(event) {
    //     this.style.pointerEvents = "none";
    //     //document.elementFromPoint(event.clientX, event.clientY).click();
    // }, false);

    // modalInner[0].addEventListener('mouseup', function(e) {
    //     scrollable.style.pointerEvents = "all";
    // }, false);

    $(".targetArea").append(modal);
    
    var loading = $("<div id='loading' class='loading hidden'>Loading...</div>");
    modalInner.append(loading);
    
    var count = 0;
    setInterval(function(){
        count++;
        var dots = new Array(count % 3).join('.');
        document.getElementById('loading').innerHTML = "Loading" + dots;
    }, 1000);

    var count = 0;
    for(var a = 1; a < 22; a++) {
        let date = new Date();
        count++;
        date.setDate(date.getDate() - count);
        await nasaService.generateCardPromise(date);
        count++;
    }

    modal.scroll(async function() {
        if(modal.scrollTop() + modal.height() > modalInner.height() - 50) {
            loading.removeClass("hidden");

            if(!loadingAPODs) {
                loadingAPODs = true;
                for(var a = 1; a < 22; a++) {
                    let date = new Date();
                    count++;
                    date.setDate(date.getDate() - count);
                    await nasaService.generateCardPromise(date);
                    count++;
                }
                
                loadingAPODs = false;
            }
        }
     });
});

var loadingAPODs = false;

nasaService.generateNeoTable();