import React from "react";

interface scoreInput {
    num: number;
}

export const Score = ({ num } : scoreInput) => {

return (
        <div className="scoreSection">
            <div className="scoreDigits">
                {num}
            </div>
            <div>
                Score
            </div>
        </div>
)};
