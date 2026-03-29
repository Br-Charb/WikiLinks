import React from "react";

interface timerInput {
    seconds: number;
    algo: string;
}

export const AlgorithmTimer = ({ seconds, algo } : timerInput) => {

const calcTime = ((secs: number) => {
    let s = (secs/1000).toString();
    if (s.length < 5) {
        return s;
    } else if (s[4] == "."){
        return s[0] + s[1] + s[2] + s[3];
    } else {
        return s[0] + s[1] + s[2] + s[3] + s[4];
    }
})

return (
    <div className="timerSection">
        <div className="timeDigits">
        {calcTime(seconds)} s
        </div>
        <div className="timeTitle">
        {algo} Algorithm Time
        </div>
    </div>
)};
