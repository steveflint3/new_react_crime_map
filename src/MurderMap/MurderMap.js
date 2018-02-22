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
import style from './style.css';
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

class MurderMap extends Component {
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
      this.buildLongLatArrays();
    }
  }

  initLayer = () => {
    console.log("init layer");
    const url = 'https://data.baltimorecity.gov/api/views/h3fx-54q3/rows.geojson';
    const layer = new Vector({
      //get into source below and getFeaturesAtCoordinate
      source: new VectorSource({format: new GeoJSON(), url: url}),
      ////////////////////
      style: new Style({
        stroke: new Stroke({
          color: [
            250, 250, 250
          ],
          width: 3.5
        }),
        fill: new Fill({color: 'rgba(173, 152, 193, 0.25)'})
      })
    })
    return layer;
  }

  initVector = (position) => {
    console.log("initVector");
    const vector = new Vector({source: position});
    vector.setStyle(new Style({
      image: new IconStyle({src: 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/32/map-marker-icon.png'})
    }));
    return vector
  }

  // initHeatMapLayer = () => {
  //   console.log("Here is the heatmap", ol.layer.Heatmap)
  //   const heatMapLayer = new Heatmap({
  //     // source: new GeoJSON({
  //     //   url: 'https://data.baltimorecity.gov/api/views/h3fx-54q3/rows.geojson',
  //     //   projection: 'EPSG:3857'
  //     // }),
  //     source: new VectorSource({format: new GeoJSON(), url: 'https://data.baltimorecity.gov/api/views/h3fx-54q3/rows.geojson'}),
  //             // opacity: 0.9
  //         });
  //         console.log("Here is the heatmap layer", ol.layer.Heatmap)
  //         return heatMapLayer
  //       }

  initMap = (obj, loopVar, dateArrayState, descArrayState, distArrayState, locationArrayState, inAndOutArrayState, weaponArrayState) => {
    console.log("init map");
    // let dataArrayStateIT = [];
    const position = new VectorSource()
    const layer = this.initLayer()
    const vector = this.initVector(position)
    // const heatMapLayer = this.initHeatMapLayer()
    // console.log("Right after heat map init", heatMapLayer)

    this.createMap(layer, vector, obj, loopVar, dateArrayState, descArrayState, distArrayState, locationArrayState, inAndOutArrayState, weaponArrayState, position);
    console.log("AAAAA", loopVar);
    // for (let i = 0; i < loopVar.length; i++) {
    //   const point = new Point(loopVar[i]);
    //   const desc = descArrayState[i];
    //   const crimeDate = dateArrayState[i];
    //   const dist = distArrayState[i];
    //   const loca = locationArrayState[i];
    //   const innyOutty = inAndOutArrayState[i];
    //   const weap = weaponArrayState[i];
    //   let feature = new Feature({
    //     geometry: point,
    //     crimeDate: crimeDate,
    //     desc: desc,
    //     dist: dist,
    //     loca: loca,
    //     innyOutty: innyOutty,
    //     weap: weap
    //   });
    //       position.addFeature(feature);
    // }
    //////trying to return feature, the iterated feature, so that you can pass it to a function you can define in global space and then call in the click function where the zoom function is
    //position.addFeature originally went here
    // return this.feature;
  }

  mapLatLongCoordCollection = (array) => {
    return array.map((coordCollectionArray, i) => {
      return {firstNeighborhoodCoordinates: coordCollectionArray[0]}
    })
  }

  createMap = (lay, vec, obj, loopVar, dateArrayState, descArrayState, distArrayState, locationArrayState, inAndOutArrayState, weaponArrayState, position) => {
    console.log("creating map");

    let selectInteraction = new Select({
      condition: ol.events.condition.pointerMove,
      style: new Style({
        stroke: new Stroke({
          color: [
            155, 155, 0
          ],
          width: 3.5
        }),
        fill: new Fill({color: 'rgba(0, 0, 0, 0.02)'})
      })
    });

    // console.trace();

    const map = new Map({
      target: 'map-container',
      layers: [new TileLayer({
          source: new XYZSource({url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'})
        })],
      view: new View({
        center: proj.fromLonLat([this.props.longitude, this.props.latitude]),
        zoom: 12.3
      })
    })

    const overlay = new Overlay({
      element: document.getElementById('popup-container'),
      positioning: 'bottom-center',
      offset: [0, -10]
    });
    //
    // const neighborhood = new Overlay({
    //   element: map,
    //   style:
    // })
 //    const heatMapLayer = new Heatmap({
 //    // const data = new VectorSource();
 // //    var pointFeature = new ol.Feature({
 // //     geometry: lonLat,
 // //     weight: 20 // e.g. temperature
 // // });
 //       source: new VectorSource(),
 //       radius: 50
 //   });

    map.addOverlay(overlay)
    map.addLayer(lay)
    map.addLayer(vec)
    // map.addLayer(heatMapLayer)

    ////////////Overlay added with popupfeatures in createMap function/
    var clicked;

    var highlight;

    var featureToRemove;

    var cursorSet;

    map.on('pointermove', (e) => {

      if (cursorSet)
        return;
      if (e.dragging)
        return;
      var pixel = map.getEventPixel(e.originalEvent);
      var hit = map.hasFeatureAtPixel(pixel);
      // console.log("Place break point here")
      if (hit) {
        var feature = map.forEachFeatureAtPixel(e.pixel, function(feat) {
          // console.log("feat", feat.values_.geometry.flatCoordinates)
          if (clicked && feat) {
            e.map.getTargetElement().style.cursor = hit
              ? 'pointer' : '';
            cursorSet = true;
            return;
          }
          // featureToRemove = feat;
          if (!clicked && feat !== highlight) {
            if (highlight) {
              console.log("1");
            }
            if (!clicked && feat) {
              //check to see it is not a marker
              console.log("Check out my feat", feat)

              if(feat.values_.nbrdesc) {
              map.addInteraction(selectInteraction);
              const districtName = document.getElementById('districtName');
              districtName.innerHTML = "Neighborhood Name: " + feat.values_.label + " " + "Coordinates: " + " " + feat.geometryChangeKey_.target.flatCoordinates[0] + ", " + feat.geometryChangeKey_.target.flatCoordinates[1];
              }
            }
            highlight = feat;
          }
        });
      } else {
        // console.log("do something ELSE")
        if (!clicked && highlight) {
          highlight = null;
          console.log("Inside the if nested in else")
        }
      }
    });

    map.on('click', (e) => {
      let iteratedLayArray = [];
      let iteratedCoordArray = [];
      const coordCollectionForComparison = [];
      overlay.setPosition();
      var features = map.getFeaturesAtPixel(e.pixel);

      if (features) {
        let coords = features[0].getGeometry().getCoordinates();
        let descriptionDisplay = features[0].get('desc');
        let crimeDateDisplay = features[0].get('crimeDate');
        let distDisplay = features[0].get('dist');
        let locaDisplay = features[0].get('loca');
        let innyOuttyDisplay = features[0].get('innyOutty');
        let weaponDisplay = features[0].get('weap');
        let hdms = coordinate.toStringHDMS(proj.toLonLat(coords));
        this.iterateCoords = () => {
          for (let i = 0; i < coords.length; i++) {
            for (let j = 0; j < coords[i].length; j++) {
              iteratedCoordArray.push(coords[i][j]);
            }
          }
        }

        if (features[0].get('desc') === 'HOMICIDE') {
          overlay.getElement().innerHTML = '<div> <u>Crime Description</u> </div>' + descriptionDisplay + '<div> <u>Weapon</u> </div>' + weaponDisplay + '<div> <u>Crime Date</u> </div>' + crimeDateDisplay + '<div> <u>District</u> </div>' + distDisplay + '<div> <u>Location</u> <div>' + locaDisplay + '<div> <u>Environment</u> </div>' + innyOuttyDisplay + '<div> <u>Coordinates</u> </div>' + hdms;
          overlay.setPosition(coords);
        } else {

          const groupCoordCollection = this.mapLatLongCoordCollection(iteratedLayArray);

          for (let i = 0; i < groupCoordCollection.length; i++) {

            coordCollectionForComparison.push(groupCoordCollection[i].firstNeighborhoodCoordinates);
          }

          this.iterateCoords();
        }

      }

      if(features){
      function centerMap() {
        map.getView().setCenter(e.coordinate);
        map.getView().setZoom(14);
      }

      // if (currentObjectFromArray['description'].toUpperCase() === desc.toUpperCase()) {
      //           // console.log(currentObjectFromArray['description'].toUpperCase() === desc.toUpperCase());
      //           result.push(this.state.data[i]);
      //
      //         //  console.log("description --- " + JSON.stringify(desc));
      //         }
///////////////////////////////// YOU WERE IN THE MIDDLE OF TRYING TO COMPARE THE CODE BELOW WITH VALUE CONSOLE.LOG(LINE 307)
      // ############PREVIOUS districtInfo display at top################
      centerMap();
      //mouse click at a certain place where it gets the values (i  think)
      let neighborhoodClicked;

      if (features[0].values_.nbrdesc) {
      neighborhoodClicked = features[0].values_.nbrdesc.split(' ').join('_').split('-').join('_').toLowerCase();
      }

      for (let i = 0; i < loopVar.length; i++) {
        const point = new Point(loopVar[i]);
        const desc = descArrayState[i];
        const crimeDate = dateArrayState[i];
        const dist = distArrayState[i];
        const loca = locationArrayState[i];
        const innyOutty = inAndOutArrayState[i];
        const weap = weaponArrayState[i];
        const feature = new Feature({
          geometry: point,
          crimeDate: crimeDate,
          desc: desc,
          dist: dist,
          loca: loca,
          innyOutty: innyOutty,
          weap: weap
        });
        //coordinate of point I just made(looped)
          const currentNeighborhood = lay.getSource().getFeaturesAtCoordinate(feature.values_.geometry.flatCoordinates)[0].values_.nbrdesc.split(' ').join('_').split('-').join('_').toLowerCase()
          if(neighborhoodClicked === currentNeighborhood){
          position.addFeature(feature);
          //////////Remember to look over the bottom two values...
          // console.log("Here is the current neighborhood", currentNeighborhood)
          // console.log("Here is NEIGHBORHOOD CLICKED", neighborhoodClicked)
      }
      }

      // console.log("currentNeighborhood", lay.getSource().getFeaturesAtCoordinate(feature.values_.geometry.flatCoordinates)[0].values_.nbrdesc.split(' ').join('_').split('-').join('_').toLowerCase())
    }
    map.removeInteraction(selectInteraction);
    map.removeLayer(lay);
    })
  }

  buildLongLatArrays = () => {

    console.log("iterate");
    let longArray = [];
    let latArray = [];
    let dateArray = [];
    let descArray = [];
    let distArray = [];
    let locationArray = [];
    let inAndOutArray = [];
    let weaponArray = [];

    for (let i = 0; i < this.props.data.length; i++) {

      if (this.props.data[i].hasOwnProperty("location_1")) {
        longArray.push(this.props.data[i].longitude);
        latArray.push(this.props.data[i].latitude);
        dateArray.push(this.props.data[i].crimedate);
        descArray.push(this.props.data[i].description);
        distArray.push(this.props.data[i].district);
        locationArray.push(this.props.data[i].location);
        inAndOutArray.push(this.props.data[i].inside_outside);
        weaponArray.push(this.props.data[i].weapon);
      }
    }
    this.processLonLat({
      longArrayState: longArray,
      latArrayState: latArray,
      dateArrayState: dateArray,
      descArrayState: descArray,
      distArrayState: distArray,
      locationArrayState: locationArray,
      inAndOutArrayState: inAndOutArray,
      weaponArrayState: weaponArray
    });
  }

  processLonLat = (obj) => {
    console.log("processing for loop");

    const loopVar = this.buildCoordinateArrayFromLatLong(obj.longArrayState, obj.latArrayState);
    this.initMap(obj, loopVar, obj.dateArrayState, obj.descArrayState, obj.distArrayState, obj.locationArrayState, obj.inAndOutArrayState, obj.weaponArrayState);
  }

  buildCoordinateArrayFromLatLong = (longArrayState, latArrayState) => {
    // console.log("LONG array State ===", longArrayState, latArrayState);
    console.log("doing for loop");
    let coorArr = []
    const position = new VectorSource();

    for (let i = 0; i < longArrayState.length; i++) {
      coorArr.push(proj.fromLonLat([
        parseFloat(longArrayState[i]),
        parseFloat(latArrayState[i])
      ]));
    }
    const layer = this.initLayer();
    const vector = this.initVector(position);
    return coorArr;
  }

  render() {
    console.log("render state", this.state);
    console.log("What does myData look like?", Object.values(this.state.myData));

    return (
      <div id="map-container" onLoad={this.loadMap()}>
      <h1 id="titleTop">Baltimore City Homicides By Neighborhood</h1>
      <div className="arrow_box" id="popup-container">
        <div id="popup-content"></div>
      </div>
      <h3 id="districtName"></h3>
      <p id="districtInfo"></p>
    </div>
  );
  }
}

export default MurderMap;
