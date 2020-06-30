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

  
  this.id="chart-gauge"+Math.floor((Math.random() * 1000) + 1);
  this.$el.append('<div class="grids-viz"><div id="'+this.id+'"></div></div>');
 
  // this.$el.append('<p>Edit your custom visualization app to render something here.</p>');
  
  // Initialization logic goes here
  
  
},

// Optionally implement to format data returned from search. 
// The returned object will be passed to updateView as 'data'
formatData: function(data) {

  // Format data

  return data;
},

// Implement updateView to render a visualization.
//  'data' will be the data object returned from formatData or from the search
//  'config' will be the configuration property object
updateView: function(data, config) {
  
  $("#"+this.id).html("");
  // Draw something here
  //tooltip
  // var showTooltip=config[this.getPropertyNamespaceInfo().propertyNamespace + 'showTooltip'] || true;
  // // var ttGroup=config[this.getPropertyNamespaceInfo().propertyNamespace + 'ttGroup'] || true;

  // //x-axis
  // var xLabel=config[this.getPropertyNamespaceInfo().propertyNamespace + 'xlabel'];
  // var xPosition=config[this.getPropertyNamespaceInfo().propertyNamespace + 'xlabel-position'];
  // var xGrid=config[this.getPropertyNamespaceInfo().propertyNamespace + 'xGrid'] || false;

  // //y-axis
  // var yLabel=config[this.getPropertyNamespaceInfo().propertyNamespace + 'ylabel'] ;
  // var yPosition=config[this.getPropertyNamespaceInfo().propertyNamespace + 'ylabel-position'];
  // var yGrid=config[this.getPropertyNamespaceInfo().propertyNamespace + 'yGrid'] || false;

  // var axisRotation=config[this.getPropertyNamespaceInfo().propertyNamespace + 'axisRotation'] || false;

  //legend
  // var legendPosition=config[this.getPropertyNamespaceInfo().propertyNamespace + 'legendPosition'];

  this.chart = bb.bb.generate({
      data: {
        columns: data.rows,
        type: "gauge"
      },
      size:{
        height: (this.$el.height() - 20)
      },
      gauge: {
        fullCircle: true
      },
      bindto: "#"+this.id
    });
    
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
  this.chart.resize({height: (this.$el.height() - 20), width: this.$el.width()});
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