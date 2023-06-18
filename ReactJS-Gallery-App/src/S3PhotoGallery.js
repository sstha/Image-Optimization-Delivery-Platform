import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
import Select from "react-select";

const options = [
  { value: "cat", label: "Cat" },
  { value: "dog", label: "Dog" },
  { value: "rabbit", label: "Rabbit" },
];

const S3PhotoGallery = () => {
  const [images, setImages] = useState([]);
  const [paginatedImages, setPaginatedImages] = useState([]);
  const [pageSize, setPageSize] = useState(12);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isTagSelected, setIsTagSelected] = useState(false);

  useEffect(() => {
    // Initialize AWS SDK

    AWS.config.update({
      region: process.env.REACT_APP_AWS_REGION,
      credentials: new AWS.Credentials(
        process.env.REACT_APP_AWS_ACCESS_KEY,
        process.env.REACT_APP_AWS_SECRET_KEY
      ),
    });

    // Create S3 service object
    const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

    // Set your S3 bucket name
    const bucketName = process.env.REACT_APP_S3_BUCKET_NAME;
    // Get all objects in the bucket
    s3.listObjectsV2({ Bucket: bucketName }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const imagesList = data.Contents.map((item) => ({
          url: `https://d24ubxbc8hmbxr.cloudfront.net/${item.Key}`,
          tags: item.Tags, // Assuming the image objects have a 'Tags' property
        }));
        let newArray = imagesList.slice(0, pageSize);
        setPaginatedImages(newArray);
        setImages(imagesList);
        setFilteredImages(imagesList);
      }
    });
  }, [pageSize]);

  const handleTagChange = (userSelectedOption) => {
    if (!userSelectedOption) {
      setIsTagSelected(false);
      console.log(paginatedImages);
    } else {
      setIsTagSelected(true);
    }

    const tag = userSelectedOption?.value;
    setSelectedOption(userSelectedOption);
    if (tag === "") {
      setFilteredImages(images);
    } else {
      const filtered = images.filter((image) => image.url.includes(tag));
      setFilteredImages(filtered);
    }
  };

  const loadMoreImages = () => {
    let PS = pageSize + 9;
    setPageSize(PS);
    let newArray = images.slice(0, PS);
    setPaginatedImages(newArray);
  };

  return (
    <div>
      <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">
        <div className="mb-8">
          <Select
            isClearable={true}
            isSearchable={false}
            placeholder="Select Tag"
            value={selectedOption}
            onChange={handleTagChange}
            options={options}
            classNames={{
              singleValue: () => " !text-[#9ca3af]",
              placeholder: () => "!text-[#9ca3af] !text-[16px]",
              container: (state) => "!m-0",
              control: (state) =>
                "!bg-[#1e2635] !h-[48px] !border-none !rounded-full !outline-none !shadow-none",
            }}
          />
        </div>
        <div className="-m-1 flex flex-wrap md:-m-2">
          {!isTagSelected &&
            paginatedImages.map((image, index) => (
              <div key={index} className="flex w-1/4 flex-wrap">
                <div className="w-full p-1 md:p-2">
                  <img
                    alt={"images"}
                    key={image.url}
                    src={image.url}
                    className="block h-[256px] w-[256px] rounded-lg object-cover object-center"
                  />
                </div>
              </div>
            ))}

          {isTagSelected &&
            filteredImages.map((image, index) => (
              <div key={index} className="flex w-1/4 flex-wrap">
                <div className="w-full p-1 md:p-2">
                  <img
                    alt={"images"}
                    key={image.url}
                    src={image.url}
                    className="block h-[256px] w-[256px] rounded-lg object-cover object-center"
                  />
                </div>
              </div>
            ))}
        </div>

        {!isTagSelected && paginatedImages.length !== images.length && (
          <button
            onClick={loadMoreImages}
            type="button"
            className="w-full mt-6 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Load More Images
          </button>
        )}
      </div>
    </div>
  );
};

export default S3PhotoGallery;
