/*
check combinations first
if left (direction) is empty move that way


start with list 	0220	2222 	0222	0422 	4044
remove zeros     	22 		2222	222 	422		444
check pairs 
	if equal add	4		44		42 		44 		84


	22244488822288


	for(var i = 0 ; i < string.length ;i++){

	}
*/

var combine = function (numbers){
	var newNumbers = [];
	// remove zeros from numbers
		// add code
	// combine
	for(var i = 0 ; i < numbers.length ;i++){
		while(numbers.length>0){
			if(numbers[0] === numbers[1]){
				// add them together
				var sum = numbers[0] + numbers[1]
				// push sum onto newNumbers
				newNumbers.push(sum);
				// remove both numbers from numbers
				numbers.shift();
				numbers.shift();
			} else{
				// push first number onto newNumbers
				newNumbers.push(numbers[0]);
				//remove the first item from numbers array
				numbers.shift();
			}
		}
	}	
	return newNumbers;
};

/*

new game - 
game over - tell user
score - 
animate
save state & score - cookies - local storage
help/intro

*/