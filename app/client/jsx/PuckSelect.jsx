import React, { Component } from 'react';
import PuckBox from './PuckBox.jsx';
import { Avatars } from './avatars.jsx'


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
        this.handleClickDesign = this.handleClickDesign.bind(this)
        this.handleClickColor = this.handleClickColor.bind(this)
      }

  onButtonClick() {
    this.setState({ columnOpen: true }) }
  onButtonClickReset() { // to fix
    this.setState({ columnOpen: false })
    this.setState({ rowOpen: null })
    this.setState({ avatar: null })
    // this.forceUpdate()
  }
  handleClickDesign(index) { this.setState({ rowOpen: index }) }
  handleClickColor(index) {
    this.setState({ avatar: index })
    this.props.handleSelect([this.state.rowOpen,index])
  }

  render() {

    if (this.state.avatar == null) { // checks whether selection not yet complete

      // puck list generated from purple of each design

      // Object.keys(Avatars).forEach(function(key) { console.log( Avatars[key].purple ) })
      let allAvatarDesigns = []
      let fade = this.props.opacity

      if (this.state.columnOpen) { // checks whether selection begun by clicking button, opening column
        fade = 'fade'
        allAvatarDesigns = Object.keys(Avatars).map((key, index) => {
          if (this.state.rowOpen !== index) { // checks each item in column for whether selected
            let handleClick = () => this.handleClickDesign(index)
            let image_transparency = 'image'
            if (this.state.rowOpen !== null && this.state.rowOpen !== index) {
              image_transparency = 'non-selected-image'
            }
            return ( // returns single instance of each nonselected design
              <PuckBox
              handleClick={handleClick}
              key={index}
              image={Avatars[key].purple}
              style='box'
              imageStyle={image_transparency}
              />
            )
          } else { // selected design
            let allColorwayVariants = avatars[this.state.rowOpen].map((color,index) => {
              let selected = 'image'
              let handleClick = () => this.handleClickColor(index)
              return ( // returns all colorways for selected design
                <PuckBox
                handleClick={handleClick}
                key={`puckbox-${index}`}
                image={color}
                imageStyle={selected}
                />
              )
            })
            return ( // colorways row in place of selected column item
              <div className='inner'>
              {allColorwayVariants}
              </div>
            )
          }
        })
      }
      return ( // column of singleton nonselected items with at most one of them swapped out for colorway variants row
        <div className='outer'>
        <input className={fade} type="button" onClick={this.onButtonClick} value="Pick your puck"/>
        {allAvatarDesigns}
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
