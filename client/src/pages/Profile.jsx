import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../Firebase';

const Profile = () => {
  const { currentUser } = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [value, setValue] = useState(false);

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
      setTimeout(myGreeting, 20000);
    }
  }, [file]);


  function myGreeting() {
    setValue(true)
  }

  //console.log(myTimeout);


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
  return (
    <div className='mt-[4rem] sm:mt-[5rem] max-w-lg mx-auto px-3 sm:px-0'>
      <h1 className='text-center text-3xl font-semi-bold my-5'>Profile</h1>
      <form className='flex flex-col gap-4'>
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

          {/* {console.log(fileUploadError)} */}
        </p>
        <input type="text" placeholder='username' className='p-3 rounded-lg' />
        <input type="email" placeholder='email' className='p-3 rounded-lg' />
        <input type="password" placeholder='password' className='p-3 rounded-lg' />
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-85'>update</button>
      </form>
      <div className='capitalize flex justify-between my-2'>
        <span className='text-red-700'>delete account</span>
        <span className='text-red-700'>sign out</span>
      </div>
    </div>
  )
}

export default Profile