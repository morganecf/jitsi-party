import React, { Component } from 'react'
import PuckBox from './PuckBox.jsx'
import Config from './Config.jsx'

class PuckSelect extends Component {
  constructor (props) {
    super(props)
    this.initialState = {
      columnOpen: false,
      rowOpen: null,
      avatarDesign: '',
      avatarColorway: '',
      opacity: this.props.opacity
    }
    this.state = this.initialState
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }

  handleButtonClick () { this.setState({ columnOpen: true }) }

  handleButtonClickReset () {
    this.setState(this.initialState)
    this.setState({ columnOpen: true })
  }

  handleClickDesign (key, index) {
    this.setState({ avatarDesign: key, rowOpen: index })
  }

  handleClickColor (variantKey) {
    this.setState({ avatarColorway: variantKey })
    this.props.handleSelect({
      type: this.state.avatarDesign,
      color: variantKey
    })
  }

  render () {
    const avatars = Config.avatars
    if (this.state.avatarColorway === '') { // checks whether selection not yet complete
      let allAvatarDesigns = []
      let allColorwayVariants = []
      let fade = this.props.opacity
      if (this.state.columnOpen) {
        fade = 'fade'
        allAvatarDesigns = Object.keys(avatars).map((key, index) => {
          if (this.state.rowOpen !== index) { // checks each item in column for whether selected
            let imageTransparency = 'image'
            if (this.state.rowOpen !== null && this.state.rowOpen !== index) {
              imageTransparency = 'non-selected-image'
            }
            const handleClick = () => this.handleClickDesign(key, index)
            return (
              <PuckBox
                handleClick={handleClick}
                key={key}
                image={avatars[key][Object.keys(avatars[key])[0]]}
                style='box'
                imageStyle={imageTransparency}
              />
            )
          } else { // selected design
            allColorwayVariants = Object.keys(avatars[key]).map((variantKey, colorIndex) => {
              const selected = 'image'
              const handleClick = () => this.handleClickColor(variantKey, colorIndex)
              return (
                <PuckBox
                  handleClick={handleClick.bind(this)}
                  key={`${key} ${variantKey}`}
                  image={avatars[key][variantKey]}
                  imageStyle={selected}
                />
              )
            })
            return ( // colorways row in place of selected column item
              <div key='big-container' className='inner'>
                {allColorwayVariants}
              </div>
            )
          }
        })
      }
      return (
        <div className='outer'>
          <input className={fade} type='button' onClick={this.handleButtonClick} value={Config.welcomePage.avatarSelectionText} />
          {allAvatarDesigns}
        </div>
      )
    } else {
      return (
        <div className='outer'>
          <input className='fade' type='button' onClick={this.handleButtonClickReset} value={Config.welcomePage.avatarSelectionText} />
          <div className='spacer' />
          <div><img className='image' src={avatars[this.state.avatarDesign][this.state.avatarColorway]} /></div>
        </div>
      )
    }
  }
}
export default PuckSelect
