import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup} from 'react-leaflet'
import { Navbar, Nav, NavDropdown, Button, Card, Table } from 'react-bootstrap'

import './App.css';
require('dotenv').config();

class Teht extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      position: [60.192059, 24.945831],
      zoom: 10,
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
      showMarker: false,
      weatherData: null
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

    fetch('https://api.openweathermap.org/data/2.5/weather?lang=fi&lat=' + dataItem.lat + '&lon=' + dataItem.lon + '&appid=' + process.env.REACT_APP_WEATHER_API_KEY)
    .then(response => response.json())
    .then(dataFromApi => {
      this.setState({weatherData: dataFromApi});
      console.log(dataFromApi);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  }

  kToC(temp){
    return (parseFloat(temp - 273).toFixed(2));
  }

  render(){

    return (
      <div className="Teht" style={{postion: 'relative'}}>
        <Navbar bg="light" expand="lg" style={{postion: 'relative'}}>
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

        <Map className="map" center={this.state.position} zoom={this.state.zoom} style={{postion: 'relative'}}>
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
        {this.state.weatherData && 
        <Card className="weatherCard">
          <Card.Body>
            <Card.Title>Säätila</Card.Title>
            <p>Sijainti: {this.state.weatherData.name}</p>
            {this.state.weatherData.weather[0].main === 'Clear' && <img src={require("./icons/00vodpyz.png")}/>}
            {this.state.weatherData.weather[0].main === 'Clouds' && <img src={require("./icons/9pti7vnf.png")}/>}
            {this.state.weatherData.weather[0].main === 'Drizzle' && <img src={require("./icons/49re67ur.png")}/>}
            {this.state.weatherData.weather[0].main === 'Mist' && <img src={require("./icons/mz4nxse6.png")}/>}
            {this.state.weatherData.weather[0].main === 'Thunderstrom' && <img src={require("./icons/p0zkwe45.png")}/>}
            {this.state.weatherData.weather[0].main === 'Snow' && <img src={require("./icons/werasruf.png")}/>}
            {this.state.weatherData.weather[0].main === 'Rain' && <img src={require("./icons/zevjqu3l.png")}/>}
            <Table striped>
            <thead>
              <tr>
                <th>Lämpötila</th>
                <th>Pilvisyys</th>
                <th>Ilman kosteus</th>
                <th>Coords</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.kToC(this.state.weatherData.main.temp)} C</td>
                <td>{this.state.weatherData.weather[0].main}</td>
                <td>{this.state.weatherData.main.humidity} %</td>
                <td>{this.state.weatherData.coord.lat}, {this.state.weatherData.coord.lon}</td>
              </tr>
            </tbody>
            </Table>
          </Card.Body>
        </Card>
        }
      </div>
    );
  }
}

export default Teht;
