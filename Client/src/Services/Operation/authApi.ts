import { fetchBaseQuery,createApi, BaseQueryApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../Api";
import axios from "axios";
import { LogOutState, setToken } from "../../Slice/AuthSlice";
import apiClient from "../ApiConnector";
import { resetCart } from "../../Slice/CartSlice";
import { clearUser } from "../../Slice/ProfileSlice";
import { resetCourseState } from "../../Slice/CourseSlice";

axios.defaults.withCredentials = true;
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include' as const,
  prepareHeaders: (headers, { getState } : any) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
 
});



const baseQueryWithReach = async(args : any , api : BaseQueryApi, extraOptions: any) =>{
  let result = await baseQuery(args,api,extraOptions);
  // console.log("result",result)
  if(result.error && result.error.status == "PARSING_ERROR") {
    const refreshResult = await apiClient.get('/refreshToken',{withCredentials:true  as const});
    if(refreshResult.data) {
      // console.log("refresh token ",refreshResult)
      const newaccessToken =refreshResult.data.accessToken;
      await api.dispatch(setToken({accessToken: newaccessToken , user : refreshResult.data.user}));
      localStorage.setItem("accessToken",JSON.stringify(refreshResult.data.accessToken));
      localStorage.setItem("user",JSON.stringify(refreshResult.data.user));

      result = await baseQuery(args,api,extraOptions);

    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      api.dispatch(LogOutState());
      api.dispatch(resetCart());
      api.dispatch(resetCourseState());
      api.dispatch(clearUser());

    }
  }
  return result;
};



export const authApi = createApi({
  reducerPath : "authApi",
  baseQuery : baseQueryWithReach,
  tagTypes: ['User'],
  endpoints : (builder) =>({
    Registration : builder.mutation<any,any>({
      query: (formData) =>({
        url : "/registerUser",
        method : "POST",
        body : formData,
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    Login : builder.mutation<any,any>({
      query: (formData) =>({
        url : "/loginUser",
        method : "POST",
        body : formData,
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    Logout: builder.mutation({
      query: () => ({
        url: "/logoutUser",
        method: "GET",
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    VerifyEmail : builder.mutation<any,any>({
      query: (data) =>({
        url : "/activateUser",
        method : "POST",
        body : data,
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    UpdateAvatar: builder.mutation({
      query: (data) => ({
        url: "/UpadateUserAvatar",
        method: "PUT",
        body : data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    UpdateProfile: builder.mutation({
      query: (data) => ({
        url: "/updateUser",
        method: "PUT",
        body : data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    EnrolledCourse: builder.mutation({
      query: () => ({
        url: "/EnrolledCourses",
        method: "GET",
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    CreateCourse: builder.mutation({
      query: (data) => ({
        url: "/createCourse",
        method: "POST",
        body : data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    EditCourse: builder.mutation({
      query: (data) => ({
        url: "/editCourse",
        method: "POST",
        body : data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    CreateSection: builder.mutation({
      query: (data) => ({
        url: "/Createsection",
        method: "POST",
        body : data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    DeleteSection: builder.mutation({
      query: (data) => ({
        url: "/Deletesection",
        method: "POST",
        body : data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    UpdateSection: builder.mutation({
      query: (data) => ({
        url: "/Updatesection",
        method: "POST",
        body : data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    CreateSubSection: builder.mutation({
      query: (data) => ({
        url: "/CreateSubSection",
        method: "POST",
        body : data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    UpdateSubSection: builder.mutation({
      query: (data) => ({
        url: "/UpdateSubSection",
        method: "POST",
        body : data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    DeleteSubSection: builder.mutation({
      query: (data) => ({
        url: "/DeleteSubSection",
        method: "POST",
        body : data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    GetAllTeacherCourses: builder.query({
      query: () => ({
        url: "/GetAllTeacherCourses",
        method: "GET",
        credentials: 'include',
        providesTags :['User']
      }),
    }),
    GetInstructorCourses: builder.query({
      query: () => ({
        url: "/getInstructorCourses",
        method: "GET",
        credentials: 'include',
        providesTags :['User']
      }),
    }),
    GetFullCourseDetails: builder.mutation({
      query: (data) => ({
        url: "/getFullCourseDetails",
        method: "POST",
        body : data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    DeleteCourse: builder.mutation({
      query: (data) => ({
        url: "/deleteCourse",
        method: "POST",
        body : data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    GetCategoryPageDetails: builder.mutation({
      query: (data) => ({
        url: "/getCategoryPageDetails",
        method: "POST",
        body : data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    GetCourseDetails: builder.mutation({
      query: (data) => ({
        url: "/getCourseDetails",
        method: "POST",
        body : data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    CapturePayment: builder.mutation({
      query: (data) => ({
        url: "/capturePayment",
        method: "POST",
        body : data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    VerifyPayment: builder.mutation({
      query: (bodyData) => ({
        url: '/verifyPayment',
        method: 'POST',
        body: bodyData, 
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    SendPaymentSuccessEmail: builder.mutation({
      query: (data) => ({
        url: '/sendPaymentSuccessEmail',
        method: 'POST',
        body: data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    createRating: builder.mutation({
      query: (data) => ({
        url: '/createRating',
        method: 'POST',
        body: data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    updateCourseProgress: builder.mutation({
      query: (data) => ({
        url: '/updateCourseProgress',
        method: 'POST',
        body: data,
        credentials: 'include',
        providesTags :['User']
      }),
      invalidatesTags: ['User'], 
    }),
    GetAllReview: builder.query({
      query: () => ({
        url: "/getReviews",
        method: "GET",
        credentials: 'include',
        providesTags :['User']
      }),
    }),

    
  })
})

export const {useEnrolledCourseMutation,useCreateSectionMutation,useLoginMutation ,useEditCourseMutation, useRegistrationMutation,
  useDeleteSectionMutation,useUpdateSectionMutation,useCreateSubSectionMutation,useDeleteSubSectionMutation,useUpdateSubSectionMutation,
  useGetAllTeacherCoursesQuery,useGetInstructorCoursesQuery,useGetFullCourseDetailsMutation,useDeleteCourseMutation,
  useGetCategoryPageDetailsMutation,useGetCourseDetailsMutation,useCapturePaymentMutation,useUpdateCourseProgressMutation,
  useVerifyPaymentMutation,useSendPaymentSuccessEmailMutation,useCreateRatingMutation,useGetAllReviewQuery,
  useCreateCourseMutation,useLogoutMutation,useVerifyEmailMutation,useUpdateAvatarMutation,useUpdateProfileMutation} =authApi;














