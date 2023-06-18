import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const UploadPage = ({ isUploading, isImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  const handleImageUpload = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    isImageUpload(true);
    // Create FormData object to send the image file
    const formData = new FormData();
    formData.append("image", selectedImage);

    let param = {};

    if (selectedOption === "aspect_r") {
      param["aspect_r"] = 258;
    } else {
      param[selectedOption] = selectedOption;
    }

    const fileName = selectedImage.name;
    // Make the POST request to the endpoint
    try {
      await axios
        .post(
          "https://vbmo8wkj25.execute-api.us-west-2.amazonaws.com/dev/upload",
          formData,
          {
            params: param,
            headers: {
              compress: 3,
              "file-name": fileName,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          debugger;
          toast("File uploaded successfully!");
          isImageUpload(false);
          setSelectedImage(null);
          setSelectedOption("");
        })
        .catch((error) => {
          isImageUpload(false);
          toast("Error");
          // your error handling goes here
        });
    } catch (error) {
      console.error("Upload failed!", error);
    }
  };

  return (
    <div>
      <h1>Image Upload</h1>
      <form onSubmit={handleSubmit}>
        <ToastContainer />
        <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">
          <div className="flex flex-col items-start">
            <div>
              <p className="text-white text-[22px] font-bold">
                Upload Image to S3
              </p>
            </div>
            <div className="mt-5">
              <div className="block mb-6">
                <div className="flex">
                  <label className="text-white">
                    <input
                      className="mr-2"
                      type="radio"
                      value="compression"
                      checked={selectedOption === "compression"}
                      onChange={handleOptionChange}
                    />
                    Compression
                  </label>
                </div>
                <div className="flex">
                  <label className="text-white ">
                    <input
                      className="mr-2"
                      type="radio"
                      value="aspect_ratio"
                      checked={selectedOption === "aspect_ratio"}
                      onChange={handleOptionChange}
                    />
                    Aspect Ratio
                  </label>
                </div>
                <div className="flex">
                  <label className="text-white">
                    <input
                      className="mr-2"
                      type="radio"
                      value="grey_scale"
                      checked={selectedOption === "grey_scale"}
                      onChange={handleOptionChange}
                    />
                    Grey Scale
                  </label>
                </div>
                <div className="flex">
                  <label className="text-white">
                    <input
                      className="mr-2"
                      type="radio"
                      value="image_recognition"
                      checked={selectedOption === "image_recognition"}
                      onChange={handleOptionChange}
                    />
                    Image Recognition
                  </label>
                </div>
              </div>

              <input
                className="text-white"
                type="file"
                onChange={handleImageUpload}
              />
              <button
                disabled={isUploading}
                type="submit"
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;

// import React, { useState } from "react";
// import AWS from "aws-sdk";
// import { toast, ToastContainer } from "react-toastify";
// import LoadingOverlay from "react-loading-overlay";
//
// const S3ImageUploader = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//
//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };
//
//   const handleFileUpload = () => {
//     if (selectedFile) {
//       setIsUploading(true);
//       const fileName = selectedFile.name;
//       const fileExtension = fileName.split(".").pop();
//       // const params = {
//       //   Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
//       //   Key: `${Date.now()}.${fileExtension}`,
//       //   Body: selectedFile,
//       //   ACL: "public-read",
//       // };
//       // // Upload the file to S3
//       // s3.upload(params, (err, data) => {
//       //   setIsUploading(false);
//       //   if (err) {
//       //     console.log(err);
//       //   } else {
//       //     setSelectedFile(null);
//       //     toast("File uploaded successfully!");
//       //     console.log("File uploaded successfully:", data.Location);
//       //     // Perform any additional actions after successful upload
//       //   }
//       // });
//     }
//   };
//
//   return (
//     <LoadingOverlay active={isUploading} spinner text="Uploading ...">
//       <ToastContainer />
//       <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">
//         <div className="flex flex-col items-start">
//           <div>
//             <p className="text-white text-[22px] font-bold">
//               Upload Image to S3
//             </p>
//           </div>
//           <div className="mt-5">
//             <input
//               className="text-white"
//               type="file"
//               onChange={handleFileChange}
//             />
//             <button
//               disabled={isUploading}
//               onClick={handleFileUpload}
//               type="button"
//               className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
//             >
//               Upload
//             </button>
//           </div>
//         </div>
//       </div>
//     </LoadingOverlay>
//   );
// };
//
// export default S3ImageUploader;
