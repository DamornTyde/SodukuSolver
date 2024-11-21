// vars
const input = document.querySelector("#puzzle");
const numpad = document.querySelector("#input");
const output = document.querySelector("#solved");
const solve = document.querySelector("#solve");
const puzzle = Array(9).fill().map(() => Array(9).fill(0));

// templates
function printPuzzle() {
    const table = document.createElement("table");
    for (const x of puzzle) {
        const tr = document.createElement("tr");
        for (const y of x) {
            const td = document.createElement("td");
            if (y === 0) { td.append(document.createTextNode(" ")); } 
            else { td.append(document.createTextNode(y)); }
            tr.append(td);
        }
        table.append(tr);
    }
    return table;
}

function printNumpad(x, y) {
    numpad.innerHTML = "";
    const table = document.createElement("table");
    for (let x1 = 0; x1 < 3; x1++) {
        const row = document.createElement("tr");
        for (let num = x1 * 3 + 1; num < x1 * 3 + 4; num++) {
            const cell = document.createElement("td");
            cell.append(document.createTextNode(num));
            if (checkCell(x, y, num)) { cell.addEventListener("click", () => inputValue(x, y, num)); } 
            else { cell.classList.add("gray"); }
            row.append(cell);
        }
        table.append(row);
    }
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.setAttribute("colspan", "3");
    cell.append(document.createTextNode(0));
    if (puzzle[x][y] !== 0) { cell.addEventListener("click", () => inputValue(x, y, 0)); }
    else { cell.classList.add("gray"); }
    row.append(cell);
    table.append(row);
    numpad.append(table);
    input.querySelectorAll("tr").forEach((row) => {
        row.querySelectorAll("td").forEach((cell) => cell.classList.remove("active"));
    });
    input.querySelectorAll("tr")[x].querySelectorAll("td")[y].classList.add("active");
}

// rules
function checkBlock(x, y, num) {
    const row = Math.floor(x / 3) * 3;
    const col = Math.floor(y / 3) * 3;
    for (let x1 = row; x1 < row + 3; x1++) {
        if (x1 !== x) {
            for (let y1 = col; y1 < col + 3; y1++) {
                if (puzzle[x1][y1] === num) { return false; }
            }
        }
    }
    return true;
}

function checkCell(x, y, num) {
    return !puzzle[x].includes(num) && !puzzle.map(i => i[y]).includes(num) && checkBlock(x, y, num);
}

// build input
function buildInput() {
    input.innerHTML = "";
    numpad.innerHTML = "";
    input.append(printPuzzle());
    input.querySelectorAll("tr").forEach((row, x) => {
        row.querySelectorAll("td").forEach((cell, y) => cell.addEventListener("click", () => printNumpad(x ,y)));
    });
}

function inputValue(x, y, num) {
    if (num !== undefined && num > -1 && num < 10 && (num === 0 || checkCell(x, y, num))) {
        puzzle[x][y] = num;
        buildInput();
    } else { alert("Invalid input!"); }
}

buildInput();

// The Solver of the Absolute Fabric, the Void, the Exponential End
solve.addEventListener("click", () => {
    output.innerHTML = "";
    numpad.innerHTML = "";
    const cells = puzzle.map((row, x) => row.map((cell, y) => cell === 0 ? { 'x': x, 'y': y } : [])).flat(2);
    if (cells.length !== 0) {
        let index = 0;
        while (index > -1 && index < cells.length) {
            const cell = cells[index];
            const geuss = puzzle[cell.x][cell.y] + 1;
            if (geuss > 9) {
                puzzle[cell.x][cell.y] = 0;
                index--;
            } else if (checkCell(cell.x, cell.y, geuss)) {
                puzzle[cell.x][cell.y] = geuss;
                index++;
            } else { puzzle[cell.x][cell.y] = geuss; }
        }
        if (index === cells.length) {
            output.append(printPuzzle());
            for (const cell of cells) {
                puzzle[cell.x][cell.y] = 0;
                output.querySelectorAll("tr")[cell.x].querySelectorAll("td")[cell.y].classList.add("gray");
            }
        } else { alert("This sudoku can't be solved, though..."); }
    } else { alert("There are no empty cells, Bite me!"); }
});

// keyboard
document.addEventListener("keydown", event => {
    let num = Number(event.key);
    if (event.key === "Enter") { solve.click(); }
    else if (num !== NaN && numpad.querySelectorAll("table").length > 0) {
        num = num === 0 ? 9 : num - 1;
        numpad.querySelectorAll("td")[num].click();
    }
});