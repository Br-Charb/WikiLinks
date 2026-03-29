import React from "react";
import { useState } from "react";

import WikiPage from "./WikiPage";
import { Timer } from "./Timer";
import { AlgorithmTimer } from "./AlgorithmTimer";


interface algoInput {
    dialTitles: string[];
    dialTime: number;
    djikstraTitles: string[];
    djikstraTime: number;
}

export const AlgorithmDisplay = ({ dialTitles, dialTime, djikstraTitles, djikstraTime } : algoInput) => {

    const [showDial, setShowDial] = useState<boolean>(false);

    return (
        <div className="algorithmDisplayContainer">
            <div className="AlgorithmButtonsContainer">
                <div className="algorithmNames" onClick={() => setShowDial(false)}>
                    <div className="algorithmBox">
                        Djikstra's
                    </div>
                </div>
                {showDial ? 
                    (   
                        <AlgorithmTimer seconds={dialTime} algo="Dial's"/>
                    )
                    :
                    (
                        <AlgorithmTimer seconds={djikstraTime} algo="Djikstra's"/>
                    )
                }
                <div className="algorithmNames" onClick={() => setShowDial(true)}>
                    <div className="algorithmBox">
                        Dial's
                    </div>
                </div>
            </div>
            <div>
            </div>
                {showDial ? 
                    (
                        <div className="gameAreaContainer">
                            {dialTitles.map((titleName) => (
                                <WikiPage title={titleName} isCurrentPage={false}/>
                            ))}
                        </div>
                    )
                    :
                    (
                        <div className="gameAreaContainer">
                            {djikstraTitles.map((titleName) => (
                                <WikiPage title={titleName} isCurrentPage={false}/>
                            ))}
                        </div>
                    )
                }
        </div>
    );
}
