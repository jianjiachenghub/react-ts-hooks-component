import React from "react";
import useVirtualList from "./ahooks/useVirtualList";

export default () => {
  const { list, containerProps, wrapperProps } = useVirtualList(
    Array.from(Array(50).keys()),
    {
      overscan: 10,
      itemHeight: 60,
    }
  );
  return (
    <>
      <div {...containerProps} style={{ height: "600px", overflow: "auto" }}>
        <div {...wrapperProps}>
          {list.map((ele: any) => (
            <div
              style={{
                height: 52,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #e8e8e8",
                marginBottom: 8,
              }}
              key={ele.index}
            >
              Row: {ele.data}
            </div>
          ))}
        </div>
      </div>

    </>
  );
};
