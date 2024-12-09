import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData(); // Corrected capitalization

  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post("/image-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Return the server response
  } catch (error) {
    console.error("Error uploading the image:", error.response?.data || error.message);
    throw error; // Re-throw the error for further handling
  }
};

export default uploadImage;
