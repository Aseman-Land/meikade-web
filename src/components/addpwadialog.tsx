import * as React from 'react';
import Container, { ContainerProps } from '@mui/material/Container';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '../utils/theme';

export type AddPWAPageProps = {
	onDone?: () => void,
} & ContainerProps;

type AddPWAPageStepItem = {
	title: string,
	icon: string,
}

const AddPWAPage = (props: AddPWAPageProps) => {
	const { t } = useTranslation();

	const iosSteps: Array<AddPWAPageStepItem> = [
		{
			title: t('pwa.ios.step_1_title'),
			icon: '/assets/images/ios_share.svg'
		},
		{
			title: t('pwa.ios.step_2_title'),
			icon: '/assets/images/ios_add_home.svg'
		},
		{
			title: t('pwa.ios.step_3_title'),
			icon: '/assets/images/ios_add.svg'
		}
	];

	return <Container
		sx={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		}}
	>
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				maxWidth: '400px',
				alignItems: 'center',
				padding: '50px 20px',
				gap: '30px',
			}}
		>
			<img src="/assets/images/logo_transparent.png" width="64px" height="64px" />
			<Typography sx={{ fontSize: '18px', fontWeight: '700', textAlign: 'center' }}>{t('pwa.title')}</Typography>
			<Typography sx={{ fontSize: '14px', fontWeight: '400', textAlign: 'center' }}>{t('pwa.description')}</Typography>

			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					alignItems: 'center',
					gap: '20px',
				}}
			>
				{iosSteps.map((v: AddPWAPageStepItem, idx: number) => (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							width: '100%',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Typography sx={{ fontSize: '14px', fontWeight: '400' }}>{(idx + 1).toString() + '. ' + v.title}</Typography>
						<img src={v.icon} width="22px" height="28px" />
					</Box>
				))}
			</Box>

			<Button
				fullWidth
				disableElevation
				variant='contained'
				onClick={() => {
					if (props.onDone)
						props.onDone();
				}}
			>
				<Typography>{t('pwa.undrestand')}</Typography>
			</Button>
		</Box>
	</Container>
}

export default AddPWAPage;
