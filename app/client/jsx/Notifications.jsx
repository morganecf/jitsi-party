import React, {
    useState,
    createContext,
    useContext,
    useMemo,
    useEffect
} from 'react'
import { createPortal } from 'react-dom'
import AudioPlayer from './AudioPlayer.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'


const DISAPPEAR_TIMEOUT = 8000


/*
* Global context that keeps track of notifications and exposes functions to append
* a notification to the DOM. These are the initial values of the context state.
*/
export const NotificationContext = createContext({
    add: () => {}
})


/* 
* Custom hook allowing any functional component to use the notification context API
*/
export function useNotifications() {
    const { add } = useContext(NotificationContext)
    return { add }
}


/* 
* Toast notification component. It clears itself after DISAPPEAR_TIMEOUT ms.
*/
function ToastNotification({ id, notification, dismiss }) {
    useEffect(() => {
        const timeoutId = setTimeout(() => dismiss(id), DISAPPEAR_TIMEOUT)
        return () => clearTimeout(timeoutId)
    })

    return (
        <div className="toast-notification">
            {!!notification.image &&
                <div className="toast-image">
                    <img src={notification.image}/>
                </div>
            }
            <div className="toast-text">{notification.text}</div>
            <button onClick={() => dismiss(id)}>
                <FontAwesomeIcon icon={faTimes}/>
            </button>
        </div>
    )
}


/* 
* Component that groups notifications together. Notifications can be regular toast notifications
* or audio announcements. The audio announcements will not have a visible component.
*/
function Notifications({ dismiss, notifications }) {
    if (notifications.length === 0) {
        return null
    }

    const getToast = (id, notification) => (
        <ToastNotification
            key={`toast-notification-${id}`}
            dismiss={dismiss}
            id={id}
            notification={notification}>
        </ToastNotification>
    )

    const getAudio = (id, notification) => (
        <AudioPlayer
            key={`audio-notification-${id}`}
            src={notification.src}
            autoPlay={true}
            hide={true}>
        </AudioPlayer>
    )

    return createPortal(
        <div className="toast-notifications">
            {notifications.map(({ id, notification }) => (
                notification.src ? getAudio(id, notification) : getToast(id, notification)
            ))}
        </div>,
        document.body
    )
}


/*
* The notification provider manages the context state and can be used to wrap components
* that require notifications. It defines the API's context functions and triggers a render
* when the context values have changed, i.e, when there are new notifications to show.
*/
export function NotificationProvider({ children }) {
    const [ notifications, setNotifications ] = useState([])
    const [ idCounter, setIdCounter ] = useState(0)

    const add = notification => {
        setIdCounter(idCounter + 1)
        setNotifications([...notifications, { id: idCounter, notification }])
    }

    const dismiss = id => (
        setNotifications(notifications.filter(notif => notif.id !== id))
    )

    // New context values. These are memoized so that the provider value only changes if
    // arguments change, preventing superfluous renders.
    const context = useMemo(() => ({ add }), [notifications])

    return (
        <NotificationContext.Provider value={context}>
            <Notifications
                dismiss={dismiss}
                notifications={notifications}>
            </Notifications>
            {children}
        </NotificationContext.Provider>
    )
}
