import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import HomeTemplate from '../templates/home-template';
import MButton from '../../components/MButton';

const ExplorePage = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();

    return <HomeTemplate
        title={t('explore-page.title')!}
    >
        <MButton
            onClick={() => navigate('/test')}
        >
            <Typography>{t('explore-page.title')}</Typography>
        </MButton>
    </HomeTemplate>
}

export default ExplorePage;
