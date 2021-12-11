// manage the Users
// gets list of users from the backend, passes it to UsersList
// handles network errors with ErrorModal
import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  // const backendUrl = 'https://localhost:3001';
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://localhost';
  const backendPort = process.env.REACT_APP_BACKEND_PORT || 3001;

  // convoluted syntax below is because useEffect "does not want" a function that
  // returns a promise (i.e., async functions).  but it's ok to define an "ief"
  // (immediately executed function) that is defined as async, then call it in the
  // useEffect function.
  useEffect(() => {
    // console.log('Users useEffect');
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(`${backendUrl}:${backendPort}`);
        setLoadedUsers(responseData.users);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchUsers();
  }, [sendRequest, backendPort, backendUrl]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
