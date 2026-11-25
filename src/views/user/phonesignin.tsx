import { ChevronRight, Person } from '@mui/icons-material';
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import { MuiTelInput, MuiTelInputInfo } from 'mui-tel-input';
import * as React from "react";
import { Cookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import MeikadeDrawer from '../../components/meikadedrawer';
import MeikadeLogo from '../../components/meikadelogo';
import { MkAuthServices } from '../../services/auth';
import { theme } from "../../utils/theme";
import { convertPersianToEnglishDigits } from '../../utils/tools';
import { ForgetPassword } from './forgetpassword';
import { LegacySignin } from './legacysignin';
import { PhoneSigninCode } from './phonesignincode';
import Register from './register';

export type PhoneSigninProps = {
    onClose?: () => void,
}

export const timeout: number = 120 * 1000;

export const PhoneSignin = (props: PhoneSigninProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const cookies = new Cookies();

    const signin_token_expire_str = localStorage.getItem('signin_token_expire');

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [phone, setPhone] = React.useState<string>('');
    const [fullPhone, setFullPhone] = React.useState<string>('');
    const [nationalNumber, setNationalNumber] = React.useState<string>('');

    const [legacySignIn, setLegacySignIn] = React.useState<boolean>(false);
    const [forgetPassword, setForgetPassword] = React.useState<boolean>(false);
    const [codeMode, setCodeMode] = React.useState<Date | null>(signin_token_expire_str ? new Date(Date.parse(signin_token_expire_str)) : null);
    const [signupMode, setSignupMode] = React.useState<boolean>(false);
    const [upgradeAccountMode, setUpgradeAccountMode] = React.useState<boolean>(false);

    const queryParams = new URLSearchParams(location.search);
    const appMode: boolean = queryParams.get('appMode') == "true" || localStorage.getItem('appMode') == 'true';
    if (appMode) {
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

    const sendCode = async () => {
        setIsLoading(true);
        try {
            const result = await MkAuthServices.getCodeBySMS({ phone: fullPhone, password_change_auth: false });
            if (typeof result.result == 'object' && result.status) {
                moveToCode(result.result.signin_token, result.result.invitation_code_needed);
            }
        } catch (e) {
            console.debug(e);
        }
        setIsLoading(false);
    };

    const moveToCode = (signin_token: string | null, invitation_code_needed: boolean) => {
        const now = new Date();
        localStorage.removeItem('signin_token');
        localStorage.removeItem('signin_token_expire');
        if (!invitation_code_needed)
            localStorage.removeItem('invitation_code_needed');
        if (signin_token) {
            localStorage.setItem('signin_token', signin_token);
            localStorage.setItem('invitation_code_needed', invitation_code_needed ? "true" : "false");
            localStorage.setItem('signin_token_expire', now.toISOString());
            setCodeMode(now);
        } else {
            setCodeMode(null);
        }
        return;
    }

    if (forgetPassword) {
        return <ForgetPassword
            onBackRequest={() => setForgetPassword(false)}
        />
    }

    if (codeMode) {
        return <PhoneSigninCode
            upgradeAccountMode={upgradeAccountMode}
            onBackRequest={() => moveToCode(null, false)}
            onSignupRequest={() => {
                moveToCode(null, true);
                setSignupMode(true);
                setIsLoading(false);
            }}
        />
    }

    if (signupMode) {
        return <Register onBackRequest={() => setSignupMode(false)} />
    }

    if (legacySignIn && !upgradeAccountMode) {
        return <LegacySignin
            onBackRequest={() => setLegacySignIn(false)}
            onSignupRequest={() => setSignupMode(true)}
            onEnterPhoneMode={() => setUpgradeAccountMode(true)}
            onForgetPasswordRequest={() => setForgetPassword(true)}
        />;
    }

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
        {!upgradeAccountMode && <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '20px',
            }}
        >
            <MeikadeLogo width='130px' height='130px' />
        </Box>}
        {upgradeAccountMode && <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '20px',
                marginBottom: '30px',
            }}
        >
            <Typography sx={{ textAlign: 'center' }} variant='h5'>{t('auth.upgrade-title')}</Typography>
            <Typography sx={{ textAlign: 'center' }}>{t('auth.upgrade-description')}</Typography>
        </Box>}
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
            <MuiTelInput
                name="phone"
                fullWidth
                forceCallingCode
                required
                defaultCountry="IR"
                onlyCountries={["IR"]}
                value={phone}
                sx={{
                    direction: 'rtl',
                }}
                onChange={(value: string, info: MuiTelInputInfo) => {
                    var num: string = convertPersianToEnglishDigits(info.nationalNumber ?? '').trim();
                    while (num.length && num[0] == '0')
                        num = num.slice(1);

                    setNationalNumber(num);
                    setFullPhone(info.countryCallingCode + num);
                    setPhone(value);
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
                    disabled={isLoading || !nationalNumber || nationalNumber.length < 10}
                    variant="contained"
                    color='secondary'
                    onClick={sendCode}
                >
                    {t('auth.send-code')}
                </Button>
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
                {!upgradeAccountMode && <Button
                    sx={{
                        color: theme.palette.primary.main,
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '6px',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onClick={() => setLegacySignIn(true)}
                >
                    <Person />
                    {t('auth.legacy')}
                </Button>}
                {upgradeAccountMode && <Button
                    sx={{
                        color: theme.palette.text.primary,
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '6px',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onClick={() => setUpgradeAccountMode(false)}
                >
                    <ChevronRight />
                    {t('auth.cancel')}
                </Button>}
            </Box>
        </Box>}
    </Box>;
}

export type PhoneSigninDialogProps = {
    open?: boolean,
    autoMode?: boolean,
    onClose?: () => void,
};

var PhoneSigninDialog_opened: boolean = false;

export const PhoneSigninDialog = (props: PhoneSigninDialogProps) => {
    const cookies = new Cookies();
    const session_token = cookies.get('token');

    const [open, setOpen] = React.useState<boolean>(false);
    const [openLastValue, setOpenLastValue] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!props.autoMode)
            return;
        if (session_token)
            return;
        if (PhoneSigninDialog_opened)
            return;

        PhoneSigninDialog_opened = true;
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
        <PhoneSignin
            onClose={() => setOpen(false)}
        />
    </MeikadeDrawer>
}

const PhoneSigninPage = () => {
    return <Container
        component="main"
        maxWidth="sm"
    >
        <Box>
            <PhoneSignin />
        </Box>
    </Container>
}

export default PhoneSigninPage
