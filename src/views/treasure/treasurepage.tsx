
import { Box, Container } from '@mui/material';
import MeikadeAppBar from '../../components/meikadeappbar';
import TreasureLists from './treasurelists';

const TreasurePage = () => {

    return <Container maxWidth="sm">
        <MeikadeAppBar
            enableBackButton
        />
        <Box
            sx={{
                marginTop: '75px',
                paddingBottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}
        >
            <TreasureLists />
        </Box>
    </Container>
}

export default TreasurePage;