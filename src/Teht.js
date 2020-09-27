import React, { Component } from 'react';
import { Map, TileLayer} from 'react-leaflet'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
//import axios from 'axios'

import './App.css';
import MyListItem from './MyListItem';

class Teht extends Component {
  constructor(props){
    super(props)
    this.state = {
      position: [60.192059, 24.945831],
      zoom: 12,
      data: {},
      bikeStationData: []
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
                <MyListItem listitems={this.state.bikeStationData} />
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Map center={this.state.position} zoom={this.state.zoom}>
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </Map>
      </div>
    );
  }
}

export default Teht;
