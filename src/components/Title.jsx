import { useContext, useMemo } from "react";
import { ChatContext } from "../context/chatContext";

const Title = () => {
    const [, currentConversation] = useContext(ChatContext);
    const title = useMemo(() => { return currentConversation ? currentConversation.title : "Start a conversation"}, [currentConversation]);

return (<>{title}</>)
}
export default Title;