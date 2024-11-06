import { Alert, AppBar, Box, Snackbar, Toolbar, Typography } from "@mui/material";
import Container, { ContainerProps } from "@mui/material/Container";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { useTheme } from '@mui/material/styles';

export type HomeTemplateProps = ContainerProps & {
    children?: React.ReactNode;
    title?: string|null|undefined,
    loading?: boolean;
    error?: string|undefined|null;
    backgroundTopMargin?: string|number;
}

var lastHeight_cache: string|number = '10px';

const HomeTemplate: React.FC<HomeTemplateProps> = (props: HomeTemplateProps) => {
    const { t } = useTranslation();
    const [hasError, setError] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [lastHeight, setLastHeight] = React.useState<string|number>(lastHeight_cache);
    const theme = useTheme();

    React.useEffect(() => {
        if (props.loading != undefined)
            setIsLoading(props.loading);
        else
            setIsLoading(false);

        if (props.error != undefined)
            setError(props.error);
        else
            setError("");

        loadHeight();
    }, [props]);

    const loadHeight = () => {
        setTimeout(() => {
            lastHeight_cache = props.backgroundTopMargin ?? '0px';
            setLastHeight(lastHeight_cache);
        }, 10);
    }

    return (
        <Container 
            component="main" 
            maxWidth="xl" 
            sx={{  
                maxWidth: "none",
                display: 'flex', 
                alignItems: 'center', 
                flexDirection: 'column',
                paddingLeft: '0px',
                paddingRight: '0px',
            }}
        >
            <AppBar sx={{position: 'fixed', boxShadow: 'unset'}} >
                <Toolbar sx={{gap: '10px', background: '#fff'}}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#333' }}>
                        Meikadeسسی
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{marginTop: '100px'}}>
                {props.children}
            </Box>
            <Snackbar open={hasError.length? true : false} autoHideDuration={3000} onClose={function(){ setError(''); }}>
                <Alert severity="error" sx={{ width: '100%' }}>
                    {props.error}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default HomeTemplate;
