import React from "react";
import { Typography, Checkbox } from "@material-ui/core";

const NotificationCheckbox = ({ isNotificationOn, setNotifications }) => {
    // Check if the browser doesn't support notifications
    if (!("Notification" in window)) {
        console.log("This browser does not support notifications.");
        return null
    }

    const handleCheckboxChange = (e, checkboxValue) => {
        if (!isNotificationOn) {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    setNotifications(true);
                    console.log('notifications on')
                }
            });
        } else {
            setNotifications(false);
            console.log('notifications off')
        }
    };

    return (
        <Typography variant="caption" color="textSecondary">
            <Checkbox label="Notify me when images are generated" checked={isNotificationOn} onChange={handleCheckboxChange} />
            Notify me when images are generated
        </Typography>
    )
}

export default NotificationCheckbox