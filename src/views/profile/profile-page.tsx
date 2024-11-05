import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import HomeTemplate from '../templates/home-template';
import MButton from '../../components/MButton';

const ProfilePage = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();

    return <HomeTemplate
        title={t('profile-page.title')!}
    >
        <MButton
            onClick={() => navigate('/test')}
        >
            <Typography>{t('profile-page.test')}</Typography>
        </MButton>
    </HomeTemplate>
}

export default ProfilePage;
