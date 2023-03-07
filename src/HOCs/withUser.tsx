import { RoleUser } from 'constant/head-table';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_PROFILE } from 'service/auth';
import { useQuery } from 'urql';
// Take in a component as argument WrappedComponent
const withUser = (WrappedComponent: any) => {
  return (props) => {
    const [role, setRole] = useState();
    const [profile, getProfile] = useQuery({ query: GET_PROFILE, requestPolicy: 'network-only' });
    useEffect(() => {
      getProfile();
    }, []);

    useEffect(() => {
      if (profile.data) {
        setRole(profile.data?.me?.roleObj?.code);
      }
    }, [profile]);

    return <WrappedComponent role={role} profileUser={profile.data?.me ?? null} {...props} />;
  };
};
export default withUser;
