
import { Box } from '@mui/material';
import { darkMode, theme } from '../utils/theme';


const MeikadeLogo = (props: {width: string, height: string}) => {
    return <Box
        sx={{
            width: props.width,
            height: props.height,
            background: 'url(/assets/images/logo_transparent.png)',
            backgroundSize: darkMode? '' : "cover", 
            backgroundColor: darkMode? theme.palette.text.primary : '',
            mask: darkMode? 'url(/assets/images/logo_transparent.png)' : '',
            maskSize: darkMode? "cover" : '', 
            margin: '5px',
        }}
    />;
}

export default MeikadeLogo;
