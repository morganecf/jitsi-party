import React, { Component } from 'react';
import PuckBox from './PuckBox.jsx';
import avatars from './avatars.jsx'


class PuckSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columnOpen: false,
            rowOpen: null, 
            avatar: null,
            opacity: this.props.opacity
        }
        this.onButtonClick = this.onButtonClick.bind(this)
      }

  onButtonClick() { this.setState({ columnOpen: true }) }
  onButtonClickReset() { // to fix
    this.setState({ columnOpen: false })
    this.setState({ rowOpen: null })
    this.setState({ avatar: null })
    // this.forceUpdate()
  }
  handleClickDesign(id) { this.setState({ rowOpen: id }) }
  handleClickColor(id) {
    this.setState({ avatar: id })
    this.props.handleSelect([this.state.rowOpen,id])
  }

  render() {

    if (this.state.avatar===null) { // checks whether selection not yet complete

      // puck list generated from 0th colorway of each design
      let puck_list = avatars.map(function(arr,i) { return arr[0] }).slice(0, avatars.length - 1)
      let all_avatar_designs_array
      let fade = this.props.opacity

      if (this.state.columnOpen) { // checks whether selection begun by clicking button, opening column

        fade = 'fade'
        all_avatar_designs_array = puck_list.map((puck,id) => {

          if (this.state.rowOpen!==id) { // checks each item in column for whether selected

            let handleClick = () => this.handleClickDesign(id)
            let image_transparency = 'image'
            if (this.state.rowOpen!=null && this.state.rowOpen!==id) {
              image_transparency = 'non-selected-image'
            }
            return ( // returns single instance of each nonselected design
              <PuckBox
              handleClick={handleClick}
              key={id}
              image={puck}
              style='box'
              imageStyle={image_transparency}
              />
            )

          } else { // selected design

            let colorway_variants_array = avatars[this.state.rowOpen].map((color,id) => {
              let selected = 'image'
              let handleClick = () => this.handleClickColor(id)
              return ( // returns all colorways for selected design
                <PuckBox
                handleClick={handleClick}
                key={`puckbox-${id}`}
                image={color}
                imageStyle={selected}
                />
              )
            })
            return ( // colorways row in place of selected column item
              <div className='inner'>
              {colorway_variants_array}
              </div>
            )

          }
        })
      }

      return ( // column of singleton nonselected items with at most one of them swapped out for colorway variants row
        <div className='outer'>
        <input className={fade} type="button" onClick={this.onButtonClick} value="Pick your puck"/>
        {all_avatar_designs_array}
        </div>
      )

    } else {

      return ( // when avatar state isn't null, collapse all and display choice
        <div className='outer'>
          <input className='fade' type="button" onClick={this.onButtonClick} value="Pick your puck"/>
          <div className='spacer'/>
          <div><img className='image' src={avatars[this.state.rowOpen][this.state.avatar]}/></div>
        </div>
      ) // reselection WIP

    }

  }
}
export default PuckSelect
