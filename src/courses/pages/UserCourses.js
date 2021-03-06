import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import CourseList from '../components/CourseList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useAuth } from '../../shared/hooks/auth-hook';

const UserCourses = () => {
  const [loadedCourses, setLoadedCourses] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { userId: authUserId } = useAuth();

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://localhost';
  const backendPort = process.env.REACT_APP_BACKEND_PORT_C || 3002;

  const userId = useParams().userId;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const responseData = await sendRequest(`${backendUrl}:${backendPort}`);
        const allCourses = responseData.courses;
        const userCourses = allCourses.filter(course => course.creator === userId);
        setLoadedCourses(userCourses);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchCourses();
  }, [sendRequest, userId, backendUrl, backendPort]);

  const courseDeletedHandler = (deletedCourseId) => {
    setLoadedCourses(prevCourses =>
      prevCourses.filter(course => course.id !== deletedCourseId));
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCourses && (
        <CourseList
          items={loadedCourses}
          onDeleteCourse={courseDeletedHandler}
          userId={userId}
          authUserId={authUserId}
        />
      )}
    </React.Fragment>
  );
};

export default UserCourses;
