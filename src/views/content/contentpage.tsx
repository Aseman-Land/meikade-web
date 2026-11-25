import { Box, CircularProgress, Container } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import MeikadeAppBar from '../../components/meikadeappbar';
import MeikadeDialog from "../../components/meikadedialog";
import MeikadeDrawer from "../../components/meikadedrawer";
import { MkFullContent } from '../../models/content';
import { MkActivityServices } from '../../services/activity';
import { MkContentServices } from '../../services/content';
import CommentPage from '../comment/commentpage';
import ContentLists from '../lists/contentlists';
import ContentNoteEdit from '../notes/contentnoteedit';
import PoemContent, { PoemContentRef } from './poemcontent';

export type ContentCorePageProps = {
    content_id?: number,
    author_id?: string,
    book_id?: number,
};

const ContentCorePage = (props: ContentCorePageProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const poemRef = React.useRef<PoemContentRef>(null);

    const [selectedVerseId, setSelectedVerseId] = React.useState<number | undefined>(undefined);
    const [content, setContent] = React.useState<MkFullContent>();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const loadingRef = React.useRef<boolean>(false);

    const [addListDialog, setAddListDialog] = React.useState<boolean>(false);
    const [editNoteDialog, setEditNoteDialog] = React.useState<boolean>(false);

    const checkedIn = React.useRef(false);

    const reload = async () => {
        if (loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);
        try {
            if (!props.content_id) {
                const result = props.author_id ? await MkContentServices.random({ author_id: props.author_id, book_id: null }) : await MkContentServices.random({ author_id: null, book_id: props.book_id ?? null });
                if (result.status && result.result) {
                    setContent(result.result);
                }
            } else {
                const result = await MkContentServices.getContent(props.content_id);
                if (result.status && result.result)
                    setContent(result.result);
            }

        } catch {
        }
        setIsLoading(false);
        loadingRef.current = false;
    }

    const checkIn = async () => {
        if (!content)
            return;
        try {
            const result = await MkActivityServices.checkIn(content.id);
            if (result.status && result.result)
                checkedIn.current = true;
        } catch { }
    }

    React.useEffect(() => {
        reload()
    }, [props.content_id]);

    React.useEffect(() => {
        if (!content)
            return;

        checkIn();
        const intervalId = setInterval(checkIn, 30000);
        return () => clearInterval(intervalId);
    }, [content]);

    React.useEffect(() => {
        if (!props.content_id)
            return;

        const content_id = props.content_id;
        return () => {
            if (!checkedIn.current)
                return;

            MkActivityServices.submit(content_id);
        };
    }, [props.content_id]);

    if (content?.activity?.target_user_achievement)
        return <CommentPage />

    return <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {isLoading && <Container maxWidth="sm" style={{ padding: '0px' }}>
            <MeikadeAppBar
                enableBackButton
            />
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <CircularProgress sx={{ alignSelf: 'center', marginTop: '200px' }} id="busy" />
            </Box>
        </Container>}
        {!isLoading &&
            <PoemContent
                ref={poemRef}
                contentObj={content}
                onAddListsRequest={(verseId: number | undefined) => {
                    setSelectedVerseId(verseId);
                    setAddListDialog(true);
                }}
                onEditNoteRequest={(verseId: number | undefined) => {
                    setSelectedVerseId(verseId);
                    setEditNoteDialog(true);
                }}
            />
        }
        {content && <MeikadeDialog
            open={addListDialog}
            fullWidth
            title={t('content-page.add-list')!}
            onClose={() => {
                if (poemRef.current)
                    poemRef.current.reloadListsStatuses()
                setAddListDialog(false)
            }}
        >
            <ContentLists
                contentId={content.id}
                verseId={selectedVerseId}
            />
        </MeikadeDialog>}
        {content && <MeikadeDrawer
            open={editNoteDialog}
            anchor="bottom"
            title={t('content-page.edit-note')!}
            onClose={() => setEditNoteDialog(false)}
        >
            <ContentNoteEdit
                contentId={content.id}
                verseId={selectedVerseId}
                onSubmited={() => {
                    if (poemRef.current)
                        poemRef.current.reloadNotesStatuses()
                    setEditNoteDialog(false);
                }}
            />
        </MeikadeDrawer>}
    </Box>
}

export const RandomContentPage = () => {
    const params = useParams();
    const user_id = params.user_id;
    const book_id = params.book_id ? parseInt(params.book_id) : undefined;

    return <ContentCorePage author_id={user_id} book_id={book_id} />
}

const ContentPage = () => {
    const params = useParams();
    const content_id = parseInt(params.content_id!);

    return <ContentCorePage content_id={content_id} />
}

export default ContentPage;