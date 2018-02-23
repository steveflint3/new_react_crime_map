import React, {Component} from 'react';
import 'ol/ol.css';
import GeoJSON from 'ol/format/geojson';
import Map from 'ol/map';
// import Vector from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import View from 'ol/view';
import ol from 'openlayers';
import TileLayer from 'ol/layer/tile';
import XYZSource from 'ol/source/xyz';
import Point from 'ol/geom/point';
import Feature from 'ol/feature';
import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';
import IconStyle from 'ol/style/icon';
import proj from 'ol/proj';
// import MVT from 'ol/format/mvt';
import interaction from 'ol/interaction';
import Select from 'ol/interaction/select';
// import condition from 'ol/events/condition';
// import style from './style.css';
import Overlay from 'ol/overlay';
import coordinate from 'ol/coordinate';
import myData from '/Users/steve/Documents/projects/new_react_crime_map/src/MurderMap/Coordinate.json';
import Vector from 'ol/layer/vector';
import Polygon from 'ol/geom/polygon';
import Text from 'ol/style/text';
import Zoom from 'ol/control/zoom';
import Heatmap from 'ol/layer/heatmap';
// import Source from 'ol/source/source';
// import VectorTileLayer from 'ol/layer/vectortile';
// import VectorTileSource from 'ol/source/vectortile';
// import {data} from './BaltimoreDistrict.json'
// import * as ReactDOM from "react-dom";
// import {
//   layer, custom, control, name spaces
//   Interactions, Overlays, Controls,     group
//   Layers, Util    objects
// } from "react-openlayers";

class HeatMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myData: myData[0],
      wasClicked: false
    };
  }

  loadMap = () => {
    if (this.props.data.length === 0) {
      return (console.log("LOADING!!!"))
    } else {
      this.initMap();
    }
  }

  initBaseLayer = () => {
    const baseLayer = new TileLayer({
        source: new XYZSource({url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'})
    })
    return baseLayer
  }

  initHeatMapLayer = () => {
    console.log("init layer");
    const heatmapLayer = new Heatmap({
      //get into source below and getFeaturesAtCoordinate
      source: new VectorSource({format: new GeoJSON(), url: 'https://raw.githubusercontent.com/acanimal/thebookofopenlayers3/master/app/data/world_cities.json'}),
      ////////////////////
      // style: new Style({
      //   stroke: new Stroke({
      //     color: [
      //       250, 250, 250
      //     ],
      //     width: 3.5
      //   }),
      //   fill: new Fill({color: 'rgba(173, 152, 193, 0.25)'})
      // })
    })
    return heatmapLayer
  }

  // Create a tile layer from OSM
  // initOsmLayer = () => {
  //   var osmLayer = new ol.layer.Tile({source: new ol.source.OSM()});
  //   return osmLayer
  // }

  // Create the map with the previous layers
  initMap = (heatmapLayer, baseLayer) => {
    console.log("heatmapLayerVar and osmLayerVar 11111111")
    const heatmapLayerVar = this.initHeatMapLayer();
    const baseLayerVar = this.initBaseLayer();
    // const osmLayerVar = this.initOsmLayer();
    console.log("heatmapLayerVar and osmLayerVar 22222222", heatmapLayerVar)
  var map = new Map({
    target: 'map', // The DOM element that will contains the map
    // renderer: 'canvas', // Force the renderer to be used
    layers: [
      baseLayerVar
    ],
    // Create a view centered on the specified location and zoom level
    view: new View({
      center: ol.proj.transform([
        2.1833, 41.3833
      ], 'EPSG:4326', 'EPSG:3857'),
      zoom: 4
    })
  });
  map.addLayer(heatmapLayerVar)
}

  render() {
    console.log("Gimme them props mannnn", this.props.data)
    console.log("This is myData[0] state", this.state.myData)
    // console.log("HEAT lON LAT!!!!=>>>>>", this.props.heatLonLat)
    return (<div>
      <div>Hello</div>
      <div id="map" onLoad={this.loadMap()}>
      </div>
    </div>);
  }
}

export default HeatMap;
