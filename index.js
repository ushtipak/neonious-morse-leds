let http = require('http');
let fs = require('fs');
let gpio = require('gpio');

let timeDot = 150;
let timeDash = 450;
let timeBetweenPartsOfSameLetter = 150;
let timeBetweenLetters = 450;
let timeBetweenWords = 1050;

let alphabet = {
  'a': '.-',    'b': '-...',  'c': '-.-.', 'd': '-..',
  'e': '.',     'f': '..-.',  'g': '--.',  'h': '....',
  'i': '..',    'j': '.---',  'k': '-.-',  'l': '.-..',
  'm': '--',    'n': '-.',    'o': '---',  'p': '.--.',
  'q': '--.-',  'r': '.-.',   's': '...',  't': '-',
  'u': '..-',   'v': '...-',  'w': '.--',  'x': '-..-',
  'y': '-.--',  'z': '--..',  ' ': '/',
  '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----',
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

http.createServer(function (req, res) {
  res.end();

  const messageText = req.url.substring(1).replace(/_/g, " ");
  console.log("messageText: " + messageText);

  messageMorse = messageText.split('').map(function(e) { return alphabet[e.toLowerCase()] || ''; }).join(' ').replace(/ +/g, ' ');
  console.log("messageMorse: " + messageMorse);

  for (var i = 0; i < messageMorse.length; i++) {
    switch (messageMorse.charAt(i)) {
      case ".":
        gpio.pins[gpio.LED_GREEN].setValue(true);
        sleep(timeDot)
        gpio.pins[gpio.LED_GREEN].setValue(false);
        break;
      case "-":
        gpio.pins[gpio.LED_GREEN].setValue(true);
        sleep(timeDash)
        gpio.pins[gpio.LED_GREEN].setValue(false);
        break;
      case " ":
        gpio.pins[gpio.LED_RED].setValue(true);
        sleep(timeBetweenLetters)
        gpio.pins[gpio.LED_RED].setValue(false);
        break;
      case "/":
        gpio.pins[gpio.LED_RED].setValue(true);
        sleep(timeBetweenWords)
        gpio.pins[gpio.LED_RED].setValue(false);
        break;
      }
      sleep(timeBetweenPartsOfSameLetter)
    }
}).listen(80);

console.log("go go go!");
