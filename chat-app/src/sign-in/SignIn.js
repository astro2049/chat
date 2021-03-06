import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

function Copyright() {
    // i18n
    const { t } = useTranslation();
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
        width: theme.spacing(55),
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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    blankDiv10PercentHeight: {
        height: "20%",
    },
}));

const { REACT_APP_SERVER_ADDRESS } = process.env;

export default function SignIn(props) {
    const classes = useStyles();

    // i18n
    const { t } = useTranslation();

    const setPage = props.setPage;
    const setUser = props.setUser;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        fetch(REACT_APP_SERVER_ADDRESS + "/users/login", {
            method: "POST",
            body: formData,
        }).then((response) => {
            if (response.status === 200) {
                response.json().then((data) => {
                    let user = {
                        name: "",
                    };
                    user.name = data.username;
                    setUser(user);
                    localStorage.setItem("token", data.token);
                });
            }
        });
        setUsername("");
        setPassword("");
    };

    return (
        <div className={classes.outerContainer}>
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h3">
                    Chat!
                </Typography>
                <form className={classes.form} noValidate onSubmit={onSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="Username"
                        label={t("signIn.username")}
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label={t("signIn.password")}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {t("signIn.signInButton")}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link
                                href="#"
                                variant="body2"
                                onClick={() => {
                                    setPage("sign-up");
                                }}
                            >
                                {t("signIn.goToSignUp")}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={3}>
                <Copyright />
            </Box>
        </div>
    );
}
