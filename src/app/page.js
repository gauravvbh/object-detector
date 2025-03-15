import Image from "next/image";
import ObjectDetectionVid from "./_components/ObjectDetectionVid";
import ObjectDetectionPic from "./_components/ObjectDetectionPic";

export default function Home() {
  return (
    <div className="flex flex-col p-8 ">
      <h1 className="text-3xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter md:px-6 text-center bg-gradient-to-b from-white via-gray-300 to-gray-600 bg-clip-text text-transparent">
        Object Detector Cam
      </h1>
      <ObjectDetectionVid />
      <ObjectDetectionPic />
    </div>
  );
}
