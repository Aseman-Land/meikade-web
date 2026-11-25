import { ChevronLeft, ChevronRight, Circle, CopyAllOutlined } from '@mui/icons-material';
import { alpha, Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import MeikadeAppBar from '../../components/meikadeappbar';
import MeikadeDrawer from '../../components/meikadedrawer';
import { globalShowInfoMessage } from '../../layouts/mainframe';
import { MkDonate } from '../../models/donate';
import { MkDonateServices } from '../../services/donate';
import { darkMode, globalBorderRadius, globalBorderRadiusValue, theme } from '../../utils/theme';
import SubmitDonateDialog from './submitdonatedialog';

type DonateMethods = {
    title: string;
    description: string;
    button: string;
    account_owner: string | null;
    address: string | null;
    url: string | null;
    shareUrl: string | null;
    icon: string | null;
};

type DonateMethodComponentProps = {
    item: DonateMethods,
    onMethodRequest: (item: DonateMethods) => void,
};

const DonateMethodComponent = (props: DonateMethodComponentProps) => {
    const { t } = useTranslation();

    const handleShare = (text: string, link: string) => {
        navigator.share({
            title: t('app.title') ?? 'Meikade',
            text: text,
            url: link,
        });
    }

    return <Button
        sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            gap: '10px',
            justifyContent: 'space-between',
            color: 'unset',
        }}
        onClick={() => {
            if (props.item.url != null) {
                window.open(props.item.url, '_blank', 'noopener,noreferrer');
            } else if (props.item.address != null) {
                props.onMethodRequest(props.item);
            } else if (props.item.shareUrl) {
                handleShare(props.item.description, props.item.shareUrl)
            }
        }}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '10px',
            }}
        >
            <Circle sx={{ fontSize: '10px' }} />
            <Typography>{props.item.title}</Typography>
        </Box>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '10px',
            }}
        >
            {props.item.icon ? <Box
                component="img"
                src={props.item.icon}
                alt="Logo"
                sx={{
                    width: '60px',
                    height: '30px',
                    objectFit: 'contain',
                }}
            /> : <Typography sx={{ fontSize: '11px' }}>
                {props.item.button}
            </Typography>}
            <ChevronLeft />
        </Box>
    </Button>;
}

export const DonatorsSection = () => {
    const { t } = useTranslation();
    const [donates, setDonates] = React.useState<Array<MkDonate> | null>(null);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const loadingRef = React.useRef(false);

    const reload = async () => {
        loadingRef.current = true;
        setIsLoading(true);
        try {
            const result = await MkDonateServices.getDonates();
            if (result.status && result.result) {
                setDonates(result.result);
            }
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    }

    const calculateAmount = (v: MkDonate): string => {
        if (v.amount) {
            if (v.amount >= 1_000_000)
                return `${Math.floor(v.amount / 100_000) / 10} ${t('app.spiritual_support.contributers.unit_1M')}`
            else
                return `${Math.floor(v.amount / 1000)} ${t('app.spiritual_support.contributers.unit_1k')}`
        } else if (v.message) {
            return v.message;
        } else {
            return t('app.spiritual_support.contributers.other') ?? '';
        }
    }

    React.useEffect(() => {
        reload();
    }, []);

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            width: '100%',
        }}
    >
        <Typography
            variant='h6'
            sx={{
                textAlign: 'center',
            }}
        >
            {t('app.spiritual_support.contributers.title')}
        </Typography>
        <Typography
            sx={{
                textAlign: 'justify',
            }}
        >
            {t('app.spiritual_support.contributers.description')}
        </Typography>
        {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', p: '50px 0px' }}>
            <CircularProgress sx={{ alignSelf: 'center' }} id="busy" />
        </Box>}
        {!isLoading && donates && <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                gap: '4px',
            }}
        >
            {donates.length == 0 && <Box>
                <Typography sx={{ opacity: 0.6 }}>
                    {t('app.spiritual_support.contributers.empty')}
                </Typography>
            </Box>}
            {donates.map((v: MkDonate) => (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '10px',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '10px 30px',
                    }}
                >
                    <Typography>{v.name ?? t('app.spiritual_support.contributers.ananymous')}</Typography>
                    <Typography>{calculateAmount(v)}</Typography>
                </Box>
            ))}
        </Box>}
    </Box>;
}

const DonatePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [submitDonateDialog, setSubmitDonateDialog] = React.useState<boolean>(false);
    const [currentMethod, setCurrentMethod] = React.useState<DonateMethods | null>(null);

    const donationMethods: DonateMethods[] = [
        {
            title: t('donation_methods.daramet.title'),
            description: t('donation_methods.daramet.description'),
            button: t('donation_methods.daramet.button'),
            account_owner: null,
            address: "https://daramet.com/meikade",
            shareUrl: null,
            url: null,
            icon: "/assets/images/donate/daramet.svg",
        },
        {
            title: t('donation_methods.donito.title'),
            description: t('donation_methods.donito.description'),
            button: t('donation_methods.donito.button'),
            account_owner: null,
            address: "https://donito.me/meikade",
            shareUrl: null,
            url: null,
            icon: darkMode ? "/assets/images/donate/donito-dark.png" : "/assets/images/donate/donito-light.png",
        },
        {
            title: t('donation_methods.bitcoin.title'),
            description: t('donation_methods.bitcoin.description'),
            button: t('donation_methods.bitcoin.copy_address'),
            account_owner: null,
            address: "bc1qleymp7lgr2kcnnfrz8xnf63u4aj84puj8la27r",
            url: null,
            shareUrl: null,
            icon: null,
        },
        {
            title: t('donation_methods.ethereum.title'),
            description: t('donation_methods.ethereum.description'),
            button: t('donation_methods.ethereum.copy_address'),
            account_owner: null,
            address: "0x5f20c96A55863AC6d1B40Ab072c4eD6F1A105bb0",
            url: null,
            shareUrl: null,
            icon: null,
        },
        {
            title: t('donation_methods.card_transfer.title'),
            description: t('donation_methods.card_transfer.description'),
            button: t('donation_methods.card_transfer.button'),
            account_owner: t('donation_methods.card_transfer.account_owner'),
            address: "5054-1610-1433-8812",
            url: null,
            shareUrl: null,
            icon: null,
        },
    ];

    const sectionStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        gap: '15px',
        width: '100%',
        background: theme.palette.background.paper,
        borderRadius: globalBorderRadius,
    };

    const copyAddress = async (address: string) => {
        try {
            await navigator.clipboard.writeText(address);
            globalShowInfoMessage(t('messages.info.copied'));
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return <Container maxWidth="sm" >
        <MeikadeAppBar
            enableBackButton
        />
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
                <Typography
                    variant='h6'
                    sx={{
                        textAlign: 'center',
                    }}
                >
                    {t('app.support.title')}
                </Typography>
                <Typography
                    sx={{
                        textAlign: 'justify',
                    }}
                >
                    {t('app.support.description')}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        gap: '4px',
                    }}
                >
                    {donationMethods.map((v: DonateMethods) => (
                        <DonateMethodComponent item={v} onMethodRequest={setCurrentMethod} />
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
                    {t('app.spiritual_support.share.title')}
                </Typography>
                <Typography
                    sx={{
                        textAlign: 'justify',
                    }}
                >
                    {t('app.spiritual_support.share.description')}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        gap: '4px',
                    }}
                >
                    <DonateMethodComponent
                        item={{
                            title: t('app.spiritual_support.share.button'),
                            description: t('app.spiritual_support.share.description'),
                            button: "",
                            account_owner: null,
                            address: null,
                            shareUrl: window.location.origin,
                            url: null,
                            icon: null,
                        }}
                        onMethodRequest={setCurrentMethod}
                    />
                </Box>
            </Box>

            <Box sx={sectionStyle} >
                <Typography
                    variant='h6'
                    sx={{
                        textAlign: 'center',
                    }}
                >
                    {t('app.spiritual_support.contribute.title')}
                </Typography>
                <Typography
                    sx={{
                        textAlign: 'justify',
                    }}
                >
                    {t('app.spiritual_support.contribute.description')}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        gap: '4px',
                    }}
                >
                    <DonateMethodComponent
                        item={{
                            title: t('app.spiritual_support.contribute.button'),
                            description: "",
                            button: "",
                            account_owner: null,
                            address: null,
                            shareUrl: null,
                            url: "https://github.com/Aseman-Land/meikade-web",
                            icon: null,
                        }}
                        onMethodRequest={setCurrentMethod}
                    />
                </Box>
            </Box>

            <Box sx={sectionStyle} >
                <DonatorsSection />
            </Box>
        </Box>
        <MeikadeDrawer
            open={submitDonateDialog}
            onClose={() => setSubmitDonateDialog(false)}
            title={t('app.spiritual_support.submit_donate.title')!}
            anchor='bottom'
        >
            <SubmitDonateDialog
                onDonateSubmited={() => setSubmitDonateDialog(false)}
            />
        </MeikadeDrawer>
        <MeikadeDrawer
            open={currentMethod ? true : false}
            onClose={() => setCurrentMethod(null)}
            title={currentMethod ? currentMethod.title : ''}
            anchor='bottom'
        >
            {currentMethod &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '0px 16px',
                        gap: '10px',
                    }}
                >
                    <Typography>{currentMethod.description}</Typography>
                    {currentMethod.address && <Button
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            padding: '10px',
                            background: alpha(theme.palette.text.primary, 0.06),
                            borderRadius: `${globalBorderRadiusValue / 2}px`,
                            color: 'unset',
                            gap: '6px',
                        }}
                        onClick={() => {
                            if (!currentMethod.address)
                                return;
                            if (currentMethod.address.substring(0, 8) == 'https://')
                                window.open(currentMethod.address, '_blank', 'noopener,noreferrer');
                            else
                                copyAddress(currentMethod.address ?? '')
                        }}
                    >
                        <Typography sx={{ fontFamily: 'monospace' }}>
                            {currentMethod.address.substring(0, 8) == 'https://' ? currentMethod.address.substring(8) : currentMethod.address.length < 20 ? currentMethod.address : currentMethod.address.substr(0, 8) + ' ... ' + currentMethod.address.substr(currentMethod.address.length - 8)}
                        </Typography>
                        {currentMethod.address.substring(0, 8) == 'https://' ?
                            <>
                                <ChevronRight />
                                <Typography>
                                    {t('app.spiritual_support.submit_donate.click')}
                                </Typography>
                            </>
                            :
                            <CopyAllOutlined />
                        }
                    </Button>}
                    {currentMethod.account_owner && <Typography>{currentMethod.account_owner}</Typography>}
                    {currentMethod.address && <Box
                        sx={{
                            alignSelf: 'center',
                            margin: '20px 0px',
                        }}
                    >
                        <QRCode
                            value={currentMethod.address}
                            size={100}
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                            level="L"
                        />
                    </Box>}
                    <Typography>
                        {t('app.spiritual_support.submit_donate.submit-info')}
                    </Typography>
                    <Button
                        variant='contained'
                        disableElevation
                        onClick={() => setSubmitDonateDialog(true)}
                    >
                        <Typography>
                            {t('app.spiritual_support.submit_donate.title')}
                        </Typography>
                    </Button>
                </Box>
            }
        </MeikadeDrawer>
    </Container>
}

export default DonatePage;