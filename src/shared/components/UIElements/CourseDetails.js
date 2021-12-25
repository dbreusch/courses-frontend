import React, { useContext } from 'react';
import { AuthContext } from '../../context/auth-context';

import Card from './Card';
import './CourseDetails.css';

const CourseDetails = props => {
  const auth = useContext(AuthContext);

  return (
    <Card className="course-details">
      {auth.userId === props.creatorId && (
        <h1>
          All creator details available!
        </h1>
      )
      }
      {auth.isAdmin && (
        <h1>
          All admin details available!
        </h1>
      )
      }
      <h1>
        Regular course details here!
      </h1>
    </Card>
  );
};

export default CourseDetails;
