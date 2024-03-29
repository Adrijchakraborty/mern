import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../Firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice.js";
import { useDispatch } from 'react-redux';

const Profile = () => {
  const { currentUser,loading,error } = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [value, setValue] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);


  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
      setTimeout(myGreeting, 20000);
    }
  }, [file]);


  function myGreeting() {
    setValue(true)
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
      </form>
      <div className='capitalize flex justify-between my-2'>
        <span className='text-red-700'>delete account</span>
        <span className='text-red-700'>sign out</span>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
    </div>
  )
}

export default Profile