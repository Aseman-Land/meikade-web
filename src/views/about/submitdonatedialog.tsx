import { Box, Button, CircularProgress, Switch, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { MkAddDonate } from '../../models/donate';
import { MkDonateServices } from '../../services/donate';

type SubmitDonateDialogProps = {
    onDonateSubmited?: () => void,
};

const SubmitDonateDialog = (props: SubmitDonateDialogProps) => {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef(false);
    const [ananymous, setAnanymous] = React.useState<boolean>(false);
    const [name, setName] = React.useState<string>('');
    const [message, setMessage] = React.useState<string>('');
    const [refId, setRefId] = React.useState<string>('');
    const [amount, setAmount] = React.useState<number | null>(null);

    const submit = async () => {
        loadingRef.current = true;
        setIsLoading(true);
        try {
            const donate: MkAddDonate = {
                amount: amount,
                name: ananymous ? null : name.trim().length > 0 ? name.trim() : null,
                message: message.trim().length > 0 ? message.trim() : null,
                ref_id: refId.trim().length > 0 ? refId.trim() : null,
            };

            const result = await MkDonateServices.addDonate(donate);
            if (result.status && result.result) {
                if (props.onDonateSubmited)
                    props.onDonateSubmited();
                return;
            }
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    }

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            padding: '10px',
        }}
    >
        {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', p: '50px 0px' }}>
            <CircularProgress sx={{ alignSelf: 'center', margin: '20px 10px' }} id="busy" />
        </Box>}
        {!isLoading && <>
            <Typography>
                {t('app.spiritual_support.submit_donate.submit-message')}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography>
                    {t('app.spiritual_support.submit_donate.ananymoius')}
                </Typography>
                <Switch
                    checked={ananymous}
                    onChange={(v) => setAnanymous(v.target.checked)}
                />
            </Box>
            {!ananymous && <TextField
                fullWidth
                label={t('app.spiritual_support.submit_donate.name')}
                value={name}
                onChange={(v) => setName(v.target.value)}
            />}
            <TextField
                fullWidth
                label={t('app.spiritual_support.submit_donate.ref_id')}
                value={refId}
                onChange={(v) => setRefId(v.target.value)}
            />
            <TextField
                fullWidth
                label={t('app.spiritual_support.submit_donate.amount')}
                value={amount ? amount.toString() : ''}
                onChange={(v) => {
                    try {
                        const num = parseInt(v.target.value);
                        if (isFinite(num))
                            setAmount(num);
                        else
                            setAmount(null);
                    } catch (e) { }
                }}
            />
            <TextField
                fullWidth
                multiline
                minRows='6'
                label={t('app.spiritual_support.submit_donate.message')}
                value={message}
                onChange={(v) => setMessage(v.target.value)}
            />
            <Button
                fullWidth
                variant='contained'
                disableElevation
                disabled={refId.trim().length == 0 && (amount == null || amount < 1000)}
                onClick={submit}
            >
                <Typography>
                    {t('app.spiritual_support.submit_donate.submit')}
                </Typography>
            </Button>
        </>}
    </Box>
}

export default SubmitDonateDialog;