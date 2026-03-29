import { useState, useEffect } from 'react';

interface WikiPageInfo {
  title: string;
  isCurrentPage?: boolean;
  onClicked?: (title: string) => void;
}

export default function WikiPage({ title, isCurrentPage, onClicked }: WikiPageInfo) {
  return (
    <button className="wikiPageCard" onClick={() => onClicked?.(title)}>
      <div className="wikiPageContent">
        {/* {isCurrentPage && <p className="wikiPageLabel">Current Page</p>} */}
        <p className="wikiTitleLabel">{title}</p>
      </div>
    </button>
  );
}