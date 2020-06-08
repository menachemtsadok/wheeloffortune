window.onload = () => {

    const host = '127.0.0.1'
    const port = '3000'
    const tgt = document.getElementById('target')
  
    const update = () =>
      fetch('http://127.0.0.1:3000/data')
        .then( response => response.json() )
        .then( jsonData => tgt.innerHTML = JSON.stringify(jsonData, undefined, 2) );

    const loadPuzzle = () =>
        fetch('http://' + host + ':' + port + '/puzzles')
            .then( response => response.json())
            .then( jsonData => tgt.innerHTML = JSON.stringify(jsonData, undefined, 2) );



    console.log("Called");
    document.getElementById('joinGame').onclick = joinGame;
    document.getElementById('createGame').onclick = createGame;
  
    update();

    function startGame() {
        window.location.href = "/html/game.html";
    }

    function joinGame() {

    }

    function createGame() {
        window.location.href = "/html/createpuzzles.html";
    }
  
  }