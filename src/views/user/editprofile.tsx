import * as React from 'react';

import { alpha, Box, BoxProps, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import AvatarPoemCard from '../../components/avatarpoemcard';
import { globalHandleError } from '../../layouts/mainframe';
import { Upload } from '../../models/api';
import { MkUserWithBooks } from '../../models/book';
import { MkUserServices } from '../../services/user';
import { theme } from '../../utils/theme';
import { processImage, sleep } from '../../utils/tools';

export type EditProfileProps = {
    userId: number,
    onDone?: () => void,
} & BoxProps;

const EditProfile = (props: EditProfileProps) => {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const loadingRef = React.useRef<boolean>(false);

    const fileInput = React.useRef<HTMLInputElement>(null);

    const [user, setUser] = React.useState<MkUserWithBooks>();
    const [firstname, setFirstname] = React.useState<string>('');
    const [lastname, setLastname] = React.useState<string>('');
    const [username, setUsername] = React.useState<string>('');
    const [about, setAbout] = React.useState<string | null>('');
    const [birthday, setBirthday] = React.useState<Dayjs | null>(null);

    const [avatar, setAvatar] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);

    const reload = async () => {
        if (loadingRef.current)
            return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            const result = await MkUserServices.me();
            await sleep(500);
            if (result)
                setUser(result.result);
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    }

    const save = async () => {
        if (loadingRef.current)
            return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            if (avatar) {
                const cleanBlob = await processImage(avatar, 1024, 1024);
                const avatarUpload: Upload = {
                    file: undefined,
                    blob: {
                        data: cleanBlob,
                        filename: 'avatar.jpg',
                    }
                }

                const result = await MkUserServices.updateMyAvatar(avatarUpload);
                if (!result)
                    throw false;
            }

            const result = await MkUserServices.edit({
                firstname: firstname,
                lastname: lastname,
                about: about,
                birthday: birthday ? birthday.format("YYYY-MM-DD") : null,
                color: null,
                password: null,
                current_password: null,
                home: null,
                agreement: null,
                setup_version: null,
            });
            await sleep(500);
            if (result) {
                if (avatar)
                    window.location.href = window.location.pathname;
                if (props.onDone)
                    props.onDone();
            }
        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    }

    const onAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files)
            return;

        const file: File = event.target.files[0];

        setAvatar(file);
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    React.useEffect(() => {
        if (!user)
            return;

        setFirstname(user.firstname ?? '');
        setLastname(user.lastname ?? '');
        setUsername(user.username);
        setAbout(user.about);
        setBirthday(dayjs(user.birthday));
    }, [user])

    React.useEffect(() => {
        reload();
    }, [props])

    return <Box
        {...props}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center',
            ...props.sx,
        }}
    >
        {isLoading && <CircularProgress sx={{ alignSelf: 'center', margin: '100px 0px' }} id="busy" />}
        {!isLoading && <>
            <input
                type="file"
                ref={fileInput}
                accept={'image/png,image/jpeg'}
                hidden
                onChange={onAvatarChange}
            />
            <AvatarPoemCard
                avatar={imagePreview ? imagePreview : user ? user.avatar : null}
                size={70}
                onAvatarClick={() => {
                    fileInput?.current?.click();
                }}
            />
            <TextField
                variant='outlined'
                fullWidth
                label={t('user.edit.firstname')}
                value={firstname}
                onChange={(v) => setFirstname(v.target.value!)}
            />
            <TextField
                variant='outlined'
                fullWidth
                label={t('user.edit.lastname')}
                value={lastname}
                onChange={(v) => setLastname(v.target.value!)}
            />
            {false && <TextField
                variant='outlined'
                fullWidth
                disabled
                label={t('user.edit.username')}
                value={username}
                slotProps={{
                    htmlInput: {
                        lang: 'en',
                        inputMode: 'latin',
                    },
                }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const inputVal = event.target.value;
                    const englishOnly = inputVal.replace(/[^a-zA-Z\s]/g, '');
                    if (englishOnly != inputVal)
                        globalHandleError(t('errors.keyboard-english'));
                    setUsername(englishOnly.trim())
                }}
            />}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fa-IR">
                <DatePicker
                    label="تاریخ تولد"
                    value={birthday}
                    onChange={(newValue) => setBirthday(newValue)}
                    views={['year', 'month', 'day']}
                    format='YYYY/MM/DD'
                    maxDate={dayjs()}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            variant: 'outlined',
                        },
                    }}
                />
            </LocalizationProvider>
            <TextField
                variant='outlined'
                fullWidth
                multiline
                minRows={5}
                maxRows={5}
                label={t('user.edit.about')}
                value={about}
                onChange={(v) => setAbout(v.target.value!)}
            />
            <Button
                disableElevation
                fullWidth
                sx={{
                    padding: '24px 20px',
                    background: alpha(theme.palette.text.primary, 0.1),
                    color: theme.palette.text.primary,
                }}
                onClick={save}
            >
                <Typography>{t('user.edit.save')}</Typography>
            </Button>
        </>}
    </Box>
}

export default EditProfile;