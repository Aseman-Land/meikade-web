import { Box, ButtonBase, CircularProgress, Container, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import BookPoemCard from '../../components/bookpoemcard';
import MeikadeAppBar from '../../components/meikadeappbar';
import SimpleContentCard from '../../components/simplecontentcard';
import UserPoemCard from '../../components/userpoemcard';
import { MkBookResult } from '../../models/book';
import { MkFullContent } from '../../models/content';
import { MkExploreRow } from '../../models/explore';
import { MkFullUser } from '../../models/user';
import { MkContentServices } from '../../services/content';
import { MkExploreServices } from '../../services/explore';
import { globalBorderRadius } from '../../utils/theme';
import { sleep } from '../../utils/tools';
import { DefaultSignInDialog } from '../user/signin';

const MainMenuItem = (props: { title: string, image: string, action: (() => Promise<void>) | string }) => {

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);

    const buttonClick = async () => {
        if (typeof (props.action) == 'string')
            return;
        if (loadingRef.current)
            return;

        setIsLoading(true);
        loadingRef.current = true;
        try {
            // await sleep(500);
            await props.action();
        } catch { }
        loadingRef.current = false;
        setIsLoading(false);
    }

    const style = {
        background: `url(${props.image})`,
        height: '100px',
        width: '100%',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: globalBorderRadius,
    };

    const inner = <Box
        sx={{
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: globalBorderRadius,
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
        }}
    >
        {isLoading && <CircularProgress sx={{ alignSelf: 'center', color: '#fff' }} id="busy" />}
        {!isLoading && <Typography sx={{ color: '#fff', fontSize: '16px', whiteSpace: "pre-line", textAlign: 'center' }}>{props.title}</Typography>}
    </Box>;

    if (typeof (props.action) == 'string') {
        return <ButtonBase
            sx={style}
            component={RouterLink}
            to={props.action}
        >
            {inner}
        </ButtonBase>
    } else {
        return <ButtonBase
            sx={style}
            onClick={buttonClick}
        >
            {inner}
        </ButtonBase>
    }
}

const ExplorePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [exploreRows, setExploreRows] = React.useState<Array<MkExploreRow>>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef<boolean>(false);

    const reload = async () => {
        if (loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            const result = await MkExploreServices.getIntelligenceExplore({
                limit: 50,
                offset: null,
            });
            if (result.status && result.result)
                setExploreRows(result.result.rows);
        } catch {

        }
        setIsLoading(false);
        loadingRef.current = false;
    }

    const doFaal = async () => {
        const result = await MkContentServices.random({ author_id: null, book_id: 24 });
        if (result.status && result.result)
            navigate(`/content/${result.result.id}`)
    }

    const doRandom = async () => {
        const result = await MkContentServices.random({ author_id: null, book_id: null });
        if (result.status && result.result)
            navigate(`/content/${result.result.id}`)
    }

    React.useEffect(() => {
        reload();
    }, [])

    return <Container maxWidth="sm">
        <MeikadeAppBar />

        <Box
            sx={{
                marginTop: '70px',
                paddingBottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2, sm: 3 },
            }}
        >
            {isLoading && <CircularProgress sx={{ alignSelf: 'center', marginTop: '40%' }} id="busy" />}
            {!isLoading && <>
                {exploreRows.map((row: MkExploreRow, index: number) => (
                    <>
                        <Typography
                            variant='h6'
                            sx={{
                                fontSize: { md: '18px', xs: '17px', sm: '20px' },
                                fontWeight: 600,
                            }}
                        >
                            {t('explore.' + row.title)}
                        </Typography>

                        <Box>
                            {row.main_menu && <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                <MainMenuItem title={t('explore.poets')} image='/assets/images/poets.jpg' action='/treasure' />
                                <MainMenuItem title={t('explore.random')} image='/assets/images/random.jpg' action={doRandom} />
                                <MainMenuItem title={t('explore.faal')} image='/assets/images/faal.jpg' action={doFaal} />
                            </Box>}
                            {row.books && (
                                <Box
                                    sx={{
                                        marginLeft: '-16px',
                                        marginRight: '-16px',
                                    }}
                                >
                                    <Swiper
                                        spaceBetween={10}
                                        slidesPerView={2.2}
                                        breakpoints={{
                                            480: { slidesPerView: 2.8 },
                                            600: { slidesPerView: 3.2 },
                                            768: { slidesPerView: 3.2 },
                                            900: { slidesPerView: 3.2 }
                                        }}
                                    >
                                        {row.books.map((book: MkBookResult) => (
                                            <SwiperSlide>
                                                <BookPoemCard book={book} sx={{ marginLeft: '16px' }} />
                                            </SwiperSlide>
                                        ))}
                                        <SwiperSlide>
                                            <Box sx={{ width: '50px', height: '10px' }} />
                                        </SwiperSlide>
                                    </Swiper>
                                </Box>
                            )}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: { xs: '10px', sm: '15px' }
                            }}
                            >
                                {row.contents?.map((content: MkFullContent) => (
                                    <SimpleContentCard contentItem={content} onReloadRequest={reload} />
                                ))}
                            </Box>
                            {row.users && (
                                <Box sx={{
                                    marginLeft: '-16px',
                                    marginRight: '-16px',
                                }}
                                >
                                    <Swiper
                                        spaceBetween={0}
                                        slidesPerView={4.3}
                                        breakpoints={{
                                            480: { slidesPerView: 4.5 },
                                            600: { slidesPerView: 4.8 },
                                            768: { slidesPerView: 5.5 },
                                            900: { slidesPerView: 5.4 },
                                        }}
                                    >
                                        {row.users.map((user: MkFullUser) => (
                                            <SwiperSlide key={user.id}>
                                                <UserPoemCard user={user} />
                                            </SwiperSlide>
                                        ))}
                                        <SwiperSlide>
                                            <Box sx={{ width: '50px', height: '10px' }} />
                                        </SwiperSlide>
                                    </Swiper>
                                </Box>
                            )}
                        </Box>
                    </>))}
            </>}
        </Box>
        <DefaultSignInDialog autoMode />
    </Container>
}

export default ExplorePage;