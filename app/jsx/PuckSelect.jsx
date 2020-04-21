import React, { Component } from 'react';
import PuckBox from './puckBox.jsx';


class PuckSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columnOpen: false,
            rowOpen: null
        }
        this.onButtonClick = this.onButtonClick.bind(this)
      }

    // handleChange() {
    //   this.setState({ selected });
    //   console.log(`Option selected:`, selected)
    // }

  onButtonClick() { this.setState({ columnOpen: true }) }

  handleClick(id) { this.setState({ rowOpen: id }) }

  render() {

    let key = 0

    const puck_list = [
      [1,'./images/puck1.png'],
      [2,'./images/puck1.png'],
      [3,'./images/puck1.png'],
    ]
    let puck_array

    if (this.state.columnOpen) {

      // remember to hide button
      puck_array = puck_list.map((puck) => {
        console.log(puck)

        if (this.state.rowOpen===puck[0]) {

          let handleClick = () => this.handleClick(puck[0])

          let test = {
            display: 'flex',
            flexDirection: 'row'
          }

          return (
            <div style={test}>
            <PuckBox
            handleClick={handleClick}
            key={puck[0]}
            image={puck[1]}
            />
            <PuckBox
            handleClick={handleClick}
            key={puck[0]}
            image={puck[1]}
            />
            <PuckBox
            handleClick={handleClick}
            key={puck[0]}
            image={puck[1]}
            />
            </div>
          )

        } else {

          let handleClick = () => this.handleClick(puck[0])
          return (
            <PuckBox
            handleClick={handleClick}
            key={puck[0]}
            image={puck[1]}
            />
          )

        }

      })
    }

    return(
      <div>
        <input type="button" onClick={this.onButtonClick} value="Avatar?"/>
        {puck_array}
      </div>
    )
  }
}
export default PuckSelect
