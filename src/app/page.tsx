import React from "react";
import ThreeSixtyViewer from "../pages/Test/components/ThreeSixtyViewer";
import Tour360Viewer from "../pages/Test/components/Tour360Viewer";

export default function Home() {
  return (
    <main className="flex items-center justfy-center">  
        <ThreeSixtyViewer />
        {/* <Tour360Viewer /> */}
    </main>
  );
}
