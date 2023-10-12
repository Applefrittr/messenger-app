function Comment(props) {
  return (
    <section className="comment-container">
      <img src={props.comment.author.avatar} alt="avatar" />
      <h3>{props.comment.author.username}</h3>
      <p>
        <i>{props.comment.timestamp}</i>
      </p>
      <p>{props.comment.text}</p>
    </section>
  );
}

export default Comment;
