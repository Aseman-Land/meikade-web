import { GitHub, Google, Phone } from '@mui/icons-material';
import { Box, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import * as React from "react";
import { Cookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import MeikadeDrawer from '../../components/meikadedrawer';
import MeikadeLogo from '../../components/meikadelogo';
import { globalHandleError } from '../../layouts/mainframe';
import { MkAuthServices } from '../../services/auth';
import { hashPassword } from '../../utils/auth';
import { theme } from "../../utils/theme";

export type LegacySigninProps = {
    onBackRequest?: () => void,
    onSignupRequest?: () => void,
    onEnterPhoneMode?: () => void,
    onForgetPasswordRequest?: () => void,
    onClose?: () => void,
}

export const LegacySignin = (props: LegacySigninProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const cookies = new Cookies();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');

    const queryParams = new URLSearchParams(location.search);
    const appMode: boolean = queryParams.get('appMode') == "true" || localStorage.getItem('appMode') == 'true';
    if (appMode) {
        var expire = new Date();
        expire.setDate(expire.getDate() + 365);

        localStorage.setItem('appMode', 'true');
    }

    var workerScript: boolean = false;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile && !localStorage.getItem('pwa_dialog')) {
        if (navigator.serviceWorker) {
            navigator.serviceWorker.getRegistration('/').then((registration) => {
                if (registration) {
                    console.log('PWA Mode: Yes (Service Worker Registered)');
                } else {
                    setPWAVisible(true);
                }
            });
        } else {
            workerScript = true;
        }
    }

    const [pwaVisible, setPWAVisible] = React.useState<boolean>(workerScript);

    // if (pwaVisible && !appMode) {
    //     return <Box></Box>;
    // }

    const doChecks = async () => {
        setIsLoading(true);
        // try {
        //     const google_result = await Auth.googleLoginCheck();
        //     if (typeof google_result == 'object' && google_result.status) {
        //         window.location.href = '/';
        //         return;
        //     }
        // } catch (e) {
        // }

        // try {
        //     const github_result = await Auth.googleLoginCheck();
        //     if (typeof github_result == 'object' && github_result.status) {
        //         window.location.href = '/';
        //         return;
        //     }
        // } catch (e) {
        // }

        setIsLoading(false);
    }

    const signin = async () => {
        setIsLoading(true);
        try {
            const hashPass: string = hashPassword(password);
            const result = await MkAuthServices.signIn({ username, password: hashPass });
            if (typeof result.result == 'object' && result.status) {
                if (result.result.enter_phone_token) {
                    localStorage.setItem('enter_phone_token', result.result.enter_phone_token);
                    if (props.onEnterPhoneMode)
                        props.onEnterPhoneMode();
                } else {
                    var expire = new Date();
                    expire.setDate(expire.getDate() + 365);
                    cookies.remove('token', { path: '/' });
                    cookies.set('token', result.result.token, { path: '/', expires: expire });

                    window.location.href = '/';
                    return;
                }
            }
        } catch (e) {
            console.debug(e);
        }
        setIsLoading(false);
    };

    const googleLogin = async () => {
        if (props.onClose)
            props.onClose();
        setIsLoading(true);
        try {
            // const result = await Auth.googleLoginRequest()
            // if (typeof result == 'object' && result.status && result.result) {
            //     window.location.href = result.result?.authorize_url;
            //     return;
            // }
        } catch (e) {
            console.debug(e);
        }
        setIsLoading(false);
    }

    const githubLogin = async () => {
        if (props.onClose)
            props.onClose();
        setIsLoading(true);
        try {
            // const result = await Auth.githubLoginRequest()
            // if (typeof result == 'object' && result.status && result.result) {
            //     window.location.href = result.result?.authorize_url;
            //     return;
            // }
        } catch (e) {
        }
        setIsLoading(false);
    }

    React.useEffect(() => {
        doChecks();
    }, [])

    return <Box
        sx={{
            marginTop: 8,
            padding: '25px',
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: 650,
            gap: '20px',
        }}
    >
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '20px',
            }}
        >
            <MeikadeLogo width='130px' height='130px' />
        </Box>
        {isLoading && <CircularProgress id="busy" sx={{ marginBottom: '100px', marginTop: '50px' }} />}
        {!isLoading && <Box
            sx={{
                maxWidth: 'calc(100vw - 60px)',
                width: '300px',
                padding: '0 0 0 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                alignItems: 'center',
            }}
        >
            <TextField
                name="username"
                autoComplete="username"
                fullWidth
                label={t('user.username')}
                required
                sx={{
                    direction: 'ltr',
                }}
                value={username}
                slotProps={{
                    htmlInput: {
                        lang: 'en',
                        inputMode: 'latin',
                    },
                }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const inputVal = event.target.value;
                    const englishOnly = inputVal.replace(/[^a-zA-Z\s]/g, '');
                    if (englishOnly != inputVal)
                        globalHandleError(t('errors.keyboard-english'));
                    setUsername(englishOnly.trim())
                }}
            />
            <TextField
                name="password"
                autoComplete="password"
                fullWidth
                label={t('user.password')}
                required
                type="password"
                sx={{
                    direction: 'ltr',
                }}
                value={password}
                onChange={(event) => {
                    setPassword(event.target.value);
                }}
            />
            <Box
                sx={{
                    width: 'calc(100% - 20px)',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '4px',
                    marginTop: '10px',
                }}>
                <Button
                    type="submit"
                    fullWidth
                    disableElevation
                    disabled={isLoading || username.length <= 3 || password.length <= 3}
                    variant="contained"
                    color='secondary'
                    onClick={signin}
                >
                    {t('auth.signin')}
                </Button>
            </Box>
            <Button
                fullWidth
                disableElevation
                sx={{
                    fontSize: '14px',
                    marginTop: '10px',
                    color: theme.palette.text.primary,
                }}
                onClick={props.onForgetPasswordRequest}
            >
                {t('auth.forget-password')}
            </Button>
        </Box>}
        {!isLoading && <Box
            sx={{
                width: '300px',
                marginTop: '20px',
                maxWidth: 'calc(100vw - 60px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '4px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <Box sx={{ width: '100%', height: '1px', background: theme.palette.text.primary }} />
                <Typography sx={{ width: '420px', textAlign: 'center', color: theme.palette.text.primary }}>{t('auth.other-methods')}</Typography>
                <Box sx={{ width: '100%', height: '1px', background: theme.palette.text.primary }} />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '4px',
                    width: '100%',
                }}
            >
                {props.onBackRequest && <>
                    <Button
                        sx={{
                            color: theme.palette.primary.main,
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '4px',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onClick={props.onBackRequest}
                    >
                        <Phone sx={{ marginBottom: '4px' }} />
                        {t('auth.login-by-phone')}
                    </Button>
                </>}
                {!props.onBackRequest && <>
                    <Button
                        sx={{
                            color: '#e34133',
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '4px',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onClick={googleLogin}
                    >
                        <Google sx={{ marginBottom: '4px' }} />
                        {t('auth.google')}
                    </Button>
                    <Button
                        sx={{
                            color: '#2cb44c',
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '4px',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onClick={githubLogin}
                    >
                        <GitHub sx={{ marginBottom: '4px' }} />
                        {t('auth.github')}
                    </Button>
                </>}
            </Box>
        </Box>}
    </Box>;
}

export type LegacySigninDialogProps = {
    open?: boolean,
    autoMode?: boolean,
    onClose?: () => void,
};

var LegacySigninDialog_opened: boolean = false;

export const LegacySigninDialog = (props: LegacySigninDialogProps) => {
    const cookies = new Cookies();
    const session_token = cookies.get('token');

    const [open, setOpen] = React.useState<boolean>(false);
    const [openLastValue, setOpenLastValue] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!props.autoMode)
            return;
        if (session_token)
            return;
        if (LegacySigninDialog_opened)
            return;

        LegacySigninDialog_opened = true;
        setTimeout(() => setOpen(true), 1000);
    }, [])

    React.useEffect(() => {
        if (session_token)
            return;
        if (props.open) {
            setTimeout(() => setOpen(true), 200);
        }
    }, [props.open])

    React.useEffect(() => {
        if (openLastValue == open)
            return;
        if (!open) {
            if (props.onClose)
                props.onClose();
        }
        setOpenLastValue(open);
    }, [open])

    if (session_token)
        return <></>

    return <MeikadeDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
    >
        <LegacySignin
            onClose={() => setOpen(false)}
        />
    </MeikadeDrawer>
}

const LegacySigninPage = () => {
    return <Container
        component="main"
        maxWidth="sm"
    >
        <Box>
            <LegacySignin />
        </Box>
    </Container>
}

export default LegacySigninPage