
function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

var random1 = between(0,100);
console.log(random1);