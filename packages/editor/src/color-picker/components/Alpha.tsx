import { useState } from "react";

import { Interactive, Interaction } from "./Interactive";
import { HsvaColor } from "../types";
import { clamp } from "../utils/clamp";
import { HuePointer } from "./HuePointer";
import { hsv2hslString } from "../utils";

interface Props {
  hsva: HsvaColor;
  onChange: (newAlpha: { a: number }) => void;
}

const Alpha = ({ hsva, onChange }: Props): JSX.Element => {
  const [isMoving, setIsMoving] = useState(false);
  const handleMoveStart = () => {
    setIsMoving(true);
  };
  const handleMoveEnd = () => {
    setIsMoving(false);
  };
  const handleMove = (interaction: Interaction) => {
    onChange({ a: interaction.left });
  };

  const handleKey = (offset: Interaction) => {
    // Alpha always fit into [0, 1] range
    onChange({ a: clamp(hsva.a + offset.left) });
  };

  // We use `Object.assign` instead of the spread operator
  // to prevent adding the polyfill (about 150 bytes gzipped)
  const colorFrom = hsv2hslString(Object.assign({}, hsva, { a: 0 }));
  const colorTo = hsv2hslString(Object.assign({}, hsva, { a: 1 }));
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
  };

  return (
    <div
      css={{
        position: "relative",
        backgroundImage:
          "linear-gradient(-45deg,rgba(57,76,96,.15) 25%,transparent 25%,transparent 75%,rgba(57,76,96,.15) 75%),linear-gradient(-45deg,rgba(57,76,96,.15) 25%,transparent 25%,transparent 75%,rgba(57,76,96,.15) 75%)",
        backgroundSize: "8px 8px",
        backgroundPosition: "0  0, 4px 4px",
        backgroundColor: "#fff",
        boxShadow: "inset 0 0 0 1px rgba(57,76,96,.15)",
        cursor: "pointer",
        borderRadius: 6,
      }}
    >
      <div
        css={{
          borderRadius: 6,
          height: 12,
          background:
            "linear-gradient(90deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)",
        }}
        style={gradientStyle}
      >
        <Interactive
          onMoveStart={handleMoveStart}
          onMoveEnd={handleMoveEnd}
          onMove={handleMove}
          onKey={handleKey}
        >
          <HuePointer
            style={{
              width: isMoving ? 12 : 8,
              height: isMoving ? 12 : 8,
              ":hover": {
                width: 12,
                height: 12,
              },
            }}
            left={hsva.a}
          />
        </Interactive>
      </div>
    </div>
  );
};

export default Alpha;
