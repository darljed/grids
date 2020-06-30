/*
 * Visualization source
 */
define([
    'jquery',
    'underscore',
    'api/SplunkVisualizationBase',
    'api/SplunkVisualizationUtils',
    'billboard.js',
    'd3'

    // Add required assets to this list
],
function(
    $,
    _,
    SplunkVisualizationBase,
    vizUtils,
    bb
) {
// Extend from SplunkVisualizationBase
return SplunkVisualizationBase.extend({

initialize: function() {
    SplunkVisualizationBase.prototype.initialize.apply(this, arguments);
    this.$el = $(this.el);

    
    this.id="chart-"+Math.floor((Math.random() * 1000) + 1);
    this.$el.append('<div class="grids-viz"><div id="'+this.id+'"></div></div>');
   
    // this.$el.append('<p>Edit your custom visualization app to render something here.</p>');
    
    // Initialization logic goes here
    
    
},

// Optionally implement to format data returned from search. 
// The returned object will be passed to updateView as 'data'
formatData: function(data) {

    // Format data
    var fieldsArr=[];
    for(var x=1;x<data.fields.length;x++){
        fieldsArr.push(Object.values(data.fields[x]))
    }
    this.categories=fieldsArr;
    data.fields=fieldsArr;
    // data.rows.splice(0,0,data.fields);

    return data;
},

// Implement updateView to render a visualization.
//  'data' will be the data object returned from formatData or from the search
//  'config' will be the configuration property object
updateView: function(data, config) {
    
    $("#"+this.id).html("");
    // Draw something here
    //tooltip
    var showTooltip=config[this.getPropertyNamespaceInfo().propertyNamespace + 'showTooltip'] || true;
    // var ttGroup=config[this.getPropertyNamespaceInfo().propertyNamespace + 'ttGroup'] || true;

    //x-axis
    var xLabel=config[this.getPropertyNamespaceInfo().propertyNamespace + 'xlabel'];
    var xPosition=config[this.getPropertyNamespaceInfo().propertyNamespace + 'xlabel-position'];
    var xGrid=config[this.getPropertyNamespaceInfo().propertyNamespace + 'xGrid'] || false;

    //y-axis
    var yLabel=config[this.getPropertyNamespaceInfo().propertyNamespace + 'ylabel'] ;
    var yPosition=config[this.getPropertyNamespaceInfo().propertyNamespace + 'ylabel-position'];
    var yGrid=config[this.getPropertyNamespaceInfo().propertyNamespace + 'yGrid'] || false;

    var axisRotation=config[this.getPropertyNamespaceInfo().propertyNamespace + 'axisRotation'] || false;

    //legend
    // var legendPosition=config[this.getPropertyNamespaceInfo().propertyNamespace + 'legendPosition'];

    this.chart = bb.bb.generate({
        data: {
          columns: data.rows,
          type: "bubble",
          labels: true,
          onclick: function(d) {
            // not called
            console.log(d);
          }
        },
        zoom: {
            enabled: {
              type: "drag"
            }
        },
        size: {
        height: 250,
        },
        bubble: {
          maxR: 50
        },
        axis: {
          x: {
            type: "category",
            categories: Object.values(data.fields),
            label: {
                text: xLabel,
                position: xPosition,
            }
          },
          y: {
            label: {
                text: yLabel,
                position: yPosition,
            }
          },
          rotated: (axisRotation == "true"),
        },
        tooltip: {
            show: (showTooltip == "true"),
        },
        grid: {
            x: {
              show: (xGrid == "true")
            },
            y: {
              show: (yGrid == "true")
            }
        },
        bindto: "#"+this.id
      });

    //   setTimeout(function(){
    //     chart.resize({height: 400, width: 300})
    //   },3000)

},

// Search data params
getInitialDataParams: function() {
    return ({
        outputMode: SplunkVisualizationBase.ROW_MAJOR_OUTPUT_MODE,
        count: 10000
    });
},

// Override to respond to re-sizing events
reflow: function() {
    this.chart.resize({height: this.$el.height(), width: this.$el.width()});
},

// Drilldown
drilldownToCategory: function(categoryName, categoryFieldValue, browserEvent) {
    var data = {};
    data[categoryName] = categoryFieldValue;

    this.drilldown({
        action: SplunkVisualizationBase.FIELD_VALUE_DRILLDOWN,
        data: data
    }, browserEvent);
},
drilldownToTimeRange: function(earliestTime, latestTime, browserEvent) {
  this.drilldown({
      earliest: earliestTime,
      latest: latestTime
  }, browserEvent);
}
});
});