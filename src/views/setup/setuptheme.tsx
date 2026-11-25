import { Box, BoxProps, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import ThemeSwitcher from '../settings/themeswitcher';
import SetupBottons from './setupbuttons';

export type SetupThemeProps = {
    total: number,
    currentStep: number,
    onSuccessfull: () => void,
    onBack: () => void,
} & BoxProps;

const SetupTheme = (props: SetupThemeProps) => {
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
            {t('setup.steps.step_theme.description')}
        </Typography>
        <ThemeSwitcher />
        <SetupBottons
            total={props.total}
            currentStep={props.currentStep}
            onSuccessfull={props.onSuccessfull}
            onBack={props.onBack}
        />
    </Box>
}

export default SetupTheme;
