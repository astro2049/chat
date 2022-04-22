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
import axios from "axios";
import global from "../../utils/globalVars";
import displaySnackbar from "../../components/Snackbar";

function Copyright() {
    // i18n
    const { t } = useTranslation();
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {t("signIn.contact")}
            {" @"}
            <Link color="inherit" href="https://github.com/astro2049/chat">
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
    logo: {
        width: 200,
        height: 50,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(1, 0, 2),
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

    const [fillingForThe1stTime, setFillingForThe1stTime] = useState(true);
    const usernameIsInvalid = !(username.length >= 1 && username.length <= 21);
    const passwordIsInvalid = !(password.length >= 1 && password.length <= 21);
    const usernameHelperText = () => {
        if (!usernameIsInvalid) {
            return " ";
        } else {
            if (username.length === 0) {
                return t("signIn.username.helperText.isRequired");
            } else {
                return t("signIn.username.helperText.requirement");
            }
        }
    };
    const passwordHelperText = () => {
        if (!passwordIsInvalid) {
            return " ";
        } else {
            if (password.length === 0) {
                return t("signIn.password.helperText.isRequired");
            } else {
                return t("signIn.password.helperText.requirement");
            }
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setFillingForThe1stTime(false);
        if (usernameIsInvalid || passwordIsInvalid) {
            return;
        }

        axios
            .post(global.PROFILE_SERVER_ADDRESS + "/login", {
                name: username,
                password: password,
            })
            .then((response) => {
                setUsername("");
                setPassword("");
                setUser(response.data.user);
                setToken(response.data.token);
            })
            .catch((e) => {
                if (e.response) {
                    if (e.response.status === 401) {
                        displaySnackbar(
                            t("operations.signIn.wrongPassword"),
                            "warning"
                        );
                    }
                } else {
                    displaySnackbar(t("operations.failure"), "warning");
                }
            });
    };

    return (
        <div className={classes.outerContainer}>
            <CssBaseline />
            <Box className={classes.paper} sx={{ m: 2 }}>
                <div
                    className={classes.logo}
                    style={{
                        backgroundImage: "url(/images/logo.png)",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                    }}
                />
                <form className={classes.form} noValidate onSubmit={onSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        style={{
                            marginBottom: "0px",
                        }}
                        required
                        fullWidth
                        id="Username"
                        label={t("signIn.username.name")}
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={fillingForThe1stTime ? false : usernameIsInvalid}
                        helperText={
                            fillingForThe1stTime ? " " : usernameHelperText()
                        }
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        style={{
                            marginTop: "6px",
                            marginBottom: "2px",
                        }}
                        required
                        fullWidth
                        name="password"
                        label={t("signIn.password.name")}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={fillingForThe1stTime ? false : passwordIsInvalid}
                        helperText={
                            fillingForThe1stTime ? " " : passwordHelperText()
                        }
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
            </Box>
            <Box mt={3}>
                <Copyright />
            </Box>
        </div>
    );
}
