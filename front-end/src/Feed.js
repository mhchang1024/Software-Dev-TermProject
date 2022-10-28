import React from 'react';

function Feed() {
  const [result, setResult] = React.useState([]);
  const [isClick, setClicked] = React.useState(false);

  const getList = () => {
    setClicked(true);
    const settings = {
      method: 'Post'
    }
    fetch('/feed', settings)//built in
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setResult(data);
      })
      .catch(e => console.log(e)); //async try/catch
  }
  // make an http call to java


  // Step 2 create a component function that returns an element

  if (isClick) {
    return (
      <div className='feed-div'>
        <div className='list-result'>
          {result.map(m => {
            return (
              // how to render each message one at a time
              <div >
                <br />
                Sender: {m.from}
                <br />
                Receiver: {m.to}
                <br />
                Amount: {m.amount}
                <br />
                Description: {m.description}
                <br />
                type: {m.type}
                <br />
              </div>
            );
          })}
        </div>

      </div>)

  }

  return (
    <div className='feed-div'>
      <h2>Feed</h2>
      <button className="btn btn-big" onClick={getList}>list</button>
    </div>
  );

};

export default Feed; 
