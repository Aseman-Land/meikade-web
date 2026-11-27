import { Box, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import * as React from "react";
import { Cookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import MeikadeLogo from '../../components/meikadelogo';
import { globalHandleError } from "../../layouts/mainframe";
import { MkUserNew } from "../../models/user";
import { MkAuthServices } from "../../services/auth";
import { hashPassword } from '../../utils/auth';
import { theme } from "../../utils/theme";
import { sleep } from "../../utils/tools";
import AgreementDialog from "./agreementdialog";

export type RegisterProps = {
    onBackRequest?: () => void,
}

const Register = (props: RegisterProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const cookies = new Cookies();

    const invitation_code_needed: boolean = localStorage.getItem('invitation_code_needed') == "true";

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [fullname, setFullname] = React.useState<string>('');
    const [email, setEmail] = React.useState<string | null>(null);
    const [invitationCode, setInvitationCode] = React.useState<string | null>(null);
    const [registerToken, setRegisterToken] = React.useState<string | null>(null);
    const [agreementDialog, setAgreementDialog] = React.useState<boolean>(false);

    const doRegister = async (agreementId: number) => {
        setIsLoading(true);
        try {
            const hashPass: string = hashPassword(password);
            const names = fullname.split(' ');
            const req: MkUserNew = {
                firstname: names.slice(0, Math.max(1, names.length - 1)).join(' '),
                lastname: names.length > 1 ? names[names.length - 1] : null,
                username: username,
                password: hashPass,
                about: null,
                birthday: null,
                color: null,
                email: email,
                home: null,
                register_token: registerToken,
                google_session_id: null,
                invitation_code: invitationCode,
                agreement: agreementId,
            };

            await sleep(500);
            const reg_result = await MkAuthServices.signUp(req);
            if (reg_result.status) {
                const result = await MkAuthServices.signIn({ username, password: hashPass });
                if (typeof result.result == 'object' && result.status) {
                    var expire = new Date();
                    expire.setDate(expire.getDate() + 365);
                    cookies.remove('token', { path: '/' });
                    cookies.set('token', result.result.token, { path: '/', expires: expire });

                    localStorage.removeItem('register_token')

                    window.location.href = '/';
                    return;
                }
            }
        } catch (e) {
            console.debug(e)
        }
        setIsLoading(false);
    };

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value;

        let sanitized = raw.replace(/[^a-zA-Z0-9_]/g, '');
        sanitized = sanitized.replace(/^[0-9]+/, '');
        if (sanitized !== raw) {
            globalHandleError(t('errors.keyboard-english'));
        }

        setUsername(sanitized);
    };

    React.useEffect(() => {
        const token = localStorage.getItem('register_token');
        setRegisterToken(token);
        if ((!token || token.length == 0) && props.onBackRequest)
            props.onBackRequest();
    }, []);

    return (
        <Container
            component="main"
            maxWidth="xl" >
            <Box>
                <Box
                    sx={{
                        marginTop: '40px',
                        backgroundColor: theme.palette.background.paper,
                        padding: '25px',
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        maxWidth: 650,
                        gap: '40px',
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
                        <MeikadeLogo width="100px" height="100px" />
                    </Box>
                    {isLoading && <CircularProgress id="busy" />}
                    {!isLoading && <Box
                        sx={{
                            maxWidth: 'calc(100vw - 60px)',
                            width: '300px',
                            padding: '0 0 0 0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            alignItems: 'center',
                            marginBottom: '50px',
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
                            onChange={handleUsernameChange}
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
                        <TextField
                            name="name"
                            autoComplete="name"
                            fullWidth
                            label={t('user.fullname')}
                            required
                            sx={{
                                direction: 'ltr',
                            }}
                            value={fullname}
                            onChange={(event) => {
                                setFullname(event.target.value);
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
                                setInvitationCode(code.length > 0 ? code : null);
                            }}
                        />}
                        <TextField
                            name="email"
                            autoComplete="email"
                            fullWidth
                            label={t('user.email')}
                            required
                            variant="filled"
                            value={email}
                            sx={{ display: 'none' }}
                            onChange={(event) => {
                                setEmail(event.target.value);
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
                                disabled={isLoading || username.length <= 3 || password.length <= 3 || fullname.length <= 3 || (invitation_code_needed && !invitationCode)}
                                variant="contained"
                                onClick={() => setAgreementDialog(true)}
                            >
                                {t('register.signup')}
                            </Button>
                            <Button
                                fullWidth
                                disableElevation
                                variant="contained"
                                color='secondary'
                                onClick={() => {
                                    if (props.onBackRequest)
                                        props.onBackRequest()
                                    else
                                        navigate(-1);
                                }}
                            >
                                {t('register.cancel')}
                            </Button>
                        </Box>
                    </Box>}
                </Box>
            </Box>
            <AgreementDialog
                open={agreementDialog}
                onClose={() => setAgreementDialog(false)}
                onSuccessfull={(id: number) => {
                    doRegister(id);
                    setAgreementDialog(false);
                }}
            />
        </Container>
    );
}


export default Register
