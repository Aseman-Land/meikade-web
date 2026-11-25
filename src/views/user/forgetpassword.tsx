import { ChevronRight } from '@mui/icons-material';
import { Box, MenuItem, Select, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import { MuiTelInput, MuiTelInputInfo } from 'mui-tel-input';
import * as React from "react";
import { Cookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import MeikadeDrawer from '../../components/meikadedrawer';
import MeikadeLogo from '../../components/meikadelogo';
import { MkForgetRequest, MkSignInByCode } from '../../models/auth';
import { MkAuthServices } from '../../services/auth';
import { theme } from "../../utils/theme";
import { convertPersianToEnglishDigits, sleep } from '../../utils/tools';
import { timeout } from './phonesignin';

export type ForgetPasswordProps = {
    onBackRequest?: () => void,
    onClose?: () => void,
}

export const ForgetPassword = (props: ForgetPasswordProps) => {
    const { t } = useTranslation();

    const cookies = new Cookies();

    const [recoverType, setRecoverType] = React.useState<string>("username");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [codeStep, setCodeStep] = React.useState<Date | null>(null);
    const [email, setEmail] = React.useState<string | null>(null);
    const [phone, setPhone] = React.useState<string>('');
    const [fullPhone, setFullPhone] = React.useState<string>('');
    const [nationalNumber, setNationalNumber] = React.useState<string>('');
    const [token, setToken] = React.useState<string | null>(null);
    const [code, setCode] = React.useState<number | null>(null);
    const [duration, setDuration] = React.useState<number>(0);

    const sendCode = async () => {
        setIsLoading(true);
        try {
            await sleep(500);
            if (codeStep) {
                switch (recoverType) {
                    case 'phone': {
                        const req: MkSignInByCode = {
                            code: code?.toString() ?? '',
                            enter_phone_token: null,
                            signin_token: token ?? '',
                            invitation_code: null,
                        };

                        const result = await MkAuthServices.signInUsingCode(req);
                        if (typeof result.result == 'object' && result.status) {
                            localStorage.removeItem('enter_phone_token')
                            localStorage.removeItem('signin_token_expire')

                            if (result.result.token) {
                                var expire = new Date();
                                expire.setDate(expire.getDate() + 1);
                                cookies.remove('token', { path: '/' });
                                cookies.set('token', result.result.token, { path: '/', expires: expire });

                                window.location.href = '/';
                                return;
                            }
                        }
                    }
                        break;

                    case 'username': {
                        const req: MkForgetRequest = {
                            code: code?.toString() ?? '',
                            token: token ?? '',
                        };
                        const result = await MkAuthServices.forgetLogin(req);
                        if (result.result && result.status) {
                            var expire = new Date();
                            expire.setDate(expire.getDate() + 1);
                            cookies.remove('token', { path: '/' });
                            cookies.set('token', result.result.token, { path: '/', expires: expire });

                            window.location.href = '/';
                            return;
                        }
                    }
                        break;
                }
            } else {
                switch (recoverType) {
                    case 'phone': {
                        const result = await MkAuthServices.getCodeBySMS({ phone: fullPhone, password_change_auth: true });
                        if (result.result && result.status) {
                            setToken(result.result.signin_token);
                            setCodeStep(new Date);
                        }
                    }
                        break;

                    case 'username': {
                        const result = await MkAuthServices.forget(email!);
                        if (result.result && result.status) {
                            setToken(result.result);
                            setCodeStep(new Date);
                        }
                    }
                        break;
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
        if (!codeStep)
            return;

        const callback = () => {
            const now = new Date;
            if (codeStep) {
                const d = timeout - (now.getTime() - codeStep.getTime());
                if (d > 0) {
                    setDuration(Math.ceil(d / 1000));
                } else {
                    setDuration(0);
                    setCodeStep(null);
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
    }, [codeStep]);

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
            {codeStep ? <TextField
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
            /> : <>
                <Select
                    fullWidth
                    value={recoverType}
                    onChange={(v) => {
                        const val = v.target.value!;
                        if (typeof val == 'string')
                            setRecoverType(val);
                    }}
                >
                    <MenuItem value={"username"}>{t('auth.recover.by_username')}</MenuItem>
                    <MenuItem value={"phone"}>{t('auth.recover.by_phone')}</MenuItem>
                </Select>
                {recoverType == "username" && <TextField
                    name="email"
                    autoComplete="email"
                    fullWidth
                    label={t('user.email_or_uname')}
                    required
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />}
                {recoverType == "phone" && <MuiTelInput
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
                />}
            </>}
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
                    disabled={isLoading || (recoverType == "username" && (!email || email.length < 5)) || (recoverType == "phone" && (!nationalNumber || nationalNumber.length < 10))}
                    variant="contained"
                    color='secondary'
                    onClick={sendCode}
                >
                    {!codeStep && t('user.send_code')}
                    {codeStep && t('user.login-and-change-password')}
                </Button>
                {codeStep && <Typography sx={{ fontSize: '16px' }}>{durationToString(duration)}</Typography>}
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
                        if (codeStep) {
                            setCodeStep(null);
                        } else {
                            if (props.onBackRequest)
                                props.onBackRequest();
                        }
                    }}
                >
                    <ChevronRight />
                    {t('auth.cancel')}
                </Button>
            </Box>
        </Box>}
    </Box>;
}

export type ForgetPasswordDialogProps = {
    open?: boolean,
    autoMode?: boolean,
    onClose?: () => void,
};

var ForgetPasswordDialog_opened: boolean = false;

export const ForgetPasswordDialog = (props: ForgetPasswordDialogProps) => {
    const cookies = new Cookies();
    const session_token = cookies.get('token');

    const [open, setOpen] = React.useState<boolean>(false);
    const [openLastValue, setOpenLastValue] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!props.autoMode)
            return;
        if (session_token)
            return;
        if (ForgetPasswordDialog_opened)
            return;

        ForgetPasswordDialog_opened = true;
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
        <ForgetPassword
            onClose={() => setOpen(false)}
        />
    </MeikadeDrawer>
}

const ForgetPasswordPage = () => {
    return <Container
        component="main"
        maxWidth="sm"
    >
        <Box>
            <ForgetPassword />
        </Box>
    </Container>
}

export default ForgetPasswordPage
