//getting the data from link
let url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

//using d3 library to get the data
d3.json(url).then((data) => {
    console.log(data);
    data.names.forEach((name) => {
        d3.select("#selDataset").append("option").text(name).property("value", name);;   
    });
    d3.select("#selDataset").on("change",function(){
        //get the current selected value from dropdown
        let dropdownMenu = d3.select(this);
        let currentSelect=dropdownMenu.property("value");
        console.log(currentSelect);
        //calling 4 separate functions by passing the cureent selected value
        bars(currentSelect);
        bubbles(currentSelect);
        sampleMetaData(currentSelect);
        gauge(currentSelect);  
    });
});

//funtion to display Bar chart
function bars(currentSelect){
    d3.json(url).then((data) => {
        let sampleData=data.samples;// getting only samples data
        let currentSelectData = sampleData.filter(results=>results.id==currentSelect);// matching with currently selected ID
        currentSelectData=currentSelectData[0];
        otuIds=currentSelectData.otu_ids.slice(0, 10).reverse();//only first 10 IDS
        sampleValues=currentSelectData.sample_values.slice(0, 10).reverse();//only first 10 sample values
        otuLables=currentSelectData.otu_labels.slice(0, 10).reverse();//only first 10 lables
        console.log(otuIds,sampleValues,otuLables);
        
        var yticks = otuIds.map(otuID => `OTU ${otuID}`);
        //pass data to newPlot to draw the bar charts
        let trace = {
            y:yticks,
            x: sampleValues,
            text: otuLables.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };
        var layout = {
            title: "Top 10 Bacteria Cultures Found"   
        };
        Plotly.newPlot("bar", [trace], layout);
        });
    };
//function for Bubble Chart
function bubbles(currentSelect){
    d3.json(url).then((data) => {

        let sampleData=data.samples;// getting only samples data
        let currentSelectData = sampleData.filter(results=>results.id==currentSelect);// matching with currently selected ID
        currentSelectData=currentSelectData[0];
        otuIds=currentSelectData.otu_ids;
        sampleValues=currentSelectData.sample_values;
        otuLables=currentSelectData.otu_labels.slice(0, 10).reverse();
        console.log(otuIds,sampleValues,otuLables);
        //pass data to newPlot to draw the bubble chart
        var yticks = otuIds.map(otuID => `OTU ${otuID}`);
        let trace = {
            y:sampleValues,
            x: otuIds,
            text: otuLables,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "closest"
            }
        };
        var layout = {
            title: "Top 10 Bacteria Cultures Found"   
        };
        Plotly.newPlot("bubble", [trace], layout);
        });
    };


//function for sample meta data
function sampleMetaData(currentSelect){
    d3.json(url).then((data) => {
        let sampleData=data.metadata;//getting only meta data
        let currentSelectData = sampleData.filter(results=>results.id==currentSelect);
        d3.select('#sample-metadata').text('');
        currentSelectData=currentSelectData[0];
        Object.entries(currentSelectData).forEach(([key,value]) => {
            console.log(key,value);
            //select the demographic info html section with d3 and append new key-value pair
            d3.select('#sample-metadata').append('p').text(`${key}: ${value}`);
        });
        });
    };
    

function optionChanged(value){
    bars(value);
    bubbles(value);
    sampleMetaData(value);
    gauge(value);
};
//function for gauge chart
function gauge(currentSelect){
    d3.json(url).then((data) => {
    let sampleData=data.metadata;
    let currentSelectData = sampleData.filter(results=>results.id==currentSelect);
    currentSelectData=currentSelectData[0];
    let val=currentSelectData.wfreq;
    var dataG = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: val,
            title: { text: "Speed" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                bar: { color: "darkblue" },
                steps: [
                    { range: [0, 1], color: "rgb(233,245,248)" },
                    { range: [1, 2], color: "rgb(218,237,244)" },
                    { range: [2, 3], color: "rgb(203,230,239)" },
                    { range: [3, 4], color: "rgb(188,223,235)" },
                    { range: [4, 5], color: "rgb(173,216,230)" },
                    { range: [5, 6], color: "rgb(158,209,225)" },
                    { range: [6, 7], color: "rgb(143,202,221)" },
                    { range: [7, 8], color: "rgb(128,195,216)" },
                    { range: [8, 9], color: "rgb(113,187,212)" }
                ],
                }
        }

    ];            
    Plotly.newPlot('gauge', dataG);
    });
}


//calling init function so that first values' data can be showed on the page load
init();

function init(){
d3.json(url).then((data) => {
    console.log(data);
    data.names.forEach((name) => {
        d3.select("#selDataset").append("option").text(name).property("value", name);;   
    });    
    let currentSelect=data.names[0];
    console.log(currentSelect);
    bars(currentSelect);
    bubbles(currentSelect);
    sampleMetaData(currentSelect);
    gauge(currentSelect);  
});
}

  