import React, { Component } from "react";
 
class MyListItem extends Component {
 
  render() {
    return (
      <React.Fragment>
        <ul className="list-group">
          {this.props.listitems.map(listitem => (
            <li className="list-group-item list-group-item-primary">
              {listitem.name}
            </li>
          ))}
        </ul>
      </React.Fragment>
    );
  }
}
 
export default MyListItem;