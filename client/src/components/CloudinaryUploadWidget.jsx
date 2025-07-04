import { useEffect, useRef } from "react";

const CloudinaryUploadWidget = ({ uwConfig, setState }) => {
  const uploadWidgetRef = useRef(null);
  const uploadButtonRef = useRef(null);

  useEffect(() => {
    const initializeUploadWidget = () => {
      if (window.cloudinary && uploadButtonRef.current) {
        // Create upload widget
        uploadWidgetRef.current = window.cloudinary.createUploadWidget(
          uwConfig,
          (error, result) => {
            if (!error && result && result.event === "success") {
              // console.log("Upload successful:", result.info);
              setState(result.info.secure_url);
            }
          }
        );

        // Add click event to open widget
        const handleUploadClick = () => {
          if (uploadWidgetRef.current) {
            uploadWidgetRef.current.open();
          }
        };

        const buttonElement = uploadButtonRef.current;
        buttonElement.addEventListener("click", handleUploadClick);

        // Cleanup
        return () => {
          buttonElement.removeEventListener("click", handleUploadClick);
        };
      }
    };

    initializeUploadWidget();
  }, [uwConfig, setState]);

  return (
    <div
      ref={uploadButtonRef}
      className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer"
    >
      <img src="/upload.png" alt="" className="h-7 w-7 cursor-pointer" />
      <span>Upload a photo</span>
    </div>
  );
};

export default CloudinaryUploadWidget;
