Array.prototype.equalize = function (array1, array2) {
    if(!array2.length) array2 = [0]

    if (!array1 || (array1 && !array1.length)) {
        return array2
    }

    return array1.map(el => {
        if (array2.map(el => +el).includes(+el)) return el
        else return
    })
}