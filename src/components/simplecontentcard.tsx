import { useTranslation } from 'react-i18next';
import SimpleActivityCard from './simpleactivitycard';
import SimplePoemCard, { SimplePoemContent, SimplePoemHighlight } from './simplepoemcard';

type SimpleContentCardProps = {
    contentItem: SimplePoemContent,
    highlight?: SimplePoemHighlight,
    quoteContentVerse?: SimplePoemHighlight,
    contentNote?: string,
    contentVerseNote?: string,
    onReloadRequest: () => void,
};

const SimpleContentCard = (props: SimpleContentCardProps) => {
    const { t } = useTranslation();
    const content = props.contentItem;
    const achievement = content.activity?.target_user_achievement?.achievement;

    if (achievement) {
        return <SimpleActivityCard
            {...props}
        />
    } else {
        return <SimplePoemCard
            {...props}
        />
    }
}

export default SimpleContentCard;
