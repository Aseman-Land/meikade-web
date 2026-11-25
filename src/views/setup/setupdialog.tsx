import { Box, CircularProgress } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import MeikadeDrawer, { MeikadeDrawerProps } from "../../components/meikadedrawer";
import { MkUserServices } from '../../services/user';
import { sleep } from '../../utils/tools';
import SetupFollow from './setupfollow';
import SetupStart from './setupstart';
import SetupTheme from './setuptheme';

export type SetupDialogProps = {
    currentVersion?: number,
} & MeikadeDrawerProps;

const SetupDialog = (props: SetupDialogProps) => {
    const { t } = useTranslation();

    const [step, setStep] = React.useState<number>(props.currentVersion ?? 0);
    const total: number = 3;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);

    const finish = async () => {
        if (loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);

        try {
            const result = await MkUserServices.edit({
                firstname: null,
                lastname: null,
                about: null,
                birthday: null,
                color: null,
                password: null,
                current_password: null,
                home: null,
                agreement: null,
                setup_version: total,
            });
            await sleep(500);
            if (result.status && result.result) {
                window.location.href = window.location.pathname;
                return;
            }
        } catch { }

        setIsLoading(false);
        loadingRef.current = false;
    }

    const next = () => {
        if (step < total - 1) {
            setStep(step + 1);
        } else {
            finish();
        }
    }

    const back = () => {
        if (step > 0) {
            setStep(step - 1);
        } else {
        }
    }

    return <MeikadeDrawer
        {...props}
        anchor="bottom"
        title={t('setup.title')!}
        nonClosable
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
            {isLoading && <CircularProgress sx={{ alignSelf: 'center', margin: '100px 0px' }} id="busy" />}
            {!isLoading && <>
                {step == 0 && <SetupStart onSuccessfull={next} onBack={back} total={total} currentStep={step} />}
                {step == 1 && <SetupFollow onSuccessfull={next} onBack={back} total={total} currentStep={step} />}
                {step == 2 && <SetupTheme onSuccessfull={next} onBack={back} total={total} currentStep={step} />}
            </>}
        </Box>
    </MeikadeDrawer>
}

export default SetupDialog;