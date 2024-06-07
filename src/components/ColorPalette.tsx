import React from 'react'

type ColorPaletteProps = {
  hexValues:string[]
}

const ColorPalette = ({ hexValues }:ColorPaletteProps) => {
  return (
    <div className="w-full flex h-5">
      {hexValues.map((hex, index) => (
        <div
          key={index}
          className={`h-5 border`}
          style={{
            backgroundColor: hex,
            width: `${100 / hexValues.length}%`
          }}
        />
      ))}
    </div>
  );
};

export default ColorPalette