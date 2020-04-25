import React, { Component } from 'react';
import PuckBox from './PuckBox.jsx';
import avatars from './Avatars.jsx'


class PuckSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columnOpen: false,
            rowOpen: null,
            avatar: null
        }
        this.onButtonClick = this.onButtonClick.bind(this)
      }

  onButtonClick() { this.setState({ columnOpen: true }) }
  handleClick(id) { this.setState({ rowOpen: id }) }
  handleClickColor(id) {
    this.setState({ avatar: id })
    this.props.handleSelect([this.state.rowOpen,id])
  }

  render() {

    //
    let button_hide = { visibility: 'visible' }


    if (this.state.avatar) {
      //<input style={button_hide} type="button" onClick={this.onButtonClick} value="Reselect?"/>
      return (
        <div className='outer'>
          <div><img src={avatars[this.state.rowOpen][this.state.avatar]}/></div>
        </div>
      )

    } else {


      let puck_list = avatars.map(function(arr,i) { return arr[0] })
      let puck_array
      if (this.state.columnOpen) {
        //
        button_hide = { visibility: 'hidden' }
        puck_array = puck_list.map((puck,id) => {

          if (this.state.rowOpen===id) {

            let variant_array = avatars[this.state.rowOpen].map((color,id) => {

              let selected = 'box'
              // if (id===0) { selected = 'box-selected' }
              let handleClickColor = () => this.handleClickColor(id)

              // avatar color variant selection
              return (
                <PuckBox
                handleClick={handleClickColor}
                key={id}
                image={color}
                style={selected}
                />
              )
            })

            return (
              <div className='inner'>
              {variant_array}
              </div>
            )

          } else {

            let handleClick = () => this.handleClick(id)

            let image_transparency = 'image'
            if (this.state.rowOpen && this.state.rowOpen!==id) {
              image_transparency = 'non-selected-image'
            }
            // avatar style selection
            return (
              <PuckBox
              handleClick={handleClick}
              key={id}
              image={puck}
              style='box'
              imageStyle={image_transparency}
              />
            )

          }

        })
      }

      return(
        <div className='outer'>
        <input style={button_hide} type="button" onClick={this.onButtonClick} value="Avatar?"/>
        {puck_array}
        </div>
      )

    }



  }
}
export default PuckSelect
