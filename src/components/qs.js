const partiion = (myArr, low, high) => {
    let pivot = myArr[low];
    let i = low - 1;
    let j = high + 1;
    while (true) {
        do {
            i++;
        } while (myArr[i] < pivot);
        do {
            j--;
        } while (myArr[j] > pivot);
        if (i >= j) {
            return j;
        }
        let temp = myArr[i];
        myArr[i] = myArr[j];
        myArr[j] = temp;
    }
    
}
const quickSort = (myArr, low, high) => {
    if (low < high) {
        let pIdx = partiion(myArr, low, high);
        quickSort(myArr, low, pIdx);
        quickSort(myArr, pIdx + 1, high);
    }

}

const newArr = [];
for (let i = 0; i < 20; i++) {
    newArr.push(Math.floor(Math.random() * 55) + 1) // 1 -> 55
}
console.log(newArr);
quickSort(newArr, 0, newArr.length-1);
console.log(newArr);