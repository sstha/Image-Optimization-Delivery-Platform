import { useState } from "react";
import S3PhotoGallery from "./S3PhotoGallery";
import S3ImageUploader from "./S3ImageUploader";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import "./App.css";

function App() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="App">
      <LoadingOverlay active={isUploading} spinner text="Uploading ...">
        <BrowserRouter>
          <Routes>
            <Route>
              <Route path="/" element={<S3PhotoGallery />} />
              <Route
                path="upload"
                element={
                  <S3ImageUploader
                    isUploading={isUploading}
                    isImageUpload={(isUpload) => {
                      setIsUploading(isUpload);
                    }}
                  />
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </LoadingOverlay>
    </div>
  );
}

export default App;
