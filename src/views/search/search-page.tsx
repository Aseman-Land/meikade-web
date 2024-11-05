import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import HomeTemplate from '../templates/home-template';
import MButton from '../../components/MButton';

const SearchPage = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();

    return <HomeTemplate
        title={t('search-page.title')!}
    >
        <MButton
            onClick={() => navigate('/test')}
        >
            <Typography>{t('search-page.test')}</Typography>
        </MButton>
    </HomeTemplate>
}

export default SearchPage;
