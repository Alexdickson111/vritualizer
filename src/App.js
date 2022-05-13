/** @format */

import React, { useEffect, useState, useRef, useCallback } from "react";

const generateFakeData = () => {
  const data = [];
  for (let i = 0; i < 1000; i++) {
    data.push(`title ${i}`);
  }
  return data;
};

const getData = (data, page) => {
  if (page >= 0) {
    return data.slice(page * 10, (page + 1) * 10);
  }
};

export default function App() {
  const [pageNumber, setPageNumber] = useState(0);
  const [increasedPageNumber, setIncreasedPageNumber] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadedBlocks, setLoadedBlocks] = useState([]);
  const topItemObserver = useRef();
  const bottomItemObserver = useRef();

  const [fakeData, setFakeData] = useState(generateFakeData());

  const addBlockInBack = React.useCallback(
    (block) => {
      setLoadedBlocks((prevBlocks) => {
        const blocks = prevBlocks;
        blocks[0] = prevBlocks.length === 2 ? prevBlocks[1] : undefined;
        blocks[1] = block;
        return blocks;
      });
    },
    [loadedBlocks]
  );

  console.log(loadedBlocks);
  const addBlockInFront = React.useCallback(
    (block) => {
      setLoadedBlocks((prevBlocks) => {
        const blocks = prevBlocks;
        blocks[1] = prevBlocks[0];
        blocks[0] = block;
        return blocks;
      });
    },
    [loadedBlocks]
  );

  const increasePageNumber = React.useCallback(() => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
    setIncreasedPageNumber(true);
  }, []);

  const decreasePageNumber = React.useCallback(() => {
    setPageNumber((prevPageNumber) => prevPageNumber - 1);
    setIncreasedPageNumber(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setHasMore(true);

    if (increasedPageNumber) {
      addBlockInBack(getData(fakeData, pageNumber));
    } else {
      addBlockInFront(getData(fakeData, pageNumber));
    }
    setLoading(false);
  }, [pageNumber]);

  const topItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (topItemObserver.current) topItemObserver.current.disconnect();
      topItemObserver.current = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) {
          decreasePageNumber();
          console.log("Penultim item intersected");
        }
      });
      if (node) topItemObserver.current.observe(node);
    },
    [decreasePageNumber, loading]
  );

  const bottomItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (bottomItemObserver.current) bottomItemObserver.current.disconnect();
      bottomItemObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          increasePageNumber();
          console.log("Ultim item intersected");
        }
      });
      if (node) bottomItemObserver.current.observe(node);
    },
    [increasePageNumber, loading, hasMore]
  );

  const firstBlock = loadedBlocks[0];
  const secondBlock = loadedBlocks[1];

  console.log(firstBlock);
  console.log(secondBlock);

  return (
    <>
      <div>
        <div>{loading && "Loading..."}</div>
        <div>{error && "Error"}</div>
        {firstBlock &&
          firstBlock.map((item, index) => {
            if (firstBlock.length === index + 1) {
              return <div style={{ height: "120px" }}>{item}</div>;
            } else {
              return <div style={{ height: "120px" }}>{item}</div>;
            }
          })}
        {secondBlock &&
          secondBlock.map((item, index) => {
            if (secondBlock.length === index + 1) {
              return (
                <div ref={bottomItemRef} style={{ height: "130px" }}>
                  {item}
                </div>
              );
            } else {
              return <div style={{ height: "130px" }}>{item}</div>;
            }
          })}
        <div>{loading && "Loading..."}</div>
        <div>{error && "Error"}</div>
      </div>
    </>
  );
}
