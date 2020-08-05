import React, { Component } from 'react'
import PuckBox from './PuckBox.jsx'
import Config from './Config.jsx'

class PuckSelect extends Component {
  constructor (props) {
    super(props)
    this.initialState = {
      columnOpen: false,
      avatarSetIndex: null,
      avatarVariantIndex: null,
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

  handleClickDesign (setIndex) {
    this.setState({ avatarSetIndex: setIndex })
  }

  handleClickColor (variantIndex) {
    this.setState({ avatarVariantIndex: variantIndex })
    this.props.handleSelect({
      type: this.state.avatarSetIndex,
      color: variantIndex
    })
  }

  handleClickAvatar(setIndex, variantIndex) {
    this.setState({
      avatarSetIndex: setIndex, 
      avatarVariantIndex: variantIndex
    })
    this.props.handleSelect({
      type: setIndex,
      color: variantIndex
    })
  }

  render () {
    const avatars = Config.avatars
    if (this.state.avatarVariantIndex === null) { // checks whether selection not yet complete
      let allAvatarDesigns = []
      let allVariants = []
      let fade = this.props.opacity
      if (this.state.columnOpen) {
        fade = 'fade'
        allAvatarDesigns = avatars.map((set, setIndex) => {
          // if (this.state.avatarVariantIndex !== index) { // checks each item in column for whether selected
          //   let imageTransparency = 'image'
          //   if (this.state.avatarSetIndex !== null && this.state.avatarSetIndex !== index) {
          //     imageTransparency = 'non-selected-image'
          //   }
          //   const handleClick = () => this.handleClickDesign(setIndex)
          //   return (
          //     <PuckBox
          //       handleClick={handleClick}
          //       key={setIndex}
          //       image={set.images[0]}
          //       style='box'
          //       imageStyle={imageTransparency}
          //     />
          //   )
          // } else { // selected design
          allVariants = set.images.map((image, variantIndex) => {
            const selected = 'image'
            // const handleClick = () => this.handleClickColor(variantKey, colorIndex)
            const handleClick = () => this.handleClickAvatar(setIndex, variantIndex)
            return (
              <PuckBox
                handleClick={handleClick.bind(this)}
                key={`${setIndex} ${variantIndex}`}
                image={image}
                imageStyle={selected}
              />
            )
          })
          return ( // variants row in place of selected column item
            <div key={`big-container ${setIndex}`} className='inner'>
              {allVariants}
            </div>
          )
        })
        // })
      }
      return (
        <div className='outer'>
          <input className={fade + ' opaque'} type='button' onClick={this.handleButtonClick} value={Config.welcomePage.avatarSelectionText} />
          {allAvatarDesigns}
        </div>
      )
    } else {
      return (
        <div className='outer'>
          <input className='fade opaque' type='button' onClick={this.handleButtonClickReset.bind(this)} value={Config.welcomePage.avatarSelectionText} />
          <div className='spacer' />
          <div><img className='image' src={avatars[this.state.avatarSetIndex].images[this.state.avatarVariantIndex]} /></div>
        </div>
      )
    }
  }
}
export default PuckSelect
