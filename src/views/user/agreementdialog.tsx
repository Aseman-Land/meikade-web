import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { alpha, Box, Button, CircularProgress, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { MarkdownRenderer } from '../../components/markdownrenderer';
import MeikadeDrawer, { MeikadeDrawerProps } from "../../components/meikadedrawer";
import { MkAgreement } from '../../models/agreement';
import { MkUserUpdate } from '../../models/user';
import { MkAgreementServices } from '../../services/agreement';
import { MkUserServices } from '../../services/user';
import { globalBorderRadius, theme } from '../../utils/theme';
import { sleep } from '../../utils/tools';

export type AgreementDialogProps = {
    onSuccessfull?: (id: number) => void,
} & MeikadeDrawerProps;

const AgreementDialog = (props: AgreementDialogProps) => {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const loadingRef = React.useRef<boolean>(false);

    const [accepted, setAccepted] = React.useState<boolean>(false);
    const [agreement, setAgreement] = React.useState<MkAgreement | null>(null);

    const reload = async () => {
        if (loadingRef.current)
            return;

        setIsLoading(true);
        loadingRef.current = true;

        try {
            const result = await MkAgreementServices.getLatest();
            await sleep(1000);
            if (result.status && result.result) {
                setAgreement(result.result);
            } else {
                setAgreement(null);
            }
        } catch {
        }

        loadingRef.current = false;
        setIsLoading(false);
    }

    const accept = async () => {
        if (!agreement)
            return;
        if (loadingRef.current)
            return;

        setIsLoading(true);
        loadingRef.current = true;

        try {
            const req: MkUserUpdate = {
                firstname: null,
                lastname: null,
                about: null,
                birthday: null,
                color: null,
                password: null,
                current_password: null,
                home: null,
                agreement: agreement.id,
                setup_version: null,
            };

            const result = await MkUserServices.edit(req);
            await sleep(500);
            if (result.result) {
                window.location.href = window.location.pathname;
                if (props.onClose)
                    props.onClose({}, "escapeKeyDown");
                return;
            }
        } catch { }

        loadingRef.current = false;
        setIsLoading(false);
    }

    React.useEffect(() => {
        reload();
    }, []);

    React.useEffect(() => {
        if (props.open) {
            setAccepted(false);
        }
    }, [props.open]);

    return <MeikadeDrawer
        {...props}
        anchor="bottom"
        title={t('agreement.title')!}
        nonClosable={props.onSuccessfull ? false : true}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0px 16px',
                gap: '10px',
            }}
        >
            {isLoading && <CircularProgress sx={{ 'margin': '100px 0px' }} id="busy" />}
            {!isLoading && <>
                <Typography
                    sx={{
                        whiteSpace: "pre-line",
                        textAlign: 'justify',
                    }}
                >
                    {t('agreement.description')}
                </Typography>
                <Box
                    sx={{
                        width: '100%',
                        textAlign: 'justify',
                        maxHeight: 'calc(100dvh - 350px)',
                        minHeight: '200px',
                        overflowY: 'scroll',
                        backgroundColor: alpha(theme.palette.text.primary, 0.07),
                        padding: '10px',
                        borderRadius: globalBorderRadius,
                    }}
                >
                    {agreement && <MarkdownRenderer content={agreement.text} />}
                </Box>
                <Button
                    fullWidth
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 20px',
                        justifyContent: 'start',
                        color: 'unset',
                    }}
                    onClick={() => setAccepted(!accepted)}
                >
                    {accepted ? <CheckBox sx={{ color: theme.palette.primary.main }} /> : <CheckBoxOutlineBlank />}
                    <Typography
                        sx={{
                            fontWeight: '700',
                        }}
                    >
                        {t('agreement.check')}
                    </Typography>
                </Button>
                <Button
                    fullWidth
                    variant='contained'
                    disableElevation
                    disabled={!accepted}
                    onClick={() => {
                        if (props.onSuccessfull) {
                            props.onSuccessfull(agreement ? agreement.id : 0);
                        } else {
                            accept();
                        }
                    }}
                >
                    {t('agreement.accept')}
                </Button>
            </>}
        </Box>
    </MeikadeDrawer>
}

export default AgreementDialog;