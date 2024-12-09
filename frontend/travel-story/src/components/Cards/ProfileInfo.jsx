import React from 'react';
import { getInitials } from '../../utils/helper';

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    userInfo && ( 
    <div className='flex items-center gap-3'>
      <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-900 font-medium bg-green-300 hover:bg-green-500'>
        {getInitials(userInfo ? userInfo.fullName : "")}
      </div>
      <div>
        <p className='text-sm font-medium'>{userInfo?.fullName || ""}</p>
        <button className='text-sm text-slate-700 underline ml-4 hover:text-red-500' onClick={onLogout}>
          Log Out
        </button>
      </div>
    </div>
    )
  );
};

export default ProfileInfo;
