interface Props {
    threadId : string;
    currentUserImg : string;
    currentUserId : string;
}

const Comment = ({
    threadId,
    currentUserImg,
    currentUserId
} : Props) => {
    return(
        <div className="text-white">
            <h1>Comment Form</h1>
        </div>
    )
}

export default Comment