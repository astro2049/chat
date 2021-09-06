import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    outerContainer: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}));

// loading component for suspense fallback
export default function Loader() {
    const classes = useStyles();

    return (
        <div className={classes.outerContainer}>
            <Typography component="div">
                <Box
                    fontWeight="fontWeightLight"
                    fontSize="h3.fontSize"
                    fontStyle="oblique"
                >
                    Loading...
                </Box>
            </Typography>
        </div>
    );
}
