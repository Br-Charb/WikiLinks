import React from "react";

interface timerInput {
    seconds: number;
}

export const Timer = ({ seconds } : timerInput) => {

const calcTime = ((secs: number) => {
    let left = (Math.floor(secs/60)).toString();
    let right = (secs % 60).toString();
    if (left.length == 1) {
        left = "0" + left;
    }
    if (right.length == 1) {
        right = "0" + right;
    }
    return left + ":" + right;
});

return (
    <div className="timerSection">
        <div className="timeDigits">
        {calcTime(seconds)}
        </div>
        <div className="timeTitle">
        Timer
        </div>
    </div>
)};
