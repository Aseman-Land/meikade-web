import { CircularProgress, DialogProps, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MeikadeDialog from "../../components/meikadedialog";
import { MkContentVersesAnalize } from '../../models/contentverses';
import { MkContentServices } from '../../services/content';
import { sleep } from '../../utils/tools';

type AiAnalizingDialogProps = {
    verseId?: number,
    contentId: number,
    onCloseRequest?: () => void,
} & DialogProps;

const AiAnalizingDialog = (props: AiAnalizingDialogProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [aiAnalizes, setAiAnalizes] = React.useState<MkContentVersesAnalize[] | null>(null);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);

    const reload = async () => {
        if (loadingRef.current) return;
        if (!props.open || !props.verseId || !props.contentId)
            return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            const result = await MkContentServices.analizeVerse(props.contentId, props.verseId);
            if (result.status && result.result) {
                setAiAnalizes(result.result);
            } else {
                setAiAnalizes(null);
            }
        } catch {
        }
        await sleep(500);
        setIsLoading(false);
        loadingRef.current = false;
    }

    React.useEffect(() => {
        reload()
    }, [props.verseId, props.contentId, props.open]);

    return <MeikadeDialog
        {...props}
        onClose={props.onCloseRequest}
        title={t('ai-analizing.title')!}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            ...props.sx,
        }}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
            }}
        >
            {isLoading && <CircularProgress sx={{ alignSelf: 'center', marginTop: '50px', marginBottom: '50px' }} id="busy" />}
            {!isLoading && <>
                {(!aiAnalizes || aiAnalizes.length == 0) && <Typography sx={{ marginTop: '40px', padding: '20px', opacity: 0.8 }}>{t('ai-analizing.not-exists')}</Typography>}
                {aiAnalizes && <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', marginBottom: '30px' }}>
                    <Typography variant='h6'>{t('ai-analizing.meaning')}</Typography>
                    <ul style={{ padding: '0px 20px' }}>
                        {aiAnalizes.map((aiAnalize: MkContentVersesAnalize) => (
                            <li>
                                <Typography sx={{ textAlign: 'justify', fontWeight: 700 }}>{aiAnalize.verse_text}</Typography>
                                <Typography sx={{ textAlign: 'justify', marginBottom: '20px' }}>{aiAnalize.simple_meaning}</Typography>
                            </li>
                        ))}
                    </ul>

                    <Typography variant='h6'>{t('ai-analizing.deep-analysis')}</Typography>
                    <ul style={{ padding: '0px 20px' }}>
                        {aiAnalizes.map((aiAnalize: MkContentVersesAnalize) => (
                            <li>
                                <Typography sx={{ textAlign: 'justify', fontWeight: 700 }}>{aiAnalize.verse_text}</Typography>
                                <Typography sx={{ textAlign: 'justify', marginBottom: '20px' }}>{aiAnalize.deep_analysis}</Typography>
                            </li>
                        ))}
                    </ul>
                </Box>}

            </>}
        </Box>
    </MeikadeDialog>
}

export default AiAnalizingDialog;
