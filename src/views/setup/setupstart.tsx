import { Box, BoxProps, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import SetupBottons from './setupbuttons';

export type SetupStartProps = {
    total: number,
    currentStep: number,
    onSuccessfull: () => void,
    onBack: () => void,
} & BoxProps;

const SetupStart = (props: SetupStartProps) => {
    const { t } = useTranslation();

    return <Box
        {...props}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '100%',
        }}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                padding: '60px 0px 80px 0px',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Typography sx={{ textAlign: 'center' }}>
                {t('setup.steps.step_start.description')}
            </Typography>
        </Box>
        <SetupBottons
            total={props.total}
            currentStep={props.currentStep}
            onSuccessfull={props.onSuccessfull}
            onBack={props.onBack}
        />
    </Box>
}

export default SetupStart;
