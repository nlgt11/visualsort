import React, { useState, useEffect } from 'react';
import './SortVisualizer.css';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const SPEED = 70;
const SIZE = 25;
const COLOR_PRIMARY = "pink";
const COLOR_SWAPPING = "green";
const COLOR_ITERATING = "yellow";
const COLOR_WAITING = "orange";

const SortVisualizer = () => {
    const [arr, setArr] = useState([]);

    const resetArr = () => {
        const newArr = [];
        for (let i = 0; i < SIZE; i++) {
            newArr.push(Math.floor(Math.random() * 55) + 1) // 1 -> 55
        }
        setArr(newArr);
    }

    // Animation controls
    const cols = document.getElementsByClassName("column");
    const aniSwap = async (a, b) => {
        cols[a].style.backgroundColor = COLOR_SWAPPING;
        cols[b].style.backgroundColor = COLOR_SWAPPING;
        await sleep(SPEED * 4);
        let tempHeight = cols[a].style.height;
        cols[a].style.height = cols[b].style.height;
        cols[b].style.height = tempHeight;
        let tempInner = cols[a].innerHTML;
        cols[a].innerHTML = cols[b].innerHTML;
        cols[b].innerHTML = tempInner;
        await sleep(SPEED * 4);
    }
    const aniIterating = async myArr => {
        for (let i = 0; i < myArr.length; i++) {
            cols[myArr[i]].style.backgroundColor = COLOR_ITERATING;
        }
        await sleep(SPEED * 2);
    }
    const aniWaiting = myArr => {
        for (let i = 0; i < myArr.length; i++) {
            cols[myArr[i]].style.backgroundColor = COLOR_WAITING;
        }
    }
    const removeAnimation = myArr => {
        for (let i = 0; i < myArr.length; i++) {
            cols[myArr[i]].style.backgroundColor = COLOR_PRIMARY;
        }
    }

    //========== Algorithms ==============
    // Bubble sort
    const bubbleSort = async() => {
        let tempArr = [...arr];
        for (let i = 0; i < SIZE - 1; i++) {
            let swapped = false;
            for (let j = 0; j < SIZE-i-1; j++) {
                await aniIterating([j, j+1]); // Change color of iterating element
                if (tempArr[j] > tempArr[i + 1]) {
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

    // Selection sort
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

        
    return (
        <div className="container">
            <div className="columns">
                {arr.map((el, idx) => {
                        return (
                            <div className="column" style={{height: `${el*10}px`}} >{el}</div>
                        )
                    }
                )}
            </div>
            <div className="controller">
                <button onClick={() => resetArr()} >Generate Array</button>
                <button onClick={() => bubbleSort()}>Bubble Sort</button>
                <button onClick={() => selectionSort()}>Selection Sort</button>
            </div>
        </div>
    )
}

export default SortVisualizer
