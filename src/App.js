/** @format */

import React, { useEffect, useState, useRef, useCallback } from "react";

const generateFakeData = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push(`title ${i}`);
  }
  return data;
};

const getData = (data, page, threshold = 0) => {
  if (page >= 0) {
    return data.slice(page * 10 + threshold, (page + 1) * 10);
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
      const newData = [];
      newData[0] = loadedBlocks.length === 2 ? loadedBlocks[1] : undefined;
      newData[1] = block;
      setLoadedBlocks(newData);
    },
    [loadedBlocks]
  );

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
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 0));
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
  }, [increasedPageNumber, pageNumber]);

  const topItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (topItemObserver.current) topItemObserver.current.disconnect();
      topItemObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          console.log("Intersected top");
          decreasePageNumber();
        }
      });
      if (node) topItemObserver.current.observe(node);
    },
    [decreasePageNumber, loading]
  );

  const scrollPointTop = useCallback((node) => {
    if (node) {
      console.log("Scrolling top");
      node.scrollIntoView();
    }
  }, []);

  const scrollPointBottom = useCallback((node) => {
    if (node) {
      console.log(node);
      console.log("Scrolling bottom");
      node.scrollIntoView();
    }
  }, []);

  const bottomItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (bottomItemObserver.current) bottomItemObserver.current.disconnect();
      bottomItemObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && true) {
          increasePageNumber();
          console.log("Intersected bottom");
        }
      });
      if (node) bottomItemObserver.current.observe(node);
    },
    [increasePageNumber, loading, hasMore]
  );

  return (
    <>
      <div>
        <div>{loading && "Loading..."}</div>
        <div>{error && "Error"}</div>
        {loadedBlocks[0] &&
          loadedBlocks[0].map((item, index) => {
            if (0 === index) {
              return (
                <div key={item} ref={topItemRef} style={{ height: "120px" }}>
                  {item}
                </div>
              );
            } else {
              return (
                <div key={item} style={{ height: "120px" }}>
                  {item}
                </div>
              );
            }
          })}
        {loadedBlocks[1] &&
          loadedBlocks[1].map((item, index) => {
            if (loadedBlocks[1].length === index + 1) {
              return (
                <div key={item} ref={bottomItemRef} style={{ height: "130px" }}>
                  {item}
                </div>
              );
            } else if (index === 0) {
              return (
                <div
                  key={item}
                  ref={scrollPointBottom}
                  style={{ height: "130px" }}
                >
                  {item}
                </div>
              );
            } else {
              return (
                <div key={item} style={{ height: "130px" }}>
                  {item}
                </div>
              );
            }
          })}
        <div>{loading && "Loading..."}</div>
        <div>{error && "Error"}</div>
      </div>
    </>
  );
}
