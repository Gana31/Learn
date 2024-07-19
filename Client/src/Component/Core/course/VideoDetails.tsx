import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { useLocation } from "react-router-dom";
import IconBtn from "../../Common/IconBtn";
import { updateCompletedLectures } from "../../../Slice/ViewCourseSlice";
import { useUpdateCourseProgressMutation } from "../../../Services/Operation/authApi";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef<ReactPlayer | null>(null);
  const dispatch = useDispatch();
  const { courseSectionData, courseEntireData, completedLectures } = useSelector((state: any) => state.viewCourse);

  const [videoData, setVideoData] = useState<any>(null);
  const [previewSource, setPreviewSource] = useState<any>("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateCourseProgress] = useUpdateCourseProgressMutation();

  useEffect(() => {
    if (!courseSectionData.length) return;
    if (!courseId || !sectionId || !subSectionId) {
      navigate(`/dashboard/enrolled-courses`);
    } else {
      const filteredData = courseSectionData.find((course: any) => course._id === sectionId);
      if (!filteredData) return;

      const filteredVideoData = filteredData.subSection.find((data: any) => data._id === subSectionId);
      if (!filteredVideoData) return;

      setVideoData(filteredVideoData);
      setPreviewSource(courseEntireData.thumbnail.url);
      setVideoEnded(false);
    }
  }, [courseSectionData, courseEntireData, location.pathname, courseId, sectionId, subSectionId, navigate]);

  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex((data: any) => data._id === sectionId);
    const currentSubSectionIndx = courseSectionData[currentSectionIndx].subSection.findIndex((data: any) => data._id === subSectionId);
    return currentSectionIndx === 0 && currentSubSectionIndx === 0;
  };

  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex((data: any) => data._id === sectionId);
    const currentSubSectionIndx = courseSectionData[currentSectionIndx].subSection.findIndex((data: any) => data._id === subSectionId);

    if (currentSubSectionIndx !== -1 && currentSubSectionIndx < courseSectionData[currentSectionIndx].subSection.length - 1) {
      const nextSubSectionId = courseSectionData[currentSectionIndx].subSection[currentSubSectionIndx + 1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
    } else if (currentSectionIndx < courseSectionData.length - 1) {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id;
      const nextSubSectionId = courseSectionData[currentSectionIndx + 1].subSection[0]._id;
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
    }
  };

  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex((data: any) => data._id === sectionId);
    const currentSubSectionIndx = courseSectionData[currentSectionIndx].subSection.findIndex((data: any) => data._id === subSectionId);
    return currentSectionIndx === courseSectionData.length - 1 && currentSubSectionIndx === courseSectionData[currentSectionIndx].subSection.length - 1;
  };

  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex((data: any) => data._id === sectionId);
    const currentSubSectionIndx = courseSectionData[currentSectionIndx].subSection.findIndex((data: any) => data._id === subSectionId);

    if (currentSubSectionIndx > 0) {
      const prevSubSectionId = courseSectionData[currentSectionIndx].subSection[currentSubSectionIndx - 1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`);
    } else if (currentSectionIndx > 0) {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id;
      const prevSubSectionId = courseSectionData[currentSectionIndx - 1].subSection[courseSectionData[currentSectionIndx - 1].subSection.length - 1]._id;
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
    }
  };

  const handleLectureCompletion = async () => {
    // console.log("handleLectureCompletion triggered"); // Debugging log
    setLoading(true);
    try {
      const res = await updateCourseProgress({ courseId: courseId, subsectionId: subSectionId });
      // console.log("Lecture completion response:", res); // Debugging log
      if (res) {
        dispatch(updateCompletedLectures(subSectionId));
      }
    } catch (error) {
      console.error("Error updating course progress:", error); // Error log
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <ReactPlayer
          ref={playerRef}
          url={videoData.videoUrl}
          width="100%"
          height="auto"
          playing={!videoEnded}
          controls
          onEnded={() => setVideoEnded(true)}
        />
      )}

      {videoEnded && (
        <div
          style={{
            backgroundImage:
              "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
          }}
          className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
        >
          {!completedLectures.includes(subSectionId) && (
            <IconBtn
              disabled={loading}
              onclick={() => {
                console.log("Button clicked"); // Debugging log
                handleLectureCompletion();
              }}
              text={!loading ? "Mark As Completed" : "Loading..."}
              customClasses="text-xl max-w-max px-4 mx-auto"
            />
          )}
          <IconBtn
            disabled={loading}
            onclick={() => {
              if (playerRef.current) {
                playerRef.current.seekTo(0);
                setVideoEnded(false);
              }
            }}
            text="Rewatch"
            customClasses="text-xl max-w-max px-4 mx-auto mt-2"
          />
          <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
            {!isFirstVideo() && (
              <button
                disabled={loading}
                onClick={goToPrevVideo}
                className="blackButton"
              >
                Prev
              </button>
            )}
            {!isLastVideo() && (
              <button
                disabled={loading}
                onClick={goToNextVideo}
                className="blackButton"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  );
};

export default VideoDetails;
