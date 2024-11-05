import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import HomeTemplate from '../templates/home-template';
import MButton from '../../components/MButton';
import { getPoets } from '../../services/poet';
import React from 'react';

const HomePage = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();

    const reload = async () => {
        const poets = await getPoets();
        console.log(poets);
    };

    React.useEffect(() => {
        reload();
    }, []);

    return <HomeTemplate
        title={t('home-page.title')!}
    >
        <MButton
            onClick={() => navigate('/test')}
        >
            <Typography>{t('home-page.test')}</Typography>
        </MButton>
    </HomeTemplate>
}

export default HomePage;
