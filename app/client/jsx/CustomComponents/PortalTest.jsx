import React, { useState } from 'react'

export default ({ handleDismiss }) => {
    const [ loading, setLoading ] = useState(false)

    const handleEnter = () => {
        setLoading(true)
        setTimeout(() => {
            document.body.className += ' midnight'
            handleDismiss()
        }, 3000)
    }

    const style = {
        height: '500px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column'
    }

    const innerStyle = {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '25%',
        marginRight: '25%',
        marginTop: '100px'
    }

    const getInnerDiv = () => {
        if (loading) {
            return <div>Going through the portal...</div>
        }
        return (
            <div className="midight-portal-inner" style={innerStyle}>
                ENTER THE PORTAL!
                <button onClick={handleEnter}>Yes</button>
                <button onClick={handleDismiss}>No</button>
            </div>
        )
    }

    return (
        <div className="midnight-portal" style={style}>
            {getInnerDiv()}
        </div>
    )
}
