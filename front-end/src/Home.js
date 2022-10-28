import './App.css';
import React from 'react';

function Home() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [error, setError] = React.useState(null);


  const [user2, setUser2] = React.useState('');
  const [amount, setAmount] = React.useState(null);
  const [type, setType] = React.useState(null);
  const [message, setMessage] = React.useState(null);
  const [payment, setPayment] = React.useState('');
  const handleSubmit = () => {
    const body = {
      username: username,
      password: password,
    };
    const settings = {
      method: 'post',
      body: JSON.stringify(body),
    };
    fetch('/logIn', settings)
      .then(res => res.json())
      .then(data => {
        if (data.isLoggedIn) {
          setIsLoggedIn(true);
        } else if (!data.isLoggedIn) {
          setError(data.message);
          console.log(data.message)
        }
      })
      .catch(e => console.log(e));
      

  }; 
    const handlePayment = () => {
      console.log(username, 'has sent money !');
      console.log(user2,'has recieved money !');
      console.log(amount, 'amount has been sent !');
      console.log('message from :', username, message);
      const body = {
        to: user2,
        from: username,
        amount: amount,
        type: type,
        description: message
      };
      // make an http call to java
      const settings = {
          method: 'POST',
          body: JSON.stringify(body),
      }
      fetch('/makePayment', settings)//built in
      .then(res => res.json())
      .then(data => {
         console.log(data)

         setPayment(data); // what spark responds
      })
      .catch(e => console.log(e));
      
  
    };
  
  if(isLoggedIn){

    // Need to implement for payment here 
    if(!payment.isPaymentMade){
      if (payment.message === "Payment Unsuccessful, Sender is not a user!!" 
          || payment.message === "Payment Unsuccessful, Receiver is not a user!!" 
          ||payment.message === "Payment Unsuccessful"
          ||payment.message === "Payment Unsuccessful: A field was left empty"){

          return(
                    
              <div className = "feed">
                  <div>
                      <h1 className="form-title">Transaction Feed</h1>
                  </div>
                  <div>{payment.message}  </div>
              </div>
              
          );
      }
      return(
        <div className='formBoxes'>
        <div>
            <h1 className="form-title">Home</h1>
            <form onSubmit={e => {e.preventDefault(); handlePayment()}}>
            <div>
                <label >Sender: </label>
                <input  required type="username"  name="username" placeholder="Enter Sender"className="text-input"
                value = {username} 
                onChange = {e => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label>Receiver: </label>
                <input required type="username"  name="username" placeholder="Enter Receiver" className="text-input"    
                value= {user2}
                onChange = {e => setUser2(e.target.value)}
                />
            </div>
            <div>
                <label>Amount: </label>
                <input 
                required
                type="number"
                value= {amount}
                onChange = {e => setAmount(e.target.value)} 
                />
            </div>
            <div>
                <label>Type: </label>
                <input required  type="type"  name="type" placeholder="Enter type of Payment" className="text-input"  
                value= {type}
                onChange = {e => setType(e.target.value)} 
                />
            </div>
            <div>
                <label>Notes: </label>
                <textarea required  type="text"  name="text" placeholder="Add message" className="text-input"  
                onChange={e => setMessage(e.target.value)}></textarea>  
            </div>
            
            
            <div>
                <button type="submit"  className="btn-big" >Send Amount</button>
            </div>
           </form>
          </div>
            
        </div>
        
    );
  }else if(payment.isPaymentMade){
    return(
        
      <div className = "feed">
          <div>
              <h1 className="form-title">Transaction Feed</h1>
          </div>
          <div>{username} has sent money!</div>
          <div>{user2} has recieved money!</div>
          <div>{amount} has been sent!</div>
          <div>{username} sent money using {type}!</div>
          <div> message from {username}, {message}</div>
      </div>
      
  );
  }
  
     
  }else if (!isLoggedIn){
     return (
    <div className='formBoxes'>
      <h2>Log in</h2>
      <div>Username: <input value={username} onChange={e => setUsername(e.target.value)} /></div>
      <div>Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
      <button onClick={handleSubmit}>Submit</button>
      <div>{error}</div>
      
    </div>
  );
  }
 
  }
  // =======================================================


  

export default Home;