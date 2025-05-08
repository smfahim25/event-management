import React from 'react';
import { ClipLoader } from 'react-spinners';

export const FullScreenLoader = () => (
  <div className="flex justify-center items-center w-full h-full fixed top-0 left-0 bg-black/30 backdrop-blur-xl z-50">
    <ClipLoader size={50} color={"#ffffff"} loading={true} />
  </div>
);
