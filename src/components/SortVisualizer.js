import React, { useState, Fragment, useEffect } from 'react';
import './SortVisualizer.css';
import Controller from './Controller/Controller';
import Title from './Title/Title'



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const COLOR_PRIMARY = "pink";
const COLOR_SWAPPING = "#f610ff";
const COLOR_ITERATING = "yellow";
const COLOR_WAITING = "orange";
const COLOR_PIVOT = "#ff1065"

const SortVisualizer = () => {
    const [arr, setArr] = useState([]);
    const resetArr = () => {
        const newArr = [];
        for (let i = 0; i < SIZE; i++) {
            newArr.push(Math.floor(Math.random() * 85) + 1) // 1 -> 55
        }
        setArr(newArr);
    }
    const [SPEED, setSpeed] = useState(50);
    const speedChangeHandler = e => {
        let newSpeed = Math.floor(e.target.value);
        setSpeed(newSpeed);
    }


    const [SIZE, setSize] = useState(30);
    const sizeChangeHandler = e => {
        let newSize = Math.floor(e.target.value);
        setSize(newSize);
    }



    useEffect(() => resetArr(), [SIZE]);

    // Animation controls
    const cols = document.getElementsByClassName("column");
    const aniSwap = async (a, b) => {
        cols[a].style.backgroundColor = COLOR_SWAPPING;
        cols[b].style.backgroundColor = COLOR_SWAPPING;
        await sleep((80 - SPEED) * 3);
        let tempHeight = cols[a].style.height;
        cols[a].style.height = cols[b].style.height;
        cols[b].style.height = tempHeight;
        let tempInner = cols[a].innerHTML;
        cols[a].innerHTML = cols[b].innerHTML;
        cols[b].innerHTML = tempInner;
        await sleep((80 - SPEED) * 3);
        await aniIterating([a, b]);
        removeAnimation([a,b]);
    }
    const aniIterating = async myArr => {
        for (let i = 0; i < myArr.length; i++) {
            cols[myArr[i]].style.backgroundColor = COLOR_ITERATING;
        }
        await sleep((80 - SPEED) * 3); // reduce aniiterating of quick sort
        //removeAnimation(myArr);
    }
    const aniWaiting = myArr => {
        for (let i = 0; i < myArr.length; i++) {
            cols[myArr[i]].style.backgroundColor = COLOR_WAITING;
        }
    }
    const aniPivot = myArr => {
        for (let i = 0; i < myArr.length; i++) {
            cols[myArr[i]].style.backgroundColor = COLOR_PIVOT;
        }
    }
    const removeAnimation = myArr => {
        for (let i = 0; i < myArr.length; i++) {
            cols[myArr[i]].style.backgroundColor = COLOR_PRIMARY;
        }
    }

    //========== Algorithms ==============
    //========== Bubble sort =============
    const bubbleSort = async() => {
        let tempArr = [...arr];
        for (let i = 0; i < SIZE - 1; i++) {
            let swapped = false;
            for (let j = 0; j < SIZE-i-1; j++) {
                await aniIterating([j, j+1]); // Change color of iterating element
                if (tempArr[j] > tempArr[j + 1]) {
                    let a = tempArr[j];
                    tempArr[j] = tempArr[j + 1];
                    tempArr[j+1] = a;
                    await aniSwap(j, j+1); // Change color and swap height
                    swapped = true;
                }
                removeAnimation([j, j+1]); // Set color back to primary
            }
            if (!swapped) break;
        }
        setArr(tempArr);
    }

    //======== Selection sort ==============
    const selectionSort = async() => {
        let tempArr = [...arr];
        for (let i = 0; i < SIZE - 1; i++) {
            let minIdx = i + 1;
            aniWaiting([minIdx]);
            for (let j = i + 1; j < SIZE; j++) {
                await aniIterating([i, j]);
                removeAnimation([j]);
                aniWaiting([minIdx]); //set back for minIdx because j might me take value of minIdx, we remove color of j
                if (tempArr[j] < tempArr[minIdx]) {
                    removeAnimation([minIdx]);
                    minIdx = j;
                    aniWaiting([minIdx]); 
                }
            }
            if (tempArr[minIdx] < tempArr[i]) {
                let a = tempArr[minIdx];
                tempArr[minIdx] = tempArr[i];
                tempArr[i] = a;
                await aniSwap(minIdx, i);
                removeAnimation([minIdx, i]);
            }
            removeAnimation([i]);
            removeAnimation([i + 1]);
        }
        setArr(tempArr);
    }


    //======= Quick sort ==================
    const partition2 = async (myArr, low, high) => {
        let pivot = myArr[high];
        aniPivot([high]);
        let i = low - 1;
        aniWaiting([i + 1]);
        for (let j = low; j <= high - 1; j++) {
            await aniIterating([j]);
            if (myArr[j] < pivot) {
                removeAnimation([i + 1]);
                i++;
                let temp = myArr[i];
                myArr[i] = myArr[j];
                myArr[j] = temp;
                await aniSwap(i, j);
                aniWaiting([i + 1]);
            }
            removeAnimation([j]);
        }
        let temp = myArr[i + 1];
        myArr[i + 1] = myArr[high];
        myArr[high] = temp;
        await sleep((80 - SPEED) * 5);
        await aniSwap(i + 1, high);
        return (i+1);
    }


    const quickSort = async (myArr, low, high) => {
        if (low < high) {
            let pIdx = await partition2(myArr, low, high);
            await quickSort(myArr, low, pIdx - 1);
            await quickSort(myArr, pIdx + 1, high);
        }
    }

    const callQuickSort = async () => {
        let tempArr = [...arr];
        await quickSort(tempArr, 0, tempArr.length - 1);
        setArr(tempArr);
    }


        
    return (
        <Fragment>
            <Title />
            <div className="container">
                <div className="columns">
                    {(arr).map((el, idx) => {
                            return (
                                <div key={idx} className="column" style={{height: `${el}%`}}>
                                </div>
                            )
                        }
                    )}
                </div>
                <Controller
                    reset={resetArr}
                    ss={selectionSort}
                    bs={bubbleSort}
                    qs={callQuickSort}
                    speed={SPEED}
                    changeSpeed={speedChangeHandler}
                    size={SIZE}
                    changeSize={sizeChangeHandler}
                />
            </div>
        </Fragment>
    )
}

export default SortVisualizer
