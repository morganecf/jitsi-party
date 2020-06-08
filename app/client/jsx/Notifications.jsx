import React, {
    useState,
    createContext,
    useContext,
    useMemo,
    useEffect
} from 'react'
import { createPortal } from 'react-dom'
import Modal from 'react-modal';
import moment from 'moment'
import AudioPlayer from './AudioPlayer.jsx';
import CustomComponents from './CustomComponents'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const TRIGGER_DELAY = 10000
const DISAPPEAR_TIMEOUT = 8000


/*
* Global context that keeps track of notifications and exposes functions to append
* a notification to the DOM or schedule one for later. These are the initial values
* of the context state.
*/
export const NotificationContext = createContext({
    add: () => {},
    schedule: () => {}
})


/* 
* Custom hook allowing any functional component to use the notification context API
*/
export function useNotifications() {
    const { add, schedule } = useContext(NotificationContext)
    return { add, schedule }
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
    const [ modalComponent, setModalComponent ] = useState(null)

    const add = notification => {
        if (notification.component) {
            setModalComponent(notification.component)
        } else {
            setIdCounter(idCounter + 1)
            setNotifications([...notifications, { id: idCounter, notification }])
        }
    }

    const schedule = notification => {
        const notificationTime = moment(notification.time).unix()
        const now = moment(moment.now()).unix()
        let timeout = (notificationTime - now) * 1000
        // Will trigger immediately if notification specifies triggerAfterTime=true
        // and it's later than when the notification is supposed to trigger
        if (timeout < 0) {
            if (notification.triggerAfterTime) {
                timeout = TRIGGER_DELAY
            } else {
                return
            }
        }
        return setTimeout(() => add(notification), timeout)
    }

    const dismissNotification = id => (
        setNotifications(notifications.filter(notif => notif.id !== id))
    )

    const dismissModal = () => setModalComponent(null)

    // New context values. These are memoized so that the provider value only changes if
    // arguments change, preventing superfluous renders.
    const context = useMemo(() => ({ add, schedule }), [notifications, modalComponent])

    const getModalComponent = () => {
        if (modalComponent) {
            const Component = CustomComponents[modalComponent]
            return <Component handleDismiss={dismissModal} />
        }
    }

    return (
        <NotificationContext.Provider value={context}>
            <Notifications
                dismiss={dismissNotification}
                notifications={notifications}>
            </Notifications>
            <Modal
                isOpen={!!modalComponent}
                onRequestClose={dismissModal}
                className="notification-modal">
                    {getModalComponent()}
            </Modal>
            {children}
        </NotificationContext.Provider>
    )
}
