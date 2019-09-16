import React from 'react';
import Spritesheet from 'react-responsive-spritesheet';
import styled, {keyframes} from 'styled-components';
import styles from './style.scss';
import Enemies from './enemies';

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
        charactersToGenerate: [],
        characterPortraitsToGenerate: [],
        enemies: [],
        laneCoords: [],
        keepCheckingEnemyPassed: null,
        keepCountingDown: null,
        keepGeneratingEnemies: null,
        score: 0
    }
  }

  mainMode(){
    this.props.mainMode();
  }

  generateCharacterPortraits(coordsArr){
    let generateCharacterPortraits = [...this.props.partyList].map((char, index) => {
        let laneCoords = coordsArr[index];
        const shake = keyframes`
            0%  {transform: translate(10px)}
            33% {transform: translate(0px)}
            66% {transform: translate(-10px)}
            100%{transform: translate(0px)}
        `;
        const Portrait = styled.div`
            position: absolute;
            top: ${laneCoords.top}px;
            left: ${laneCoords.right-100}px;
            width: 100px;
            height: 100px;
            background: url('${char.battle_thumbnail}') top center;
            background-size: cover;
            animation: ${shake} .1s linear;
          }
        `
        let characterPortrait = <Portrait key={index} onClick={(event)=>{
            const target = event.target;
            console.log(target.style)
            target.style.animation = 'none';
            setTimeout(function() {
                target.style.animation = '';
            }, 10);
        }}/>
        return characterPortrait;
    });
    this.setState({characterPortraitsToGenerate: generateCharacterPortraits});
  }

   // transition: transform 200ms ease-in-out;

   //        &:active {
   //          transform: rotate(20deg);

  generateCharacterSprites(coordsArr){
    // console.log('generating char sprite')
    let generateCharacterSprites = [...this.props.partyList].map((char, index) => {
        let laneCoords = coordsArr[index];
        // console.log(`lane coords of ${index+1}`, laneCoords)
            const attack = keyframes`
                0%  {background-position-x: 0px}
                100%{background-position-x: -600px;}
            `;
            const Character = styled.div`
                position: absolute;
                width: 100px;
                height: 100px;
                top: ${laneCoords.top}px;
                left: ${laneCoords.right-200}px;
                background: url('${char.spritesheet}') right center;
                background-size: cover;
                animation: ${attack} .3s steps(6);
            `;
        let character = <Character key={index} onClick={(event)=>{
            const target = event.target;
            target.style.animation = 'none';
            setTimeout(function() {
                target.style.animation = '';
            }, 10);
        }}/>
        // console.log("char to generate", character)
        return character
    });
    // console.log('generateCharacterSprites:', generateCharacterSprites)
    this.setState({charactersToGenerate: generateCharacterSprites})
  }


  generateEnemy(){
    let randomLaneIndex = Math.floor(Math.random()*this.state.laneCoords.length)
    let randomLaneCoords = this.state.laneCoords[randomLaneIndex]
    let randomEnemyIndex = Math.floor(Math.random()*this.props.allCharacters.length)

    // console.log('targeting lane:', randomLaneIndex+1);
    // console.log('lane coords:', randomLaneCoords)
    let {top, left, height, right, ...others} = randomLaneCoords;

    const moveRight = keyframes`
        from {transform: translate(${left}px);}
        to {transform: translate(${right-130}px);}
    `;

    let difficulty;
    if(this.props.difficulty === 'Easy'){
        difficulty = 3;
    } else if (this.props.difficulty === 'Hard'){
        difficulty = 2;
    } else if (this.props.difficulty === 'Lethal'){
        difficulty = 1.5;
    };

    let Enemy = styled.div`
        position: absolute;
        top: ${top}px;
        left: ${left}px;
        height: ${height}px;
        width: 100px;
        animation: ${moveRight} ${difficulty}s linear infinite;
    `;

    let enemy = <Enemy>
                    <Spritesheet style={{width:100, height:100,}} image={this.props.allCharacters[randomEnemyIndex].reverse_spritesheet} widthFrame={260} heightFrame={260} steps={6} fps={12} startAt={1} endAt={6} loop={true}/>
                </Enemy>
    // console.log('generating enemy:', enemy);
    // this.setState({
    //     enemies: [...this.state.enemies].concat(enemy),
    // })
    this.setState((state)=>{
        return {enemies: state.enemies.concat(enemy)}
    });

  }

  clickToGenerateEnemy(){
    let generateEnemyBtn = document.getElementById('generateEnemyBtn');
    let simulateClick = () => {
        console.log('simulating click')
        let click = new MouseEvent('click', {
            bubbles:true,
            cancelable:false,
            view:window
        });
        let clicking = !generateEnemyBtn.dispatchEvent(click);
    }
    simulateClick();
  }

  characterAttack(charIndex){
    console.log('making char attack!');
    // console.log('index of char to animate', charIndex);
    let characters = document.getElementById('characters').children
    let characterToAnimate = characters[charIndex];
    // console.log("char to animate", characterToAnimate)
    let simulateClick = () => {
        console.log('simulating click')
        let click = new MouseEvent('click', {
            bubbles:true,
            cancelable:false,
            view:window
        });
        let clicking = !characterToAnimate.dispatchEvent(click);
    }
    simulateClick();

  }

  uniKeyCode(event) {
    event.stopImmediatePropagation();
    let enemies = Array.from(document.getElementById('enemies').children)
    // console.log(this.state.laneCoords)
    // console.log(enemies[0].getBoundingClientRect())
    let range = {
        upper: null,
        lower: null
    }

    var key = event.keyCode;
    if (key === 81){
        console.log('pressed q');
        this.characterAttack(0);
        range = {
                upper: 127,
                lower: 0
            };
    } else if (key === 87){
        console.log('pressed w');
        this.characterAttack(1);
        range = {
                upper: 237,
                lower: 128
            };
    } else if (key === 69){
        console.log('pressed e');
        this.characterAttack(2);
        range = {
                upper: 360,
                lower: 248
            };
    } else {
        return
    };

    let upper = range.upper;
    let lower = range.lower;

    let filteredEnemiesByY;
    let sortedEnemiesByX;
    if(enemies != undefined){
        filteredEnemiesByY = enemies.filter(enemy => {
            return (enemy.getBoundingClientRect().y >= lower && enemy.getBoundingClientRect().y < upper);
        });

        if(filteredEnemiesByY != undefined){
            sortedEnemiesByX = filteredEnemiesByY.sort((a,b) => {
                return b.getBoundingClientRect().x - a.getBoundingClientRect().x
            });
        };

        let hitboxStart = [...this.state.laneCoords][0].right-300;
        let hitboxEnd = [...this.state.laneCoords][0].right-200;
        // console.log(hitboxStart)

        let attackTarget = sortedEnemiesByX[0];
        let attackTargetPositionX = attackTarget.getBoundingClientRect().x;
        if(attackTargetPositionX >= hitboxStart && attackTargetPositionX < hitboxEnd){
            console.log('bullseye!!')
            attackTarget.style = 'display: none';
            // this.setState({score: this.state.score + 3});
            this.setState((state)=>{
                return {score: state.score + 3}
            })
            // console.log(attackTarget)
        } else {
            // this.setState({score: this.state.score - 1});
            this.setState((state)=>{
                return {score: state.score - 1}
            })
            console.log('miss!')
        };

    } else {
        return;
    }
    // console.log("filteredEnemiesByY", filteredEnemiesByY)
    // sortedEnemiesByX.map(enemy=> {console.log(enemy.getBoundingClientRect())})
    //compare vs X, left's 300 is 100 self-width offset and 200 character offset
  }

  checkEnemyPassed(){
    let enemies = Array.from(document.getElementById('enemies').children)


    if (enemies !== undefined || enemies.length > 0){
        // console.log("THIS", this.state.laneCoords)
        let range0 = {upper: 127, lower: 0};
        let range1 = {upper: 237, lower: 128};
        let range2 = {upper: 360, lower: 238};

        let filteredEnemiesByX;
        let enemyGoalStart = this.state.laneCoords[0].right-200;

        filteredEnemiesByX = enemies.filter(enemy => {
            return enemy.getBoundingClientRect().x > enemyGoalStart;
        });
        // console.log("filteredEnemiesByX", filteredEnemiesByX)


        if(filteredEnemiesByX.length > 0){
            let enemyPassed = filteredEnemiesByX[0];
            let enemyLaneCoords = enemyPassed.getBoundingClientRect().y;
            // console.log("enemy that passed:", enemyPassed)
            // console.log(enemyLaneCoords);

            let laneIndex;
            if(enemyLaneCoords > 0 && enemyLaneCoords < 127){
                laneIndex = 0;
            } else if (enemyLaneCoords > 128 && enemyLaneCoords < 237){
                laneIndex = 1;
            } else if (enemyLaneCoords > 238 && enemyLaneCoords < 360){
                laneIndex = 2;
            };

            enemyPassed.style = 'display: none';
            console.log("enemy passed in lane", laneIndex+1);
            this.setState((state)=>{
                return {score: state.score - 1}
            })

            let characterPortraitToClick = document.getElementById('characterPortraits').children[laneIndex]
            // console.log(characterPortraitToClick)

            let simulateClick = () => {
                console.log('simulating click')
                let click = new MouseEvent('click', {
                    bubbles:true,
                    cancelable:false,
                    view:window
                });
                let clicking = !characterPortraitToClick.dispatchEvent(click);
            }
            simulateClick();

        };
    } else {
        return;
    };

  }

  countdown(){
    this.props.countdown();
  }

  componentDidMount(){
    // this.setState({timer: this.props.timer})
    let lanesArr = document.querySelectorAll('.lane')
    let coordsArr = [];
    [...lanesArr].map(lane => {
        let coords = lane.getBoundingClientRect();
        coordsArr.push(coords)
    })

    this.generateCharacterSprites(coordsArr);
    this.generateCharacterPortraits(coordsArr);
    this.setState({laneCoords: coordsArr});

    var keepCountingDown = setInterval(()=>this.countdown(), 1000);
    this.setState({keepCountingDown: keepCountingDown});

    let interval;
    if(this.props.difficulty === 'Easy'){
        interval = 1000;
    } else if (this.props.difficulty === 'Hard'){
        interval = 500;
    } else if (this.props.difficulty === 'Lethal'){
        interval = 250;
    };
    var keepGeneratingEnemies = setInterval(()=>this.clickToGenerateEnemy(), interval);
    this.setState({keepGeneratingEnemies: keepGeneratingEnemies});

    var keepCheckingEnemyPassed = setInterval(()=>this.checkEnemyPassed(), 100);
    this.setState({keepCheckingEnemyPassed: keepCheckingEnemyPassed});
  }

  componentDidUpdate(){
    // console.log("state in enemies:", this.state);
    if(this.props.timer <= 0){
        clearInterval(this.state.keepCountingDown);
        this.props.resetTimer();
        clearInterval(this.state.keepGeneratingEnemies);
        this.mainMode();
    }
  }

  componentWillUnmount(){
    clearInterval(this.state.keepCheckingEnemyPassed);
  }




  render() {
    let styleArr= [
        {
            // backgroundColor: 'red',
            height: 100,
            margin: 10
        },
        {
            // backgroundColor: 'blue',
            height: 100,
            margin: 10
        },
        {
            // backgroundColor: 'yellow',
            height: 100,
            margin: 10
        }
    ];
    // console.log("styleArr", styleArr)

    let lanesArr = [];
    [...this.props.partyList].map((char, index) => {
        let className = 'lane lane'+(index+1)
        if(char === null){
                lanesArr.push(
                    <div key={index} className={className} style={styleArr[index]}>
                    </div>
                )
        } else {
            lanesArr.push(
                <div key={index} className={className} style={styleArr[index]}>
                </div>
            )

        };

    });
    // console.log("lanesArr", lanesArr)
    let generateLanes = lanesArr.map(lane => {
        return lane;
    })

    let returnEnemies;
    let enemiesToGenerate = [...this.state.enemies]
    if(enemiesToGenerate.length > 0){
        returnEnemies = enemiesToGenerate.map(enemy => {
            // console.log('returning', enemy)
            return enemy

        });
    } else {
        console.log('no enemies found')
    }


    document.addEventListener('keydown', (event)=>{this.uniKeyCode(event)})


    let generateCharacters;
    if(this.state.charactersToGenerate.length === 3){
        generateCharacters = [...this.state.charactersToGenerate].map((char, index) => {
            return char;
        });
    };
    let generateCharacterPortraits;
    if(this.state.characterPortraitsToGenerate.length === 3){
        generateCharacterPortraits = [...this.state.characterPortraitsToGenerate].map((char, index) => {
            return char;
        });
    };

    // console.log(this.props.allCharacters)
    // console.log('YOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO')
    // console.log(this.props.timer)
    // console.log(this.props.difficulty)
            // <button onClick={()=>{this.mainMode()}}>back to main</button>


    return(
        <React.Fragment>
            <div className={styles.background}>
            <button id="generateEnemyBtn" onClick={()=>{this.generateEnemy()}}>GENERATE ENEMIES BTN</button>
            <p>Score: {this.state.score}</p>
            <div className={styles.lanesContainer}>
                {generateLanes}

            </div>
            <div id="enemies">
                {returnEnemies}
            </div>
            <div id="characters">
                {generateCharacters}
            </div>
            <div id="characterPortraits">
                {generateCharacterPortraits}
            </div>

            </div>

        </React.Fragment>
    );

  }

}

export default Game;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// class Game extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//         laneCoords: [null, null, null],
//         characterPortraitsCoords: [null, null, null],
//         characterSpriteCoords: [null, null, null],
//         characterToAnimate: [null, null, null],
//         keepCountingDown: null,
//         enemies: []
//         }
//   }


//   componentDidMount(){
//     document.addEventListener('keydown', (event)=>{this.uniKeyCode(event)})
//     this.generateLaneCoords();


//     // var keepCountingDown = setInterval(()=>this.countdown(), 1000);
//     // this.setState({keepCountingDown: keepCountingDown});

//     let interval;
//     if(this.props.difficulty === 'Easy'){
//         interval = 1000;
//     } else if (this.props.difficulty === 'Hard'){
//         interval = 500;
//     } else if (this.props.difficulty === 'Lethal'){
//         interval = 250;
//     };
//     var keepGeneratingEnemies = setInterval(()=>{
//         this.generateEnemy();
//     }, interval);

//   }

//   componentDidUpdate(){
//     console.log("state in game:", this.state);
//     if(this.props.timer <= 0){
//         clearInterval(this.state.keepCountingDown);
//         this.props.resetTimer();
//         // clearInterval(this.state.keepGeneratingEnemies);
//         this.mainMode();
//     }
//   }

//   componentWillUnmount(){
//     // clearInterval(this.state.keepCheckingEnemyPassed);
//   }

//   countdown(){
//     this.props.countdown();
//   }

//   mainMode(){
//     this.props.mainMode();
//   }

//   generateLaneCoords(){
//     let topCoords = [185, 305, 425];
//     let laneCoords = [];
//     [...this.state.laneCoords].map((laneCoord, index) => {
//         let coord = {
//             top: topCoords[index],
//             left: 10,
//             width: 1220,
//             height: 100,
//             margin: 20
//         };
//         laneCoords.push(coord);
//     });
//     this.setState({laneCoords: laneCoords});
//     this.generateCharacterPortraitsCoords(laneCoords);
//     this.generateCharacterSprites(laneCoords);
//   }

//   generateCharacterPortraitsCoords(laneCoords){
//     // console.log('generating portraits coords')

//     let characterPortraitsCoords = laneCoords.map((coord, index)=>{
//         if (coord === null || coord === undefined){
//             return;
//         } else {
//             return {
//                 top: coord.top,
//                 left: coord.width-100,
//                 width: 100,
//                 height: 100,
//                 margin: 20
//             };
//         }

//     });
//     this.setState({characterPortraitsCoords: characterPortraitsCoords})
//   }

//   generateCharacterSprites(laneCoords){
//     let characterSpriteCoords = laneCoords.map((coord, index)=>{
//         if(coord === null || coord === undefined){
//             return;
//         } else {
//             return {
//                 top: coord.top,
//                 left: coord.width-200,
//                 width: 100,
//                 height: 100,
//                 margin: 20
//             };
//         };
//     });
//     this.setState({characterSpriteCoords: characterSpriteCoords});
//   }


//   characterAttack(targetIndex){
//     console.log('making char attack!');
//     // console.log('index of char to animate', charIndex);
//     let characters = document.getElementById('characters').children
//     let characterToAnimate = characters[targetIndex];
//     // console.log("char to animate", characterToAnimate)
//     let simulateClick = () => {
//         console.log('simulating click')
//         let click = new MouseEvent('click', {
//             bubbles:true,
//             cancelable:false,
//             view:window
//         });
//         let clicking = !characterToAnimate.dispatchEvent(click);
//     }
//     simulateClick();
//   }

//    uniKeyCode(event){
//     console.log(this.state)
//     event.stopImmediatePropagation();
//     console.log(event.keyCode);
//     let key = event.keyCode;
//     let targetIndex;
//     if (key === 81){
//         console.log('pressed q');
//         targetIndex = 0;
//     } else if (key === 87){
//         console.log('pressed w');
//         targetIndex = 1;
//     } else if (key === 69){
//         console.log('pressed e');
//         targetIndex = 2;
//     } else {
//         return
//     };
//     this.characterAttack(targetIndex);

//    }



// generateEnemy(){
//     let randomLaneIndex = Math.floor(Math.random()*this.state.laneCoords.length)
//     let randomLaneCoords = this.state.laneCoords[randomLaneIndex]
//     let randomEnemyIndex = Math.floor(Math.random()*this.props.allCharacters.length)

//     // console.log('targeting lane:', randomLaneIndex+1);
//     // console.log('lane coords:', randomLaneCoords)
//     let {top, left, width, height, margin} = randomLaneCoords;

//     const moveRight = keyframes`
//         from {transform: translate(${left}px);}
//         to {transform: translate(${width-130}px);}
//     `;

//     let difficulty;
//     if(this.props.difficulty === 'Easy'){
//         difficulty = 3;
//     } else if (this.props.difficulty === 'Hard'){
//         difficulty = 2;
//     } else if (this.props.difficulty === 'Lethal'){
//         difficulty = 1.5;
//     };

//     let Enemy = styled.div`
//         position: absolute;
//         top: ${top}px;
//         left: ${left}px;
//         height: ${height}px;
//         width: 100px;
//         margin: 20px;
//         animation: ${moveRight} ${difficulty}s linear infinite;
//     `;

//     let enemy = <Enemy>
//                     <Spritesheet style={{width:100, height:100,}} image={this.props.allCharacters[randomEnemyIndex].reverse_spritesheet} widthFrame={260} heightFrame={260} steps={6} fps={12} startAt={1} endAt={6} loop={true}/>
//                 </Enemy>
//     // console.log('generating enemy:', enemy);
//     // this.setState({
//     //     enemies: [...this.state.enemies].concat(enemy),
//     // })
//     this.setState((state)=>{
//         return {enemies: state.enemies.concat(enemy)}
//     });

//   }




//   render() {
//     let generateLanes = [...this.state.laneCoords].map((laneCoord, index)=>{
//         if(laneCoord != null){
//             return <div key={index} style={{
//                 position: 'absolute',
//                 top: laneCoord.top,
//                 left: laneCoord.left,
//                 width: laneCoord.width,
//                 height: laneCoord.height,
//                 margin: laneCoord.margin,
//                 backgroundColor: 'black'
//             }}/>
//         }
//     });

//     let generateCharacterPortraits = [...this.state.characterPortraitsCoords].map((coord, index)=>{
//         if(coord != null){
//             // console.log('generating portrait!')

//             return <div
//                 key={index}
//                 style={{
//                     position: 'absolute',
//                     top: coord.top,
//                     left: coord.left+10,
//                     width: coord.width,
//                     height: coord.height,
//                     margin: coord.margin,
//                     background: `url(${this.props.partyList[index].battle_thumbnail}) top center`,
//                     backgroundSize: 'cover'
//                 }}/>
//         };
//     });

//     let generateCharacterSprites = [...this.state.characterSpriteCoords].map((coord, index)=>{
//         if(coord != null){
//             const attack = keyframes`
//                 0%  {background-position-x: 0px}
//                 100%{background-position-x: -600px;}
//             `;
//             const Character = styled.div`
//                     position: absolute;
//                     top: ${coord.top}px;
//                     left: ${coord.left+10}px;
//                     width: ${coord.width}px;
//                     height: ${coord.height}px;
//                     margin: ${coord.margin}px;
//                     background: url('${this.props.partyList[index].spritesheet}') left center;
//                     background-size: cover;
//                     animation: ${attack} .3s steps(6);
//                 `;
//             return <Character key={index} onClick={(event)=>{
//                         const target = event.target;
//                         target.style.animation = 'none';
//                         setTimeout(function() {
//                             target.style.animation = '';
//                         }, 10);
//                     }}/>

//         };
//     });

//     let returnEnemies;
//     if(this.state.enemies.length > 0){
//         returnEnemies = [...this.state.enemies].map(enemy => {
//             // console.log('returning', enemy)
//             return enemy

//         });
//     } else {
//         console.log('no enemies found')
//     }




//   return(
//     <React.Fragment>
//         <button onClick={()=>{this.mainMode()}}>BACK</button>
//         <div>
//             {generateLanes}
//         </div>
//         <div>
//             {generateCharacterPortraits}
//         </div>
//         <div id="characters">
//             {generateCharacterSprites}
//         </div>
//         <div>
//             {returnEnemies}
//         </div>
//     </React.Fragment>
//   );

//   }

// }