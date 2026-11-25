import { ChevronRight } from '@mui/icons-material';
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
import { MkSignInByCode } from '../../models/auth';
import { MkAuthServices } from '../../services/auth';
import { theme } from "../../utils/theme";
import { convertPersianToEnglishDigits } from '../../utils/tools';
import { timeout } from './phonesignin';

export type PhoneSigninCodeProps = {
    upgradeAccountMode?: boolean,
    onBackRequest?: () => void,
    onSignupRequest?: () => void,
    onClose?: () => void,
}

export const PhoneSigninCode = (props: PhoneSigninCodeProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const cookies = new Cookies();

    const signin_token = localStorage.getItem('signin_token') ?? '';
    const signin_token_expire_str = localStorage.getItem('signin_token_expire');
    const invitation_code_needed: boolean = (props.upgradeAccountMode == true) && localStorage.getItem('invitation_code_needed') == "true";

    const [codeMode, setCodeMode] = React.useState<Date | null>(signin_token_expire_str ? new Date(Date.parse(signin_token_expire_str)) : null);
    const [duration, setDuration] = React.useState<number>(0);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [code, setCode] = React.useState<number | null>(null);
    const [invitationCode, setInvitationCode] = React.useState<string>('');

    const sendCode = async () => {
        if (!code)
            return;

        setIsLoading(true);
        try {
            const req: MkSignInByCode = {
                code: code.toString(),
                enter_phone_token: props.upgradeAccountMode ? localStorage.getItem('enter_phone_token') : null,
                signin_token: signin_token,
                invitation_code: invitationCode.trim().length ? invitationCode.trim() : null,
            };

            const result = await MkAuthServices.signInUsingCode(req);
            if (typeof result.result == 'object' && result.status) {
                localStorage.removeItem('enter_phone_token')
                localStorage.removeItem('signin_token_expire')

                if (result.result.token) {
                    var expire = new Date();
                    expire.setDate(expire.getDate() + 365);
                    cookies.remove('token', { path: '/' });
                    cookies.set('token', result.result.token, { path: '/', expires: expire });

                    window.location.href = '/';
                    return;
                } else if (result.result.register_token) {
                    localStorage.setItem('register_token', result.result.register_token);
                    if (props.onSignupRequest)
                        props.onSignupRequest();
                }
            }
        } catch (e) {
            console.debug(e);
        }
        setIsLoading(false);
    };

    const durationToString = (num: number): string => {
        const secs: number = duration % 60;
        const mins: number = Math.floor(duration / 60);

        const mins_str = (mins < 10 ? '0' : '') + mins.toString();
        const secs_str = (secs < 10 ? '0' : '') + secs.toString()
        return mins_str + ':' + secs_str;
    }

    React.useEffect(() => {
        const callback = () => {
            const now = new Date;
            if (codeMode) {
                const d = timeout - (now.getTime() - codeMode.getTime());
                if (d > 0) {
                    setDuration(Math.ceil(d / 1000));
                } else {
                    setDuration(0);
                    setCodeMode(null);
                    if (props.onBackRequest)
                        props.onBackRequest();
                }
            } else {
                setDuration(0);
            }
        };
        const intervalId = setInterval(callback, 500);
        callback();
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return <Box
        sx={{
            marginTop: '80px',
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
                marginBottom: '20px',
            }}
        >
            <TextField
                label={t('auth.code')}
                name="code"
                fullWidth
                required
                sx={{
                    direction: 'ltr',
                }}
                value={code}
                slotProps={{
                    htmlInput: {
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                    },
                }}
                onChange={(e) => {
                    const str: string = convertPersianToEnglishDigits(e.target.value ?? '');
                    const num: number = parseInt(str);
                    setCode(isNaN(num) ? null : num);
                }}
            />
            {invitation_code_needed && <TextField
                name="invitation_code"
                fullWidth
                label={t('user.invitation_code')}
                required
                sx={{
                    direction: 'ltr',
                }}
                value={invitationCode}
                onChange={(event) => {
                    const code: string = (event.target.value ?? '').trim();
                    setInvitationCode(code);
                }}
            />}
            <Box
                sx={{
                    width: 'calc(100% - 20px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '10px',
                }}>
                <Button
                    fullWidth
                    disableElevation
                    disabled={isLoading || !code || code < 10000 || (invitation_code_needed && invitationCode.trim().length == 0)}
                    variant="contained"
                    color='secondary'
                    onClick={sendCode}
                >
                    {t('auth.signin')}
                </Button>
                <Typography sx={{ fontSize: '16px' }}>{durationToString(duration)}</Typography>
            </Box>
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
                <Button
                    sx={{
                        color: theme.palette.text.primary,
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '6px',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onClick={() => {
                        if (props.onBackRequest)
                            props.onBackRequest();
                    }}
                >
                    <ChevronRight />
                    {t('auth.cancel')}
                </Button>
            </Box>
        </Box>}
    </Box>;
}

export type PhoneSigninCodeDialogProps = {
    open?: boolean,
    autoMode?: boolean,
    onClose?: () => void,
};

var PhoneSigninCodeDialog_opened: boolean = false;

export const PhoneSigninCodeDialog = (props: PhoneSigninCodeDialogProps) => {
    const cookies = new Cookies();
    const session_token = cookies.get('token');

    const [open, setOpen] = React.useState<boolean>(false);
    const [openLastValue, setOpenLastValue] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!props.autoMode)
            return;
        if (session_token)
            return;
        if (PhoneSigninCodeDialog_opened)
            return;

        PhoneSigninCodeDialog_opened = true;
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
        <PhoneSigninCode
            onClose={() => setOpen(false)}
        />
    </MeikadeDrawer>
}

const PhoneSigninCodePage = () => {
    return <Container
        component="main"
        maxWidth="sm"
    >
        <Box>
            <PhoneSigninCode />
        </Box>
    </Container>
}

export default PhoneSigninCodePage
