import React from "react";

interface HeadingProps {
  title: string;
}

const Heading = (props: HeadingProps) => {
  return (
    <div className="flex p-2 items-center">
      <h1 className="font-bold text-xs">{props.title}</h1>
    </div>
  );
};

export default Heading;
