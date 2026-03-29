import { useState, useEffect } from 'react';


interface StartTarget {
    title?: string;
}

export const CurrentPage = ({ title = "" }: StartTarget) => {

    const [imageURL, setImageURL] = useState<string>("unknown.png");

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
        if (title !== "") {
            getImageURL(title).then(url => setImageURL(url));
        } else {
            setImageURL("unknown.png");
        }
    }, [title]);

    return (
        <div className="setupContainer">
            <div className="setupPage">
                <p className="wikiPageLabel">CURRENT</p>
                <div className="imageDisplay">
                    {title !== "" ?
                        (
                            <div className="innerImageDiv">
                                <img className="wikiImage" src={imageURL} />
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
                <p className="wikiTitleLabel">{title}</p>
            </div>
        </div>
    )
};