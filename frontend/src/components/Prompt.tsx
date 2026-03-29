import { useEffect, useState } from 'react';


interface StartTarget {
    startTitle?: string;
    targetTitle?: string;
}

export const Prompt = ({ startTitle = "", targetTitle = "" }: StartTarget) => {

    const [startImage, setStartImage] = useState<string>("unknown.png");
    const [targetImage, setTargetImage] = useState<string>("unknown.png");

    const getImageURL = async (title: string) => {
        let formattedTitle = title.replaceAll(" ", "_");
        try {
            const response = await fetch(
                `https://en.wikipedia.org/w/api.php?action=query&titles=${formattedTitle}&prop=pageimages&format=json&pithumbsize=500&origin=*`
            );
            const data = await response.json();

            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];
            const imageUrl = pages[pageId].thumbnail?.source;

            return imageUrl || "noImage.jpg";
        } catch (error) {
            console.error("error getting image:", error);
            return "noImage.jpg";
        }
    };

    useEffect(() => {
        if (startTitle !== "" && targetTitle !== "") {
            getImageURL(startTitle).then(url => setStartImage(url));
            getImageURL(targetTitle).then(url => setTargetImage(url));
        } else {
            setStartImage("unknown.png");
            setTargetImage("unknown.png");
        }
    }, [startTitle, targetTitle]);



    return (
        <div className="setupContainer">
            <div className="setupPage">
                <p className="wikiPageLabel">START</p>
                <div className="imageDisplay">
                    {startTitle !== "" && targetTitle !== "" ?
                        (
                            <div className="innerImageDiv">
                                <img className="wikiImage" src={startImage} />
                            </div>
                        )
                        :
                        (
                            <div className="innerImageDiv">
                                <img className="unknownImage" src="unknown.png" />
                            </div>
                        )
                    }
                </div>
                <p className="wikiTitleLabel">{startTitle}</p>
            </div>

            <div className="arrow">
                ➔
            </div>
            <div className="setupPage">
                <p className="wikiPageLabel">TARGET</p>
                <div className="imageDisplay">
                    {startTitle !== "" && targetTitle !== "" ?
                        (
                            <div className="innerImageDiv">
                                <img className="wikiImage" src={targetImage} />
                            </div>
                        )
                        :
                        (
                            <div className="innerImageDiv">
                                <img className="unknownImage" src="unknown.png" />
                            </div>
                        )
                    }
                </div>
                <p className="wikiTitleLabel">{targetTitle}</p>
            </div>
        </div>
    );
};