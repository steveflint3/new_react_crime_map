import React, {Component} from 'react';
import 'ol/ol.css';
import GeoJSON from 'ol/format/geojson';
import Map from 'ol/map';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import View from 'ol/view';
import ol from 'openlayers';
import TileLayer from 'ol/layer/tile';
import XYZSource from 'ol/source/xyz';
import Point from 'ol/geom/point';
import Feature from 'ol/feature';
import Style from 'ol/style/style';
import IconStyle from 'ol/style/icon';
import proj from 'ol/proj';
import MVT from 'ol/format/mvt';
import style from './style.css';
import Overlay from 'ol/overlay';
import coordinate from 'ol/coordinate';
// import {data} from './BaltimoreDistrict.json'

class MurderMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const layer = new VectorLayer({
      source: new VectorSource({format: new GeoJSON(), url: 'https://gist.githubusercontent.com/talllguy/65f5731ac413206e37e7/raw/e2ead342c428d891e0ad11dde865887f518aa56d/BaltimoreCityCouncilDistricts.geojson'})
    })
    return layer
  }

  initVector = (position) => {
    console.log("initVector");
    const vector = new VectorLayer({source: position});
    vector.setStyle(new Style({
      image: new IconStyle({src: 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/32/map-marker-icon.png'})
    }));
    return vector
  }

  initMap = (obj, loopVar, dateArrayState, descArrayState, distArrayState, locationArrayState, inAndOutArrayState, weaponArrayState) => {
    console.log("init map");
    // console.log("DESARRAYSTAE =-=-=-=", descArrayState)
    let dataArrayStateIT = [];
    const position = new VectorSource();
    const layer = this.initLayer()
    const vector = this.initVector(position)
    this.createMap(layer, vector)
    console.log("AAAAA", loopVar);

    // for(let j = 0; j < dateArrayState.length; j++){
    //   dataArrayStateIT.push(dateArrayState[j]);
    // }

    for (let i = 0; i < loopVar.length; i++ ) {
      const point = new Point(loopVar[i]);
      const desc = descArrayState[i];
      const crimeDate = dateArrayState[i];
      const dist = distArrayState[i];
      const loca = locationArrayState[i];
      const innyOutty = inAndOutArrayState[i];
      const weap = weaponArrayState[i];
      let feature = new Feature({
        geometry: point,
        crimeDate: crimeDate,
        desc: desc,
        dist: dist,
        loca: loca,
        innyOutty: innyOutty,
        weap: weap
    });
      position.addFeature(feature);
    };
  }

  createMap = (lay, vec) => {
    console.log("creating map");
    const map = new Map({
      target: 'map-container',
      layers: [new TileLayer({
          source: new XYZSource({url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'})
        })],
      view: new View({
        center: ol.proj.fromLonLat([this.props.longitude, this.props.latitude]),
        zoom: 12
      })
    })

    const overlay = new Overlay({
      element: document.getElementById('popup-container'),
      positioning: 'bottom-center',
      offset: [0, -10]
    });
    map.addOverlay(overlay);
    map.addLayer(lay)
    map.addLayer(vec)


    // const desc = this.props.data[0].description;
    //
    // const cDate = this.props.data[0].crimedate;
    ////////////Overlay added with popupfeatures in createMap function/
    map.on('click', function (e) {
               overlay.setPosition();
               var features = map.getFeaturesAtPixel(e.pixel);
               if (features) {
                 console.log("here is an experiment -=-===>", features[0].get('desc'))
                   let coords = features[0].getGeometry().getCoordinates();
                   let descriptionDisplay = features[0].get('desc');
                   let crimeDateDisplay = features[0].get('crimeDate');
                   let distDisplay = features[0].get('dist');
                   let locaDisplay = features[0].get('loca');
                   let innyOuttyDisplay = features[0].get('innyOutty');
                   let weaponDisplay = features[0].get('weap');
                   let hdms = coordinate.toStringHDMS(proj.toLonLat(coords));
                  if(features[0].get('desc') === 'HOMICIDE'){
                   overlay.getElement().innerHTML = '<div> <u>Crime Description</u> </div>' + descriptionDisplay + '<div> <u>Weapon</u> </div>' + weaponDisplay + '<div> <u>Crime Date</u> </div>' + crimeDateDisplay + '<div> <u>District</u> </div>' + distDisplay + '<div> <u>Location</u> <div>' + locaDisplay + '<div> <u>Environment</u> </div>' + innyOuttyDisplay + '<div> <u>Coordinates</u> </div>' + hdms;
                   overlay.setPosition(coords);
                 }
             }
             });
  }



  // map.on('click', function (e) {
  //            overlay.setPosition();
  //            var features = map.getFeaturesAtPixel(e.pixel);
  //            if (features) {
  //                var coords = features[0].getGeometry().getCoordinates();
  //                let descript = features[0].get('description');
  //                let prio = features[0].get('priority');  priority variable
  //                var hdms = coordinate.toStringHDMS(proj.toLonLat(coords));
  //                overlay.getElement().innerHTML = '<div> <u>Description</u> </div>' + descript + '<div> <u>Priority</u> </div>' + prio + '<div> <u>Location</u> </div>' + hdms;
  //                overlay.setPosition(coords);
  //            }
  // let feature = new Feature({
  //   geometry: point,
  //   description: descArray,
  //   priority: priority
  // });

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
      // console.log("The latitude is ---" + this.state.latitude + "and the longitude is ---" + this.state.longitude);
    }
    // console.log( longArray, latArray);
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
    // if(!longArrayState || !latArrayState){
    // return
    // }
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

  // map.on('click', function(e) {
  //   overlay.
  // })

  render() {
    console.log("render state", this.state);
    return (<div id="map-container" onLoad={this.loadMap()}>
      <div className="arrow_box" id="popup-container">
        <div id="popup-content"></div>
      </div>
      <button onClick={this.iterate}>iterate</button>
      <button onClick={this.newMapWithPoints}>New Map With Points</button>
    </div>);
  }
}

export default MurderMap;
