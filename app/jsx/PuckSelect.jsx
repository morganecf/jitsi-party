import React, { Component } from 'react';
import PuckBox from './puckBox.jsx';
import avatars from './avatars.jsx'


class PuckSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columnOpen: false,
            rowOpen: null,
        }
        this.onButtonClick = this.onButtonClick.bind(this)
      }

  onButtonClick() { this.setState({ columnOpen: true }) }
  handleClick(id) { this.setState({ rowOpen: id }) }
  // handleClickColor(id) { this.setState({ avatar: [this.state.rowOpen,id] }) }
  handleClickColor(id) { this.props.handleSelect([this.state.rowOpen,id])  }

  render() {

    // const avatars = [
    //   ['./images/puck/dancing/dancing1.png','./images/puck/dancing/dancing2.png','./images/puck/dancing/dancing3.png','./images/puck/dancing/dancing4.png',],
    //   ['./images/puck/dancing/dancing1.png','./images/puck/dancing/dancing2.png','./images/puck/dancing/dancing3.png','./images/puck/dancing/dancing4.png',],
    //   ['./images/puck/dancing/dancing1.png','./images/puck/dancing/dancing2.png','./images/puck/dancing/dancing3.png','./images/puck/dancing/dancing4.png',],
    //   ['./images/puck/dancing/dancing1.png','./images/puck/dancing/dancing2.png','./images/puck/dancing/dancing3.png','./images/puck/dancing/dancing4.png',],
    //   ['./images/puck/dancing/dancing1.png','./images/puck/dancing/dancing2.png','./images/puck/dancing/dancing3.png','./images/puck/dancing/dancing4.png',],
    //   ['./images/puck/dancing/dancing1.png','./images/puck/dancing/dancing2.png','./images/puck/dancing/dancing3.png','./images/puck/dancing/dancing4.png',]
    // ]

    let puck_list = avatars.map(function(arr,i) { return arr[0] })


    let puck_array

    //
    let shown = { visibility: 'visible' }

    if (this.state.columnOpen) {
      //
      shown = { visibility: 'hidden' }

      puck_array = puck_list.map((puck,id) => {

        if (this.state.rowOpen===id) {

          // let handleClick = () => this.handleClick(puck_list[id])

          //
          let test_style = {
            display: 'flex',
            flexDirection: 'row'
          }

          let variant_array = avatars[this.state.rowOpen].map((color,id) => {

            let handleClickColor = () => this.handleClickColor(id)
            // avatar color variant selection
            return (
              <PuckBox
              handleClick={handleClickColor}
              key={id}
              image={color}
              />
            )
          })

          return (
            <div style={test_style}>
              {variant_array}
            </div>
          )

        } else {

          let handleClick = () => this.handleClick(id)

          // avatar style selection
          return (
            <PuckBox
            handleClick={handleClick}
            key={id}
            image={puck}
            />
          )

        }

      })
    }

    return(
      <div>
        <input style={shown} type="button" onClick={this.onButtonClick} value="Avatar?"/>
        {puck_array}
      </div>
    )
  }
}
export default PuckSelect
