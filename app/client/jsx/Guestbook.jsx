import React, { useState, useEffect } from 'react'
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo'
import 'react-html5-camera-photo/build/css/index.css'
import { dataURItoBlob } from './utils.js'
import { HttpApi } from './WebAPI.jsx'
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment'

/*
  TODO 
  -- React.compose GuestSignature and Note
  -- transition state when "retake" picture
  -- s3.py singleton
  -- add boto to req
  -- remove s3bucket from default config
  -- should handle localstorage -- don't post again if refresh & localstorage is set
  -- make photos smaller / square
  -- test s3 upload on weird ascii usernames

  Should think about making this more generic
  UserContent table? Basically all user 
    room_id, user_id, text, url

  Then would be filtering by room_id rather than folder
  S3 bucket's folders would correspond to rooms
  Might be easier to have toplevel buckets: jitsi-party-guestbook
*/


const GuestSignature = ({ folder, user, handleUploaded }) => {
  const httpApi = new HttpApi()
  
  const { username, userId } = user

  const [note, setNote] = useState('')
  const [dataUri, setDataUri] = useState(null)
  const [uploading, setUploading] = useState(false)

  const imageType = IMAGE_TYPES.JPG
  const minLength = 5
  const maxLength = 400

  function handleTakePhoto (dataUri) {
    // Do stuff with the photo...
    console.log('takePhoto');
  }
 
  function handleTakePhotoAnimationDone (dataUri) {
    // Do stuff with the photo...
    setDataUri(dataUri)
  }
 
  function handleCameraError (error) {
    console.log('handleCameraError', error);
  }
 
  function handleCameraStart (stream) {
    console.log('handleCameraStart');
  }
 
  function handleCameraStop () {
    console.log('handleCameraStop');
  }

  function reset() {
      setDataUri(null)
  }

  function save() {
    setUploading(true)
    const blob = dataURItoBlob(dataUri)
    const formData = new FormData()
    const filename = `${moment.now()}-${username}.${imageType}`
    formData.append('photo', blob, filename)
    formData.append('folder', folder)
    formData.append('note', note)
    formData.append('userId', userId)
    httpApi.uploadPhoto(formData).then(handleUploaded)
  }

  function handleNoteChange(event) {
    setNote(event.target.value)
  }

  const saveButtonContent = uploading ? 'Saving' : 'Save'

  return (
    <div className="guestbook-signature">
      {
        dataUri ?
          (
            <div className="react-html5-camera-photo">
              <img src={dataUri} />
            </div>
          ) :
          <Camera
            onTakePhoto={ (dataUri) => { handleTakePhoto(dataUri); } }
            onTakePhotoAnimationDone={ (dataUri) => { handleTakePhotoAnimationDone(dataUri); } }
            onCameraError={ (error) => { handleCameraError(error); } }
            idealFacingMode={FACING_MODES.ENVIRONMENT}
            // idealResolution={{width: 640, height: 480}}
            imageType={imageType}
            imageCompression={0.97}
            isMaxResolution={true}
            isImageMirror={true}
            isSilentMode={false}
            isDisplayStartCameraError={true}
            isFullscreen={false}
            sizeFactor={1}
            onCameraStart={ (stream) => { handleCameraStart(stream) } }
            onCameraStop={ () => { handleCameraStop() } }/>
      }
      <div className="note">
        <textarea value={note} maxLength={maxLength} onChange={handleNoteChange} />
      </div>
      <div className="options">
          <button disabled={uploading || !dataUri || note.length < minLength } onClick={save}>
            {saveButtonContent}
          </button>
          <button disabled={uploading || !dataUri} onClick={reset}>Retake</button>
      </div>
    </div>
  )
}

const GuestBook = ({ entries }) => {
  const [loading, setLoading] = useState(true)

  if (loading) {
    return <div>Loading guestbook...</div>
  }

  console.log('entries:', entries)

  return <div>GUEST BOOK</div>
}

export default ({ folder }) => {
    const dispatch = useDispatch()
    
    const user = useSelector(state => state.user)
    const guestbook = useSelector(state => state.guestbooks[folder])

    const [saved, setSaved] = useState(guestbook && guestbook.isGuestbookSigned)

    const handleUploaded = ({ success }) => {
      setSaved(success)
      if (success) {
        dispatch({ type: 'SIGN_GUESTBOOK', folder })
      }
    }

    const entries = guestbook.filter(
      entry => entry.url.includes(`/${folder}/`)
    )

    return (
      <div className="guestbook">
        {
          saved ? <GuestBook entries={entries} /> : <GuestSignature folder={folder} user={user} handleUploaded={handleUploaded} />
        }
      </div>
    )
}
