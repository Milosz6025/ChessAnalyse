window.addEventListener('DOMContentLoaded', function() {
    var analyzeButton = document.getElementById('analyze-button');
    var pgnInput = document.getElementById('pgn-input');
    var resultContainer = document.getElementById('result-container');
    var analysisResults = document.getElementById('analysis-results');

    analyzeButton.addEventListener('click', function() {
        var pgnLink = pgnInput.value;
        var analysis = analyzeGame(pgnLink);

        // Wyświetlanie wyników
        analysisResults.innerHTML = '<p>Ruchy: ' + analysis.moves.join(' ') + '</p>';
        analysisResults.innerHTML += '<p>Wynik: ' + analysis.result + '</p>';

        resultContainer.style.display = 'block';
    });
});

function analyzeGame(pgnLink) {
    var game = new Chess();
    var moves = [];
    var result = '';

    // Ładuj PGN do obiektu gry
    game.load_pgn(pgnLink);

    // Pobierz wszystkie ruchy
    var pgnMoves = game.history();

    // Przetwarzaj ruchy i zapisuj je do tablicy
    for (var i = 0; i < pgnMoves.length; i++) {
        var move = pgnMoves[i];
        moves.push(move);
    }

    // Sprawdź wynik gry
    if (game.in_checkmate()) {
        if (game.turn() === 'w') {
            result = 'Czarne wygrały';
        } else {
            result = 'Białe wygrały';
        }
    } else if (game.in_draw()) {
        result = 'Remis';
    } else {
        result = 'Partia niezakończona';
    }

    // Analiza przy użyciu silnika Stockfish.js
    var stockfish = STOCKFISH();
    stockfish.postMessage('position startpos moves ' + pgnMoves.join(' '));
    stockfish.postMessage('go depth 10'); // Przykładowe polecenie analizy z głębokością 10

    stockfish.onmessage = function(event) {
        if (event.data.startsWith('bestmove')) {
            var bestMove = event.data.split(' ')[1];
            console.log('Najlepszy ruch: ' + bestMove);
            // Możesz dodać kod do wyświetlania najlepszego ruchu na stronie
        }
    };

    return {
        moves: moves,
        result: result
    };
}
