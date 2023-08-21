function Profile(props) {
  console.log(props.user);
  return (
    <section>
      <p>Profile component</p>
      <p>{props.user.username}</p>
    </section>
  );
}

export default Profile;
