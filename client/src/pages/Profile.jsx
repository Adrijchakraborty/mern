import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../Firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserSuccess, deleteUserStart, signOutUserStart } from "../redux/user/userSlice.js";
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { currentUser, loading, error } = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [value, setValue] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListings, setShowListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);



  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
      setTimeout(myGreeting, 15000);
    }
  }, [file]);
  useEffect(() => {
    setTimeout(Hide, 20000);
  }, [updateSuccess]);


  function myGreeting() {
    setValue(true)
  }
  function Hide() {
    setUpdateSuccess(false)
  }



  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
        setValue(false);
        setFileUploadError(false);
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  //console.log(formData)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {

    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  }

  const handleShowListing = async()=>{
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false) {
        setShowListingsError(true);
      }
      setShowListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
    console.log(showListings);
  }

  const handleListingDelete = async(id) => { 
    try {
      const res = await fetch(`/api/listing/delete/${id}`,{
        method: 'DELETE'
      });

      const data = res.json();
      if(data.success===false) {
        console.log(data.message);
      }
      setShowListings((prev)=>
      prev.filter(item=>item._id!==id)
    );

    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className='mt-[4rem] sm:mt-[5rem] max-w-lg mx-auto px-3 sm:px-0'>
      <h1 className='text-center text-3xl font-semi-bold my-5'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span hidden={value} className=''>Image successfully uploaded!</span>
          ) : (
            ''
          )}

        </p>
        <input
          defaultValue={currentUser.username}
          type="text"
          placeholder='username'
          id='username'
          onChange={handleChange}
          className='p-3 rounded-lg' />
        <input
          defaultValue={currentUser.email}
          type="email"
          placeholder='email'
          id='email'
          onChange={handleChange}
          className='p-3 rounded-lg' />
        <input
          type="password"
          placeholder='password'
          id='password'
          onChange={handleChange}
          className='p-3 rounded-lg' />
        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-85'>{loading ? "Loading..." : "update"}</button>
          <Link to={"/createlisting"} className='uppercase bg-green-600 rounded-lg text-center p-3 text-white hover:opacity-95 disabled:opacity-85'>Create Listing</Link>
      </form>
      <div className='capitalize flex justify-between my-2'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>delete account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>sign out</span>
      </div>

      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <div><button onClick={handleShowListing} className='text-green-700 w-full mb-3'>Show Listings</button></div>
      <p hidden={value} className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-red-700 mt-5'>{showListingsError ? "Error Showing listing" : ""}</p>

      {(showListings && showListings.length > 0) && (
    showListings.map((listing) => (
        <div
            key={listing._id}
            className='border rounded-lg p-3 flex justify-between items-center gap-4'
        >
            <Link to={`/listing/${listing._id}`}>
                <img
                    src={listing.imageUrls.length > 0 ? listing.imageUrls[0] : ''}
                    alt='listing cover'
                    className='h-16 w-16 object-contain'
                />
            </Link>
            <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
            >
                <p>{listing.name}</p>
            </Link>

            <div className='flex flex-col item-center'>
                <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                <Link to={`/updatelisting/${listing._id}`}>
                <button className='text-green-700 uppercase'>Edit</button>
                </Link>
            </div>
        </div>
    ))
)}

    </div>
  )
}

export default Profile