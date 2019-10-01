import React from 'react';
// import PropTypes from 'prop-types';
import styles from './style.scss';
import Spritesheet from 'react-responsive-spritesheet';
import ArtModal from '../modal/artModal';
import Game from '../game/game';
//modes: main, showAll, archive, game

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
        allCharacters: null,
        usersCharacters: [],
        partyList: [null,null,null],
        setSlot: null,
        mainState: 'main',
        showArtModal: false,
        selectedChar: null,
        displayCharacter: null,
        timer: 10,
        difficulty: 'Easy',
        score: 0
    };
  }

  scoreHit(){
    this.setState({score: this.state.score + 3});
  }

  scoreMiss(){
    this.setState({score: this.state.score - 1});
  }

  resetScore(){
    this.setState({score: 0});
  }



  draw(){
    let userId = this.props.userId;
    let allCharacters = [...this.state.allCharacters];

    let randomIndex = Math.floor(Math.random()*allCharacters.length);
    let randomChar = allCharacters[randomIndex];

    let temp = [...this.state.usersCharacters].filter(char => char.id === randomChar.id)
    if (temp.length > 0){
        console.log('have already', temp)
        return
    } else {
        fetch('/characters/new', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            charId: randomChar.id,
            userId: userId,
          })
        }).then(response => response.json())
        .then(response => console.log(response))
        .then(this.setState({usersCharacters: [...this.state.usersCharacters].concat(randomChar)}))
        .then(this.setDisplayCharacter(randomChar))
        .then(this.showArtModal());
    };


  }



  componentDidMount(){
    let userId = this.props.userId;
    let mainThis = this;

    var requestAll = new XMLHttpRequest();
    requestAll.addEventListener("load", function(){
      let responseData = JSON.parse( this.responseText );
      console.log( 'resdata:', responseData );
      mainThis.setState({allCharacters: responseData});
    });
    requestAll.open("GET", `/characters`);
    requestAll.send();


    var request = new XMLHttpRequest();
    // var mainThis = this;
    request.addEventListener("load", function(){
      let responseData = JSON.parse( this.responseText );
      console.log( 'resdata::', responseData );
      if (responseData === null){
        mainThis.setState({usersCharacters: []});
      } else {
        // ensure partyList is updated on load
        let partyList = [null, null, null];
        responseData.map(char => {
            if (char.slot != null){
                partyList[char.slot-1] = char;
            };
        });
        mainThis.setState({usersCharacters: responseData, partyList: partyList});
      }
    });

    request.open("GET", `/characters/${userId}`);
    request.send();
    // this.setState({requested:true});
  }



  componentDidUpdate(){
    // console.log("State after update:");
    // console.log("allCharacters", this.state.allCharacters);
    // console.log("usersCharacters", this.state.usersCharacters);
    // console.log("partyList", this.state.partyList)
    // console.log("showartmodal:", this.state.showArtModal)
  }

  //on selecting character to put into slot
  //character is from usersCharacters
  setActive(character){
    console.log('setting active');
    console.log('slot to save to:', this.state.setSlot)
    console.log('prev character slot', character.slot);
    //^^^if character.slot != null it means it already is in party

    let userId = this.props.userId;
    let mainThis = this;
    let usersCharacters = [...this.state.usersCharacters];

    //check if target is empty
    let existingInSlot = usersCharacters.filter(char => {
        return char.slot === this.state.setSlot;
    });

    //check index in state of your character
    let stateCharIndex = usersCharacters.findIndex(char => {
        return char.id === character.id;
    });

    //--------------------------------------------------------AJAX REQ TO CHANGE SLOT TO NULL
    let partyList = [...this.state.partyList];
    if (character.slot != null){
        //if character is already in party,find its old position and delete it
        partyList[character.slot-1] = null;
        //make sure the usersCharacters is also updated!
        usersCharacters[stateCharIndex].slot = null;
        //now we may proceed!
        console.log('deleting this characters old position');
        fetch('/characters/editSlot', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            slot: null,
            charId: character.id,
            userId: userId,
          })
        }).then(response => response.json())
        .then(response => console.log("edited to:", response))
        .then(this.setState({partyList: partyList, usersCharacters: usersCharacters}))
        .then(this.setActive(character));

        // this.setState({partyList: partyList, usersCharacters: usersCharacters});
        // this.setActive(character);
    }


    //--------------------------------------------------------AJAX REQ TO CHANGE SLOT TO NULL
    if (existingInSlot.length > 0){
        //there is someone already here! Clear their stats before proceeding!
        let existingId = existingInSlot[0].id;
        let existingIndex = usersCharacters.findIndex(char => {
            return char.id === existingId;
        });
        usersCharacters[existingIndex].slot = null;
        //now we've cleared the slot of the prev occupant, we may proceed!
        console.log('deleting someone else in this slot, restarting')

        fetch('/characters/editSlot', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            slot: null,
            charId: character.id,
            userId: userId,
          })
        }).then(response => response.json())
        .then(response => console.log("edited to:", response))
        .then(this.setState({usersCharacters: usersCharacters}))
        .then(this.setActive(character));

        // this.setState({usersCharacters: usersCharacters});

        // this.setActive(character);
    };

    //--------------------------------------------------------AJAX REQ TO CHANGE SLOT TO SLOT
    //either nobody was here, or there was and you have cleared it. Now save your character in!
    //you will need to add you character to the party list, and also edit the usersCharacters state and DB.
    //Let's test the states without DB for now.
    console.log('adding to slot now!')
    // let stateCharId = usersCharacters.findIndex(char => {
    //     return char.id === character.id;
    // });
    usersCharacters[stateCharIndex].slot = this.state.setSlot;
    //prepared to save state usersCharacters
    partyList[this.state.setSlot-1] = usersCharacters[stateCharIndex];
    //prepared to save party list

    fetch('/characters/editSlot', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slot: this.state.setSlot,
        charId: character.id,
        userId: userId,
      })
    }).then(response => response.json())
    .then(response => console.log("edited to:", response))
    .then(this.setState({
        usersCharacters: usersCharacters,
        partyList: partyList
    }))
    .then(this.mainMode());

    // //now redirect back! dont worry about resetting setSlot, mainMode() will do it for you.
    // this.mainMode();
  }

  //on click on party thumbnail, saves slot being clicked on
  showAllMode(index, char){
    console.log('changing to showall mode');
    let slot = index + 1;
    this.setState({selectedChar: char, mainState: 'showAll', setSlot: slot});
  }

  mainMode(){
    console.log('changing to main mode');
    this.setState({mainState: 'main', setSlot: null, selectedChar: null});
  }

  archiveMode(){
    console.log('entering archiveMode');
    this.setState({mainState: 'archive'});
  }


  showArtModal(){
    console.log('showing art modal');
    this.setState({showArtModal: true});
  }

  hideArtModal(){
    console.log('hiding art modal');
    //also removes displayCharacter
    this.setState({showArtModal: false, displayCharacter: null});
  }

  setDisplayCharacter(character){
    console.log('setting display character');
    this.setState({displayCharacter: character});
  }

  setAndShowArt(character){
    this.setDisplayCharacter(character);
    this.showArtModal();
  }

  gameMode(){
    console.log('entering game mode!');
    this.setState({mainState: 'game'})
  }

  changeDifficulty(){
    console.log('changing difficulty');
    this.setState({difficulty: event.target.value});
  }

  changeTimer(){
    console.log('changing difficulty');
    this.setState({timer: parseInt(event.target.value)});
  }

  countdown(){
    console.log('counting down')
    console.log(this.state.timer)
    this.setState({timer: this.state.timer -1})
  }

  resetTimer(){
    this.setState({timer: 10});
  }

  render() {
    let allCharacters = this.state.allCharacters;
    let usersCharacters = this.state.usersCharacters;
    let charactersList;
    if (usersCharacters != null){
        charactersList = usersCharacters.map((character, index) => {
            return(
                <div key={index} className={styles.listItem}>
                    <p>{character.name}</p>
                    <Spritesheet
                        className={styles.sprite}
                        style={{width:100, height:100}}
                        image={character.spritesheet}
                        widthFrame={260}
                        heightFrame={260}
                        steps={6}
                        fps={12}
                        startAt={1}
                        endAt={6}
                        loop={true}
                        onClick={()=>{this.setActive(character)}}
                      />
                </div>
            )
        });
    }
    let archiveList;
    if (allCharacters != null){
        archiveList = allCharacters.map((character, index) => {
            return(
                <div className={styles.listItem} key={index} onClick={()=>{this.setAndShowArt(character)}}>
                    <img className={styles.partyThumbnail} src={character.home_thumbnail}/>
                </div>
            )
        });
    }


    let partyList = [...this.state.partyList].map((char, index) => {
        if(char === null){
            return (
                <div className={styles.listItem} key={index} onClick={()=>this.showAllMode(index, char)}>
                    <img className={styles.partyThumbnail} src="./main/empty.png"/>
                </div>
            )
        } else {
            return (
                <div className={styles.listItem} key={index} onClick={()=>this.showAllMode(index, char)}>
                    <img className={styles.partyThumbnail} src={char.home_thumbnail}/>
                </div>
            )
        }
    });

    let showAllList = [...this.state.usersCharacters].map((char, index)=>{
        return(
            <div className={styles.listItem} key={index} onClick={()=>this.setActive(char)}>
                <img className={styles.partyMiniThumbnail} src={char.home_thumbnail}/>
            </div>
        );
    });









//MAIN RETURN
    if(allCharacters === null){
        return <p>LOADING...</p>
    } else if (this.state.mainState === 'main'){
        return (
            <React.Fragment>
            <div className={styles.background}>
                <ArtModal
                    showArtModal={this.state.showArtModal}
                    hideArtModal={()=>{this.hideArtModal()}}
                    displayCharacter={this.state.displayCharacter}
                />
                <div className={styles.leftColumn}>
                    <div className={styles.partyWrapper}>
                        {partyList}
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    <ul>
                        <li>Click the DRAW button to get characters</li>
                        <li>Press PLAY once you have a party of three!</li>
                        <li>Click on characters to swap slots</li>
                    </ul>



                    <button className={styles.drawbtn} style={{backgroundImage: "url('./main/draw-scrubbed.png')"}} onClick={()=>{this.draw()}}>
                    DRAW
                    </button>

                    <button className={styles.drawbtn} style={{backgroundImage: "url('./main/draw-scrubbed.png')"}} onClick={()=>{this.archiveMode()}}>
                    ARCHIVE
                    </button>

                    <div>
                        <button className={styles.drawbtn} style={{backgroundImage: "url('./main/draw-scrubbed.png')"}} onClick={()=>{this.gameMode()}}>
                        PLAY
                        </button>

                        <select className="form-control" style={{width: '31%'}} value={this.state.difficulty} onChange={()=>{this.changeDifficulty()}}>
                            <option value="Easy">Easy</option>
                            <option value="Hard">Hard</option>
                            <option value="Lethal">Lethal</option>
                        </select>
                        <select className="form-control" style={{width: '31%'}} value={this.state.timer} onChange={()=>{this.changeTimer()}}>
                            <option value={10}>10s</option>
                            <option value={20}>20s</option>
                        </select>
                    </div>



                    </div>
                </div>
            </React.Fragment>
        );
    } else if (this.state.mainState === 'showAll'){
        let selectedChar = () => {
            console.log(this.state.selectedChar)
            if(this.state.selectedChar === null){
                return <img className={styles.partyThumbnail} src="./main/empty.png"/>
            } else {
                return <img className={styles.partyThumbnail} src={this.state.selectedChar.home_thumbnail}/>
            };
        };


        return (
            <React.Fragment>
                <div className={styles.background}>
                <button className={styles.drawbtn} style={{backgroundImage: "url('./main/draw-scrubbed.png')", float:'right'}} onClick={()=>{this.mainMode()}}>HOME</button>
                <div className={styles.leftColumn} style={{width: '100%', paddingTop: '0'}}>
                    <p style={{textAlign: 'center', fontWeight: 'bold'}}>Click on a character to insert!</p>
                    <div className={styles.partyThumbnailWrapper}>
                        <div className={styles.selectedItem} onClick={()=>{this.mainMode()}}>
                            {selectedChar()}
                        </div>
                        <div className={styles.showAllWrapper}>
                            {showAllList}
                        </div>
                    </div>
                </div>

                </div>

            </React.Fragment>
        );
    } else if (this.state.mainState === 'archive'){
        return (
            <React.Fragment>
                <button className={styles.drawbtn} style={{backgroundImage: "url('./main/draw-scrubbed.png')", float: 'right'}} onClick={()=>{this.mainMode()}}>HOME</button>
                <ArtModal
                    showArtModal={this.state.showArtModal}
                    hideArtModal={()=>{this.hideArtModal()}}
                    displayCharacter={this.state.displayCharacter}
                />

                <div className={styles.leftColumn} style={{width: '100%', paddingTop: '0', margin: '0 auto'}}>
                    <p style={{textAlign: 'center', fontWeight: 'bold'}}>Click on a character to view details!</p>
                    <div className={styles.partyThumbnailWrapper}>
                        {archiveList}
                    </div>
                </div>



            </React.Fragment>
        );
    } else if (this.state.mainState === 'game'){
        return(
            <div className={styles.background}>
            <Game
                mainMode={()=>{this.mainMode()}}
                countdown={()=>{this.countdown()}}
                resetTimer={()=>{this.resetTimer()}}
                mainState={this.state.mainState}
                partyList={this.state.partyList}
                timer={this.state.timer}
                difficulty={this.state.difficulty}
                allCharacters={this.state.allCharacters}
                score={this.state.score}
                scoreHit={()=>{this.scoreHit()}}
                scoreMiss={()=>{this.scoreMiss()}}
                resetScore={()=>{this.resetScore()}}
            />
            </div>
        );
    }




  }
  //end render
}

// Counter.propTypes = {
//   message: PropTypes.string.isRequired,
// };

export default Main