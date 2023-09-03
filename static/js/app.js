const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch JSON data
d3.json(url).then(function(data) {
    console.log(data);

    let selector = d3.select("#selDataset");
    var sample_ids = data.names;

    sample_ids.forEach((id) => {
        selector
        .append("option")
        .text(id)
        .property("value", id);
    });

    // Initialize the page with default data
    buildChartInfo(sample_ids[0]);
    buildMetadata(sample_ids[0]);
});

// Update info when new ID is selected
function optionChanged(newID) {
    buildChartInfo(newID);
    buildMetadata(newID);
}

//Building the Metadata box
function buildMetadata(id) {
    d3.json(url).then((data) => { 
        let metadata = data.metadata;
        let resultsArray = metadata.filter(sampleObj => sampleObj.id == id);
        let result = resultsArray[0];
        let PANEL = d3.select("#sample-metadata");
        
        PANEL.html("");

        Object.entries(result).forEach(([key,value]) => {
            PANEL.append("h6").text(`${key}: ${value}`); 
        });
    });
};

//Building Bar and Bubble charts
function buildChartInfo(id) {
    d3.json(url).then((data) => {
        let sample_values = data.samples;
        // Filter the data based on the selected ID
        let result = sample_values.find(sampleObj => sampleObj.id == id);

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels.slice(0, 10).reverse();
        let sample = result.sample_values.slice(0, 10).reverse();

        let Y_labels = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        console.log("Y-labels:", Y_labels);

        // Trace1 for the Bar Chart
        let trace1 = {
            x: sample,
            y: Y_labels,
            text: otu_labels,
            type: "bar",
            orientation: "h"
        };
        
        // Data array for the Bar Chart
        let barData = [trace1];

        // Layout for the Bar Chart
        let barLayout = {
            height: 550,
            yaxis: {automargin:true},
            margin: {
                l: 0,
                r: 50,
                t: 100,
                b: 150
            }
        };

        // Render the Bar Chart
        Plotly.newPlot("bar", barData, barLayout);

        // Trace2 for the Bubble Chart
        let trace2 = [{
            x: otu_ids,
            y: result.sample_values,
            text: result.otu_labels,
            mode: 'markers',
            marker: {
                size: result.sample_values,
                color: otu_ids,
                colorscale: 'Picnic'
            }
        }];

        // Layout for the Bubble Chart
        let bubbleLayout = {
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Values" },
            height: {automargin:true},
        };

        // Render the Bubble Chart
        Plotly.newPlot('bubble', trace2, bubbleLayout);
    });
}
