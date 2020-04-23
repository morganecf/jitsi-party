import React, { Component } from 'react';
import PuckBox from './puckBox.jsx';


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
  handleClickColor(id) {
    let avatar = [this.state.rowOpen,id]
    console.log(avatar)
  }

  render() {

    const puck_list = [
      [0,'./images/puck/dancing/dancing1.png'],
      [1,'./images/puck1.png'],
      [2,'./images/puck1.png'],
      [3,'./images/puck1.png'],
    ]
    const variant_lists = [
      [[0,'./images/puck/dancing/dancing1.png'],[1,'./images/puck/dancing/dancing2.png'],[2,'./images/puck/dancing/dancing3.png'],[3,'./images/puck/dancing/dancing4.png'],],
      [[0,'./images/puck/dancing/dancing1.png'],[1,'./images/puck/dancing/dancing2.png'],[2,'./images/puck/dancing/dancing3.png'],[3,'./images/puck/dancing/dancing4.png'],],
      [[0,'./images/puck/dancing/dancing1.png'],[1,'./images/puck/dancing/dancing2.png'],[2,'./images/puck/dancing/dancing3.png'],[3,'./images/puck/dancing/dancing4.png'],],
      [[0,'./images/puck/dancing/dancing1.png'],[1,'./images/puck/dancing/dancing2.png'],[2,'./images/puck/dancing/dancing3.png'],[3,'./images/puck/dancing/dancing4.png'],]
    ]
    let puck_array
    let shown = { visibility: 'visible' }

    if (this.state.columnOpen) {

      shown = { visibility: 'hidden' }

      puck_array = puck_list.map((puck) => {

        if (this.state.rowOpen===puck[0]) {
          let handleClick = () => this.handleClick(puck[0])

          let test_style = {
            display: 'flex',
            flexDirection: 'row'
          }

          let variant = this.state.rowOpen
          let variant_array = variant_lists[this.state.rowOpen].map((puck) => {
            let handleClickColor = () => this.handleClickColor(puck[0])
            return (
              <PuckBox
              handleClick={handleClickColor}
              key={puck[0]}
              image={puck[1]}
              />
            )
          })

          return (
            <div style={test_style}>
              {variant_array}
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
        <input style={shown} type="button" onClick={this.onButtonClick} value="Avatar?"/>
        {puck_array}
      </div>
    )
  }
}
export default PuckSelect
