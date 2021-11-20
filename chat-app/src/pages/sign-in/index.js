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
import { signInOrOut } from "../../utils/HttpRequest";

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
        width: "xs",
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

export default function SignIn(props) {
    const classes = useStyles();

    // i18n
    const { t } = useTranslation();

    const setUser = props.setUser;
    const setToken = props.setToken;
    const setPage = props.setPage;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            let response = await signInOrOut("/login", {
                name: username,
                password: password,
            });
            setUsername("");
            setPassword("");
            if (response.status === 200) {
                let user = props.user;
                user.id = response.data.user.id;
                user.name = response.data.user.name;
                setUser(user);
                let token = response.data.token;
                setToken(token);
            }
        } catch (error) {
            console.log(error);
        }
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
