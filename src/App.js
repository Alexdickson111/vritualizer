/** @format */

import React, { useEffect, useState, useRef, useCallback } from "react";

const PAGE_SIZE = 10;

const generatevirtualizedData = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push(`title ${i}`);
  }
  return data;
};

const getData = (data, page, pageSize = PAGE_SIZE, threshold = 0) => {
  if (page >= 0) {
    return data.slice(
      Math.max(page - 1, 0) * 10,
      Math.min(page + 1, PAGE_SIZE) * 10
    );
  }
};

export default function App() {
  const [prevPageNumber, setPrevPageNumber] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadedBlock, setLoadedBlock] = useState([]);
  const [scrollHeight, setScrollHeight] = useState(0);
  const topItemObserver = useRef();
  const bottomItemObserver = useRef();
  const bottomWaypoint = useRef();
  const topWaypoint = useRef();
  const container = useRef();
  const [virtualizedData, setvirtualizedData] = useState(
    generatevirtualizedData()
  );

  const increasePageNumber = React.useCallback(() => {
    setPrevPageNumber(pageNumber);
    setPageNumber((prevPageNumber) =>
      Math.min(
        prevPageNumber + 1,
        Math.max(Math.floor(virtualizedData.length / PAGE_SIZE) - 1, 0)
      )
    );
  }, [pageNumber]);

  const decreasePageNumber = React.useCallback(() => {
    setPrevPageNumber(pageNumber);
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 0));
  }, [pageNumber]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setHasMore(true);

    setLoadedBlock(getData(virtualizedData, pageNumber));

    setLoading(false);
  }, [pageNumber]);

  const topItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (topItemObserver.current) topItemObserver.current.disconnect();
      container.current.scrollTop = scrollHeight;
      topItemObserver.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setScrollHeight(topWaypoint.current.scrollHeight);
            decreasePageNumber();
          }
        },
        { rootMargin: "-100px" }
      );
      if (node) topItemObserver.current.observe(node);
    },
    [decreasePageNumber, loading]
  );

  const bottomItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (bottomItemObserver.current) bottomItemObserver.current.disconnect();
      container.current.scrollTop = scrollHeight;
      bottomItemObserver.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && true) {
            setScrollHeight(bottomWaypoint.current.scrollHeight);
            increasePageNumber();
          }
        },
        { rootMargin: "-100px" }
      );
      if (node) bottomItemObserver.current.observe(node);
    },
    [increasePageNumber, loading, hasMore]
  );

  console.log(loadedBlock);

  return (
    <>
      <div
        id="parent"
        ref={container}
        style={{ height: "100vh", overflow: "scroll" }}
      >
        <div>{loading && "Loading..."}</div>
        <div>{error && "Error"}</div>
        {loadedBlock &&
          loadedBlock.map((item, index) => {
            if (index === 0) {
              return (
                <div
                  key={item + index}
                  ref={topItemRef}
                  style={{ height: "130px" }}
                >
                  {item}
                </div>
              );
            } else if (index === 2) {
              return (
                <div
                  id="scrollPointStart"
                  key={item + index}
                  ref={topWaypoint}
                  style={{ height: "130px" }}
                >
                  {item}
                </div>
              );
            } else if (index + 2 === loadedBlock.length) {
              return (
                <div
                  id="scrollPointEnd"
                  key={item + index}
                  ref={bottomWaypoint}
                  style={{ height: "130px" }}
                >
                  {item}
                </div>
              );
            } else if (index === loadedBlock.length - 1) {
              return (
                <div
                  key={item + index}
                  ref={bottomItemRef}
                  style={{ height: "130px" }}
                >
                  {item}
                </div>
              );
            } else {
              return (
                <div key={item + index} style={{ height: "130px" }}>
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
