import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import HomeTemplate from '../templates/home-template';
import MButton from '../../components/MButton';
import { getPoets } from '../../services/poet';
import React from 'react';
import { Poet } from '../../models/poet';

const HomePage = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();

    const [poets, setPoets] = React.useState<Array<Poet>>([]);

    const reload = async () => {
        const poets = await getPoets();
        setPoets(poets);
    };

    React.useEffect(() => {
        reload();
    }, []);

    return <HomeTemplate
        title={t('home-page.title')!}
    >
        {poets.map((p: Poet, idx: number) => (
            <Typography>{p.name}</Typography>
        ))}
    </HomeTemplate>
}

export default HomePage;
