import React, {useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import {useTranslation} from "react-i18next";

function Copyright() {
    // i18n
    const {t} = useTranslation();
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {t("signIn.contact")}
            {" @"}
            <Link color="inherit" href="https://github.com/astro2049">
                Jerry,
            </Link>{" "}
            {new Date().getFullYear()}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    outerContainer: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    blankDiv10PercentHeight: {
        height: "20%",
    },
}));

const {REACT_APP_SERVER_ADDRESS} = process.env;

export default function SignUp(props) {
    const classes = useStyles();

    // i18n
    const {t} = useTranslation();

    const setPage = props.setPage;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        fetch(REACT_APP_SERVER_ADDRESS + "/register", {
            method: "POST",
            body: formData,
        }).then((response) => {
            response.json().then((data) => {
                if (data.success === true) {
                    setPage("sign-in");
                } else {
                    console.log("nope");
                }
            });
        });
        setUsername("");
        setPassword("");
    };

    return (
        <div className={classes.outerContainer}>
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <AcUnitIcon/>
                </Avatar>
                <Typography component="h1" variant="h3">
                    {t("signUp.title")}
                </Typography>
                <form className={classes.form} noValidate onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label={t("signUp.nickname")}
                                name="username"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label={t("signUp.password")}
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {t("signUp.signUpButton")}
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link
                                href="#"
                                variant="body2"
                                onClick={() => {
                                    setPage("sign-in");
                                }}
                            >
                                {t("signUp.goToSignIn")}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={3}>
                <Copyright/>
            </Box>
        </div>
    );
}
