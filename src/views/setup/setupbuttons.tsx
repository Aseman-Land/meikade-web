import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, BoxProps, Button } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { darkMode, theme } from '../../utils/theme';

export type SetupBottonsProps = {
    total: number,
    currentStep: number,
    onSuccessfull?: () => void,
    onBack?: () => void,
} & BoxProps;

const SetupBottons = (props: SetupBottonsProps) => {
    const { t } = useTranslation();

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}
    >
        <Button
            variant='outlined'
            disableElevation
            disabled={props.currentStep > 0 ? false : true}
            onClick={props.onBack}
            sx={{
                opacity: props.currentStep > 0 ? 1 : 0,
                // minWidth: '140px',
                color: darkMode ? "#fff" : theme.palette.primary.main,
                borderColor: darkMode ? "#fff" : theme.palette.primary.main,
            }}
        >
            <ChevronRight />
            {/* {t('setup.back')} */}
        </Button>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '3px',
            }}
        >
            {Array.from({ length: props.total }, (_, index) => (
                <Box
                    sx={{
                        width: '10px',
                        height: '10px',
                        background: index == props.currentStep ? theme.palette.primary.main : theme.palette.text.primary,
                        borderRadius: '20px',
                        opacity: index == props.currentStep ? 1 : 0.4,
                    }}
                />
            ))}
        </Box>
        <Button
            variant='outlined'
            disableElevation
            disabled={props.onSuccessfull ? false : true}
            onClick={props.onSuccessfull}
            sx={{
                opacity: props.onSuccessfull ? 1 : 0,
                // minWidth: '140px',
                color: darkMode ? "#fff" : theme.palette.primary.main,
                borderColor: darkMode ? "#fff" : theme.palette.primary.main,
            }}
        >
            {/* {props.currentStep == 0 ? t('setup.start') : props.currentStep < props.total - 1 ? t('setup.next') : t('setup.finish')} */}
            <ChevronLeft />
        </Button>
    </Box>
}

export default SetupBottons;
