import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup} from 'react-leaflet'
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap'

import './App.css';

class Teht extends Component {
  constructor(props){
    super(props)
    this.state = {
      position: [60.192059, 24.945831],
      zoom: 12,
      data: {},
      bikeStationData: [],
      stationPos: [0,0],
      stationInfo:{
        name: null,
        lat: null,
        lon: null,
        bikesAvailable: null,
        emtpyPlaces: null
      },
      showMarker: false
    }
  }

  componentDidMount(){

    fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: `{
        "query": "{ bikeRentalStations { stationId name bikesAvailable spacesAvailable lat lon allowDropoff } }"
      }`
    })
    .then(response => response.json())
    .then( dataFromApi => {

      this.setState({data: dataFromApi});
      this.setState({bikeStationData: dataFromApi.data.bikeRentalStations});
      console.log(this.state.bikeStationData);


    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })

  }

  handleClick(dataItem){
    console.log(dataItem);
    this.setState({showMarker:true});
    this.setState({stationPos:[dataItem.lat, dataItem.lon]});
    this.setState({stationInfo:{
      name: dataItem.name,
      lat: dataItem.lat,
      lon: dataItem.lon,
      bikesAvailable: dataItem.bikesAvailable,
      emtpyPlaces: dataItem.spacesAvailable
    }})
  }

  render(){
    return (
      <div className="Teht">
        <Navbar bg="light" expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
              <NavDropdown title="Kaupunkipyöräpaikat" id="basic-nav-dropdown">
              <div className="dropDiv">
                <ul className="list-group">
                  {this.state.bikeStationData.map(listitem => (
                    <li className="list-group-item list-group-item-primary" key={listitem.stationId}>
                      <Button onClick={() => this.handleClick(listitem)}>{listitem.name}</Button>
                    </li>
                  ))}
                </ul>
              </div>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Map center={this.state.position} zoom={this.state.zoom}>
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.state.showMarker && <Marker position={this.state.stationPos}>
            <Popup>
              <ul>
                <li>Aseman nimi: {this.state.stationInfo.name}</li>
                <li>Sijainti: {this.state.stationInfo.lat} {this.state.stationInfo.lon}</li>
                <li>Pyöriä jäljellä: {this.state.stationInfo.bikesAvailable}</li>
                <li>Tyhjiä paikkoja: {this.state.stationInfo.emtpyPlaces}</li>
              </ul>
            </Popup>
          </Marker>}
        </Map>
      </div>
    );
  }
}

export default Teht;
