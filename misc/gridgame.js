$("#help").click(function() {
  const info = $("#info");
  info.css("display", info.css("display") === "none" ? "flex" : "none");
});

// CONTROLS

let square = $("div#5");
let jade = Array(4);
const wasd = new Map([[65, 37], [87, 38], [68, 39], [83, 40]]);
let prejump = 0;

$(document).on("keydown", function(event) {
  const key = wasd.has(event.which) ? wasd.get(event.which) : event.which;
  if (key < 37 || key > 40) {return;}
  if (key & 1) {
    if (jade[0] || jade[2]) {return;}
    if (key === 37) {
      prejump += square.is("div:nth-child(3n+1)") ? 0 : -1;
    } else {
      prejump += square.is("div:nth-child(3n)") ? 0 : 1;
    }
  } else {
    if (jade[1] || jade[3]) {return;}
    if (key === 38) {
      prejump += square.is("div:nth-child(-n+3)") ? 0 : -3;
    } else {
      prejump += square.is("div:nth-child(n+7)") ? 0 : 3;
    }
  }
  jade[key - 37] = 1;
});

$(document).on("keyup", function(event) {
  const key = wasd.has(event.which) ? wasd.get(event.which) : event.which;
  if (key === 32) {square.click(); return;}
  if (48 < key && key < 58) {$(`.${key - 48}`).click(); return;}
  if (37 > key || key > 40) {return;}
  delete jade[key - 37];
  if (!prejump || jade.some(e => e)) {return;}
  let jump = prejump;
  prejump = 0;
  const moveto = $($("div")[$("div").index(square) + jump]);
  if (moveto.text()) {return;}
  square = moveto;
  square.click();
  return;
});

let t = 0;
let value = 0;
let place = 0;

$("p").click(function() {
  if (value) {
    $(`.options > p:nth-child(${value})`).css("color", '#000');
  }
  value = $(this).text();
  if (place) {
    move(value, place);
  } else {
    $(this).css("color", t & 1 ? '#f00' : '#00f');
  }
});

$("div").click(function() {
  if (place) {
    $("#" + place).css("backgroundColor", 'white');
  }
  place = $(this).attr("id");
  if (value) {
    move(value, place);
  } else {
    square = $(this);
    square.css("backgroundColor", t & 1 ? '#ff7f7f' : '#7f7fff');
  }
});

// GAME CODE 

let rows = [
  [0,1,2],
  [2,5,8],
  [3,4,5],
  [1,4,7],
  [6,7,8],
  [0,3,6],
  [2,4,6],
  [0,4,8]
];
let board = Array(9);
let blu = 0;
let red = 0;

function move(currentValue, currentPlace) {
  value = place = 0;
  const divNode = $("#" + currentPlace);
  const valNode = $(`p:nth-child(${currentValue})`, ".options");
  divNode[0].textContent = board[currentPlace - 1] = parseInt(currentValue);
  divNode.off();
  divNode.css("backgroundColor", 'white');
  divNode.css("color", t & 1 ? '#f00' : '#00f');
  divNode.css("cursor", "default");
  valNode.css("visibility", 'hidden');
  valNode.off();
  square = $("div#5");
  if (t < 2) {t++;return;}
  
  let rose = 0;
  const board_c = board.slice();
  for (let k of rows.slice()) {
    const bose = k.map(e => board_c.at(e));
    if (bose.every(e => e)) {
      rows.splice(rows.indexOf(k),1);
      rose = Math.max(rose, bose.reduce((a,b) => a+b, 0));
    }
  }
  
  if (!rose) {t++;return;}
  
  if (t & 1) {
    red += rose;
    $('.score.red').text(red);
  } else {
    blu += rose;
    $('.score.blu').text(blu);
  }
  
  if (t === 8) {
    const announcement = $("#winner");
    $('.options')[0].remove();
    if (blu === red) {
      announcement.text("It's a tie!");
      announcement.css("display", 'block');
      return;
    }
    announcement.css("display", 'block');
    announcement.append(blu > red ? "<span style='color: blue;'>Blue</span>!" : "<span style='color: red;'>Red</span>!");
  } else {
    t++;
  }
}