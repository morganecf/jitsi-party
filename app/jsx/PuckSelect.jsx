import React, { Component } from 'react';
import PuckBox from './puckBox.jsx';


class PuckSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columnOpen: false,
            rowOpen: null,
            variant: null
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

    const puck_list = [
      [0,'./images/puck1.png'],
      [1,'./images/puck1.png'],
      [2,'./images/puck1.png'],
    ]
    const variant_lists = [
      [[0,'./images/puck1.png'],[1,'./images/puck1.png'],[2,'./images/puck1.png']],
      [[0,'./images/puck1.png'],[1,'./images/puck1.png'],[2,'./images/puck1.png']],
      [[0,'./images/puck1.png'],[1,'./images/puck1.png'],[2,'./images/puck1.png']],
    ]
    let puck_array

    if (this.state.columnOpen) {

      // remember to hide button
      puck_array = puck_list.map((puck) => {
        console.log(puck)

        if (this.state.rowOpen===puck[0]) {

          let handleClick = () => this.handleClick(puck[0])

          let test_style = {
            display: 'flex',
            flexDirection: 'row'
          }

          let variant = this.state.rowOpen
          let variant_array = variant_lists[this.state.rowOpen].map((puck) => {
            return (
              <PuckBox
              handleClick={handleClick}
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
        <input type="button" onClick={this.onButtonClick} value="Avatar?"/>
        {puck_array}
      </div>
    )
  }
}
export default PuckSelect
