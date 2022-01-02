export default function (length) {
	let randomNumber = Date.now() + ( (Math.random() * 10).toFixed() )
	let sizedNumber = randomNumber.split('').reverse().splice(0, length).join('')
    return sizedNumber
}