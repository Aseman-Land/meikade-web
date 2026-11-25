import { Circle } from '@mui/icons-material';
import { alpha, Box, Button, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MeikadeAppBar from '../../components/meikadeappbar';
import MeikadeLogo from '../../components/meikadelogo';
import { globalBorderRadius, theme } from '../../utils/theme';
import { DonatorsSection } from './donatepage';

const AboutPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const sectionStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        gap: '15px',
        background: theme.palette.background.paper,
        borderRadius: globalBorderRadius,
    };

    const contributors = [
        {
            "name": "آرمان فرج‌اللهی‌فر",
            "role": ""
        },
        {
            "name": "آرمین شالچیان",
            "role": ""
        },
        {
            "name": "امین حاتمی",
            "role": t('app.roles.logo_designer')
        },
        {
            "name": "پوریا خلج تهرانی",
            "role": ""
        },
        {
            "name": "پوریا دانشور",
            "role": ""
        },
        {
            "name": "حسن نوروزی",
            "role": ""
        },
        {
            "name": "حمیدرضا محمد",
            "role": t('app.roles.ganjoor')
        },
        {
            "name": "محسن ابراهیم‌نژاد",
            "role": ""
        },
        {
            "name": "منصوره زمانی",
            "role": ""
        },
        {
            "name": "هوتن براری",
            "role": ""
        },
    ];

    const core_team = [
        {
            "name": "امیرحسین موسوی",
            "role": t('app.roles.product_owner')
        },
        {
            "name": "بردیا دانشور",
            "role": t('app.roles.software_architecture')
        },
        {
            "name": "یاسمن مقدم",
            "role": t('app.roles.frontend_developer')
        },
        {
            "name": "علی رسولی",
            "role": t('app.roles.backend_developer')
        }
    ];

    return <Container maxWidth="sm" >
        <MeikadeAppBar
            enableBackButton
            hideLogo
        >
            <Typography
                sx={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translate(0%, -50%)',
                    fontSize: '16px',
                }}
            >
                {t('about')}
            </Typography>
        </MeikadeAppBar>
        <Box
            sx={{
                marginTop: '75px',
                paddingBottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 100,
                gap: '20px',
            }}
        >
            <Box sx={sectionStyle} >
                <MeikadeLogo
                    width='100px'
                    height='100px'
                />
                <Typography
                    variant='h5'
                    sx={{
                        textAlign: 'center',
                    }}
                >
                    {t('app.slogan')}
                </Typography>
                <Typography
                    sx={{
                        textAlign: 'justify',
                    }}
                >
                    {t('app.about')}
                </Typography>
            </Box>

            <Box sx={sectionStyle} >
                <Typography
                    variant='h6'
                    sx={{
                        textAlign: 'center',
                    }}
                >
                    {t('app.team.title')}
                </Typography>
                <Typography
                    sx={{
                        textAlign: 'justify',
                    }}
                >
                    {t('app.team.description')}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'start',
                        alignItems: 'center',
                        gap: '2px',
                        width: '100%',
                    }}
                >
                    {core_team.map((v) => (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'start',
                                alignItems: 'center',
                                gap: '10px',
                                width: '100%',
                            }}
                        >
                            <Circle sx={{ fontSize: '10px' }} />
                            <Typography>{v.name + (v.role.length ? ':' : '')}</Typography>
                            <Typography sx={{ fontWeight: 700 }}>{v.role}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box sx={sectionStyle} >
                <Typography
                    variant='h6'
                    sx={{
                        textAlign: 'center',
                    }}
                >
                    {t('app.thanks.title')}
                </Typography>
                <Typography
                    sx={{
                        textAlign: 'justify',
                    }}
                >
                    {t('app.thanks.description')}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'start',
                        alignItems: 'center',
                        gap: '2px',
                        width: '100%',
                    }}
                >
                    {contributors.map((v) => (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'start',
                                alignItems: 'center',
                                gap: '10px',
                                width: '100%',
                            }}
                        >
                            <Circle sx={{ fontSize: '10px' }} />
                            <Typography>{v.name + (v.role.length ? ':' : '')}</Typography>
                            <Typography sx={{ fontWeight: 700 }}>{v.role}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box sx={sectionStyle} >
                <DonatorsSection />
                <Button
                    variant='contained'
                    disableElevation
                    sx={{
                        backgroundColor: alpha(theme.palette.text.primary, 0.6)
                    }}
                    onClick={() => {
                        navigate('/donate');
                    }}
                >
                    <Typography>{t('donate')}</Typography>
                </Button>
            </Box>

            <Box sx={sectionStyle} >
                <Box
                    sx={{
                        width: '100px',
                        height: '100px',
                        background: 'url(/assets/images/aseman.png)',
                        backgroundSize: "cover",
                        margin: '5px',
                    }}
                />
                <Typography
                    variant='h6'
                    sx={{
                        textAlign: 'center',
                    }}
                >
                    {t('app.aseman.title')}
                </Typography>
                <Typography
                    sx={{
                        textAlign: 'justify',
                    }}
                >
                    {t('app.aseman.description')}
                </Typography>
            </Box>
        </Box>
    </Container>
}

export default AboutPage;