import './App.css';
import { Link, Switch, Route } from 'react-router-dom';
import Home from './Home';
import SignUp from './SignUp';
import Feed from './Feed';

function App() {
  return (
    <div className='back-ground'>
      <div className='main-div'>

        <div class='nav'>
            <div className='nav-bar'><ul>
            <Link class = "links" to="/"><li>Home</li></Link>
            <Link class = "links" to="sign-up"><li>Sign Up</li></Link>
            <Link class = "links"  to="/feed"><li>Feed</li></Link>
          </ul></div>
        </div>

        <div className='home-login'>
          <Switch>
            <Route class = "links" path="/feed" component={Feed} />
            <Route  class = "links" path="/sign-up" component={SignUp} />
            <Route class = "links" path="/"><Home /></Route>
          </Switch>
        </div>

      </div>
    </div>
  );
}

export default App;
