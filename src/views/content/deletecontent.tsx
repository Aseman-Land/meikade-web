import { BoxProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DeleteItem from '../../components/deleteitem';
import { SimplePoemContent } from '../../components/simplepoemcard';
import { MkContentServices } from '../../services/content';

export type DeleteContentProps = {
    contentItem?: SimplePoemContent,
    onDissmiss?: () => void,
    onSuccessfull?: () => void,
} & BoxProps

const DeleteContent = (props: DeleteContentProps) => {
    const { t } = useTranslation();

    const deleteItem = async (): Promise<boolean> => {
        if (!props.contentItem)
            return false;

        const result = await MkContentServices.deleteContent(props.contentItem.id);
        if (result.status && result.result)
            return true;
        else
            return false
    }

    return <DeleteItem
        onDissmiss={props.onDissmiss}
        onSuccessfull={props.onSuccessfull}
        deleteMethod={deleteItem}
        deleteMessage={t('mainframe.content-menu.delete-message').replaceAll('%1', props.contentItem ? props.contentItem.title : '')}
    />
}

export default DeleteContent;