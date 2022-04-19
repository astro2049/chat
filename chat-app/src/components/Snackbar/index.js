import reactDom from "react-dom";
import { Alert, Snackbar } from "@mui/material";

export default function displaySnackbar(message, type) {
    const snackbar = (message, type) => {
        return (
            <Snackbar open autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={type}
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        );
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        hide();
    };

    const show = (message, type) => {
        const snackbarElement = document.getElementById("snackbar");
        reactDom.render(snackbar(message, type), snackbarElement);
    };

    const hide = () => {
        const snackbarElement = document.getElementById("snackbar");
        reactDom.unmountComponentAtNode(snackbarElement);
    };

    show(message, type);
}
