import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../Common/IconBtn";
import { FaFileUpload } from "react-icons/fa";
import { useUpdateAvatarMutation } from "../../../Services/Operation/authApi";
import toast from "react-hot-toast";
import { setuser } from "../../../Slice/AuthSlice";

const ChangeProfilePicture = () => {
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const [UpdateAvatar] = useUpdateAvatarMutation();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewSource, setPreviewSource] = useState<string | ArrayBuffer | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
      previewFile(file);
    }
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleFileUpload = async () => {
    console.log("hi")
    if (!imageFile) return ;
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("avatar", imageFile);
      // console.log("fromdata from updatedabar",formData);
      const result = await UpdateAvatar(formData).unwrap();
      // console.log("updatedavatar",result);
      if (result.success) {
        dispatch(setuser(result.data));
        toast.success("Your Profile Updated Successfully");
      }
    } catch (error: any) {
      console.error("ERROR MESSAGE - ", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile);
    }
  }, [imageFile]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-4 sm:p-8 text-richblack-5">
      <div className="sm:flex sm:items-center flex-wrap md:gap-4 sm:gap-2">
        <img
          src={previewSource || user?.avatar?.avatar_url}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-16 sm:w-24 rounded-full object-cover"
        />
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          <p className="text-sm sm:text-base">Change Profile Picture</p>
          <div className="flex flex-row gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/gif, image/jpeg"
            />
            <button
              onClick={handleClick}
              disabled={loading}
              className="cursor-pointer rounded-md bg-richblack-700 py-2 px-4 sm:px-6 font-semibold text-richblack-50 text-sm sm:text-base"
            >
              Select
            </button>
            <IconBtn text={loading ? "Uploading..." : "Upload"} onclick={handleFileUpload}>
              {!loading && <FaFileUpload className="text-lg sm:text-xl text-richblack-900" />}
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePicture;
