import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdDateRange } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { ToastContainer, toast } from "react-toastify";
import ReactModal from "react-modal";
import "react-toastify/dist/ReactToastify.css";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/Cards/EmptyCard";
import EmptyImg from "../../assets/images/add-story.svg";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import { getEmptyCardImg, getEmptyCardMessage } from "../../utils/helper";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState({from:null, to:null});

  const [openAddEditModal, setAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("Error Occurred!");
    }
  };

  //handle edit story click
  const handleEdit = (data) => {
    setAddEditModal({ isShown: true, type: "edit", data: data });
  };

  //handle travel story click
  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  //handle update favourite
  const updateIsFavourite = async (storyData) => {
    if (!storyData?._id) {
      console.error("Story ID is missing!");
      toast.error("Unable to update the story. Invalid story data.");
      return;
    }

    const storyId = storyData._id;

    try {
      // Send request to update the favorite status
      const response = await axiosInstance.put(
        `/update-is-favourite/${storyId}`,
        {
          isFavourite: !storyData.isFavourite,
        }
      );

      if (response.data?.story) {
        toast.success("Story Updated Successfully!");

        if(filterType === "search" && searchQuery){
          onSearchStory(searchQuery);
        }
        else if(filterType==="date"){
          filterStoriesByDate(dateRange);
        }else{
          getAllTravelStories();
        }
         // Refresh the story list
      } else {
        console.error("Failed to update the story's favorite status!");
        toast.error("Failed to update the story. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while updating the story!";
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  };

  //delete Story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId);

      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again!");
    }
  };

  //search story
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query,
        },
      });

      if(response.data && response.data.stories){
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again!");
    }
  };

  //clear search
  const handleClearSearch = async () => {
    setFilterType("");
    getAllTravelStories();
  };

  //handle filter story by date range
  const filterStoriesByDate = async (day) => {
    try {
      // Parse startDate and endDate from the provided day range
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;
  
      // Validate startDate and endDate
      if (!startDate || !endDate) {
        console.error("Invalid date range. Both 'from' and 'to' dates are required.");
        return;
      }
  
      // Make API call to filter travel stories
      const response = await axiosInstance.get("/travel-stories/filter", {
        params: { startDate, endDate },
      });
  
      // Validate API response and update state
      if (response.data && Array.isArray(response.data.stories)) {
        setFilterType("date"); // Update filter type
        setAllStories(response.data.stories); // Update stories with filtered data
      } else {
        console.warn("Unexpected API response format:", response.data);
      }
    } catch (error) {
      // Log detailed error for debugging
      if (error.response) {
        console.error("API Error:", error.response.data.message);
      } else {
        console.error("An unexpected error occurred:", error.message);
      }
    }
  };
  
  //handle date range select
  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  };
  //resest after not selecting any date
  const resetFilter = () =>{
    setDateRange({ from: null, to: null });
    setFilterType("");
    getAllTravelStories();
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();

    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto px-5 py-5 pt-10 ">

        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={() => resetFilter()}
        />  

        <div className="flex flex-wrap gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imgUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={item.isFavourite}
                    onEdit={() => handleEdit(item)}
                    onClick={() => handleViewStory(item)}
                    onFavouriteClick={() => updateIsFavourite(item)}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard
                imgSrc={getEmptyCardImg(filterType)}
                message={getEmptyCardMessage(filterType)}
              />
            )}
          </div>
          <div className="w-full md:w-[340px] hidden md:block">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-2">
                <DayPicker 
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReactModal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => setAddEditModal({ isShown: false, type: "add", data: null })}
          getAllTravelStories={getAllTravelStories}
        />
      </ReactModal>

      <ReactModal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => deleteTravelStory(openViewModal.data || null)}
        />
      </ReactModal>

      <button
        className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-5 bottom-5 sm:right-10 sm:bottom-10"
        onClick={() => setAddEditModal({ isShown: true, type: "add", data: null })}
      >
        <MdAdd className="text-[28px] sm:text-[32px] text-white" />
      </button>
      <ToastContainer />
    </>
  );
};

export default Home;