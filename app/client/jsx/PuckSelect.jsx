import React, { Component } from 'react';
import PuckBox from './PuckBox.jsx';
import Config from './Config.jsx'


class PuckSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
        columnOpen: false,
        rowOpen: null,
        avatarDesign: '',
        avatarColorway: '',
        opacity: this.props.opacity
    }
    this.onButtonClick = this.onButtonClick.bind(this)
    this.onButtonClickReset = this.onButtonClickReset.bind(this)
    this.handleClickDesign = this.handleClickDesign.bind(this)
    this.handleClickColor = this.handleClickColor.bind(this)
  }

  onButtonClick() {
    this.setState({ columnOpen: true }) }

  onButtonClickReset() {
    this.setState({ columnOpen: false })
    this.setState({ rowOpen: null })
    this.setState({ avatarDesign: '' })
    this.setState({ avatarColorway: '' })
    this.setState({ columnOpen: true })
  }
  handleClickDesign(key, index) {
    this.setState({ avatarDesign: key, rowOpen: index }) }
  handleClickColor(variantKey) {
    this.setState({ avatarColorway: variantKey })
    this.props.handleSelect({
      type: this.state.avatarDesign,
      color: variantKey
    })
  }

  render() {
    const avatars = Config.avatars
    
    if (this.state.avatarColorway === '') { // checks whether selection not yet complete

      // puck list generated from purple of each design
      let allAvatarDesigns = []
      let allColorwayVariants = []
      let fade = this.props.opacity

      if (this.state.columnOpen) { // checks whether selection begun by clicking button, opening column
        fade = 'fade'
        allAvatarDesigns = Object.keys(avatars).map((key, index) => {
          if (this.state.rowOpen !== index) { // checks each item in column for whether selected
            let handleClick = () => this.handleClickDesign(key, index)
            let image_transparency = 'image'
            if (this.state.rowOpen !== null && this.state.rowOpen !== index) {
              image_transparency = 'non-selected-image'
            }

            return ( // returns single instance of each nonselected design
              <PuckBox
              handleClick={handleClick}
              key={key}
              image={avatars[key][Object.keys(avatars[key])[0]]}
              style='box'
              imageStyle={image_transparency}
              />
            )
          } else { // selected design
            allColorwayVariants = Object.keys(avatars[key]).map((variantKey, colorIndex) => {
              let selected = 'image'
              let handleClick = () => this.handleClickColor(variantKey, colorIndex)
              return ( // returns all colorways for selected design
                <PuckBox
                handleClick={handleClick}
                key={variantKey}
                image={avatars[key][variantKey]}
                imageStyle={selected}
                />
              )
            })
            return ( // colorways row in place of selected column item
              <div key="big-container" className='inner'>
              {allColorwayVariants}
              </div>
            )
          }
        })
      }
      return ( // column of singleton nonselected items with at most one of them swapped out for colorway variants row
        <div className='outer'>
        <input className={fade} type="button" onClick={this.onButtonClick} value={Config.welcomePage.avatarSelectionText}/>
        {allAvatarDesigns}
        </div>
      )
    } else {
      return ( // when avatar state isn't null, collapse all and display choice
        <div className='outer'>
          <input className='fade' type="button" onClick={this.onButtonClickReset} value={Config.welcomePage.avatarSelectionText}/>
          <div className='spacer'/>
          <div><img className='image' src={avatars[this.state.avatarDesign][this.state.avatarColorway]}/></div>
        </div>
      ) // reselection WIP
    }
  }
}
export default PuckSelect
