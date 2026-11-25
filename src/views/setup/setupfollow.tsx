import { Box, BoxProps, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import TreasureLists from '../treasure/treasurelists';
import SetupBottons from './setupbuttons';

export type SetupFollowProps = {
    total: number,
    currentStep: number,
    onSuccessfull: () => void,
    onBack: () => void,
} & BoxProps;

const SetupFollow = (props: SetupFollowProps) => {
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
        <Typography sx={{ textAlign: 'center' }}>
            {t('setup.steps.step_follow.description')}
        </Typography>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxHeight: 'calc(100dvh - 300px)',
                minHeight: 'calc(100dvh - 300px)',
                overflowY: 'scroll',
            }}
        >
            <TreasureLists followMode />
        </Box>
        <SetupBottons
            total={props.total}
            currentStep={props.currentStep}
            onSuccessfull={props.onSuccessfull}
            onBack={props.onBack}
        />
    </Box>
}

export default SetupFollow;
