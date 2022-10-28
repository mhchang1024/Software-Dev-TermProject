import React from "react";

function SignUp() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [success, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSubmit = () => {
    const body = {
      username: username,
      password: password,
    };
    const settings = {
      method: 'post',
      body: JSON.stringify(body),
    };
    fetch('/signup', settings)
      .then(res => res.json())
      .then(data => {
        if (data.isLoggedIn) {
          setError(data.message);
        }
        else {
          setIsSuccess(true);
          setError(data.message);
        }
      })
      .catch(e => console.log(e));
  };

  if (success) {
    return (
      <div className="user-created">
        {error}
        <h3>Welcome {username}</h3>
      </div>
    );
  }

  return (
    <div className='sign-up'>
      <h2>Sign Up here</h2>
        <form onSubmit={e => {e.preventDefault(); handleSubmit()}}>
            <div>Username: <input required value={username} onChange={e => setUsername(e.target.value)} /></div>
            <div>Password: <input required
                type="password"
                pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$" 
                value={password}  title="Minimum 8 characters, at least one letter and one number"
                onChange={e => setPassword(e.target.value)} />
              </div>
            <button type = "submit">Submit</button>
        </form>
      <div>{error}</div>
    </div>
  );
}

export default SignUp;