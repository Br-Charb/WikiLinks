import WikiPage from "./WikiPage";

interface gameAreaInput {
    titles: string[];
    changeMem: (title: string) => void;
}

export const GameArea = ({ titles, changeMem }: gameAreaInput) => {
    return (
        <div className="gameAreaContainer">
            {titles.map((titleName) => (
                <WikiPage key={titleName} title={titleName} isCurrentPage={false} onClicked={changeMem} />
            ))}
            <button className="giveUpGameButton" onClick={() => changeMem("THE PLAYER IS GIVING UP")}>
                GIVE UP
            </button>
        </div>
    );
}
