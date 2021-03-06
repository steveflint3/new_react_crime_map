import React, {Component} from 'react';
import MurderMap from './MurderMap/MurderMap.js';
import './App.css';
// import {data} from './BaltimoreDistrict.json'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      ready: false,
      longitude: -76.6122,
      latitude: 39.2904
    };
    this.getData = this.getData.bind(this)
  }

  componentDidMount() {
    console.log("did mount");
    this.getData().then(data => {
      this.setState({data});
      console.log("data from api", data);
      if (!data || data.length === 0) {
        return
      }
    })
    this.setState({ready: true});
  }

  getData() {
    return fetch('https://data.baltimorecity.gov/resource/4ih5-d5d5.json?description=HOMICIDE').then(response => response.json()).catch(err => console.log(err))
  }

  render() {
    // if (this.state.data.length === 0) {
    //   return (<h1>
    //     LOADING!!!!!
    //   </h1>)
    // } else {
      return (
        <div>
          <MurderMap longitude={this.state.longitude} latitude={this.state.latitude} data={this.state.data}/>
        </div>
    );
    }
  }

export default App;
