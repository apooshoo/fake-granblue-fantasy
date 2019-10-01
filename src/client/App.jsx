import React from 'react';
import { hot } from 'react-hot-loader';

import Main from './components/main/main';
import Form from './components/form/form';
import styles from './style.scss';
import ReactPlayer from 'react-player';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: null,
      username: null,
      password: null,
      music: '/music/login.mp3',
    };
  }



  changeUsername(){
    this.setState({username: event.target.value});
  }

  changePassword(){
    this.setState({password: event.target.value});
  }

  // submitLogin(){
  //   console.log('logging in')

  //   let temp;

  //   fetch('/users/login', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       username: this.state.username,
  //       password: this.state.password,
  //     })
  //   }).then(response => response.json())

  submitLogin(){
    var request = new XMLHttpRequest();
    var appThis = this;
    request.addEventListener("load", function(){
      let responseData = JSON.parse( this.responseText );
      console.log( 'resdata::', responseData );
      if (responseData === null){
        console.log('Login failed: no resdata')
      } else {
        console.log('parsed resdata:', responseData)
        console.log('login successful')
        appThis.setState({userId: responseData.id})
      }
    });

    let data = {
        username: this.state.username,
        password: this.state.password
    };
    request.open("POST", '/users/login');
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(data));
  }


  //   // .then(response => this.setState({userId: response.id}))
  // }



  submitRegister(){
    var request = new XMLHttpRequest();
    var appThis = this;
    request.addEventListener("load", function(){
      let responseData = JSON.parse( this.responseText );
      console.log( 'resdata::', responseData );
      if (responseData === null){
        alert('Register failed! Try another username.')
      } else {
        console.log('parsed resdata:', responseData)
        console.log('register successful')
        appThis.setState({userId: responseData.id})
      }
    });

    let data = {
        username: this.state.username,
        password: this.state.password
    };
    request.open("POST", '/users/register');
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(data));


  }

  componentDidUpdate(){
    console.log(this.state)
  }

  changeMusic(trackNo){
    console.log(trackNo)
    switch (trackNo){
        case 0:
        this.setState({music: "/music/login-page.mp3", key: "/music/login-page.mp3"});
        break;
        case 1:
        this.setState({music: "/music/main-theme.mp3", key: "/music/main-theme.mp3"});
        break;
        case 2:
        this.setState({music: "/music/alexiel.mp3", key:"/music/alexiel.mp3"});
        break;
        case 3:
        this.setState({music: "/music/europa.mp3", key: "/music/europa.mp3"});
        break;
        case 4:
        this.setState({music: "/music/grimnir.mp3", key: "/music/grimnir.mp3"});
        break;
        case 5:
        this.setState({music: "/music/yggdrasil.mp3", key: "/music/yggdrasil.mp3"});
        break;
    };
    console.log('setting state', this.state.music)
  }

  componentDidMount(){
    this.changeMusic(0);
  }

  render() {
    if(this.state.userId !== null){
        return (
          <div>
            <nav className="navbar navbar-expand-lg sticky-top d-print navbar-dark bg-dark row" id="navbar">
                    <a className="navbar-brand" href="#"><img src="/dollar.png" width="40" height="40" className="mr-3" alt=""/>Fake Granblue Fantasy</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <a className="nav-link col-3 offset-9 text-white" onClick={()=>{this.setState({userId: null})}}>Logout</a>

            </nav>
            <Main
                changeMusic={(trackNo)=>{this.changeMusic(trackNo)}}
                userId={this.state.userId}
            />
            <ReactPlayer url={this.state.music} key={this.state.music} playing loop/>
          </div>
        );
    } else {
        // this.changeMusic(0)
        return(
            <div>
                <img className={styles.backimg} src="https://images.alphacoders.com/877/thumb-1920-877952.jpg"/>
                <div className="card mx-auto start-card" style={{width: '30%', marginTop: 300}}>
                    <div className="card-body px-4 py-3">
                        <h5 className="card-title font-weight-light text-center">Fake GB Fantasy</h5>
                        <div className="form-group" >
                            <input type="text" className="form-control" style={{width: '50%', display:'inline-block'}} placeholder="Username" onChange={()=>{this.changeUsername()}} value={this.state.username}/>
                            <input type="password" className="form-control" style={{width: '50%', display:'inline-block'}} onChange={()=>{this.changePassword()}} placeholder="Password" value={this.state.password}/>
                        </div>
                        <button className="btn btn-primary w-50" onClick={()=>{this.submitLogin()}}>Log In</button>
                        <button className="btn btn-success w-50" onClick={()=>{this.submitRegister()}}>Register</button>
                    </div>
                    <div className="dropdown-divider"/>
                </div>
                <ReactPlayer url="/music/login-page.mp3" playing loop/>
            </div>
        );
    };

  }
}

export default hot(module)(App);
        // <Form />

 // <Counter message={this.state.message} />