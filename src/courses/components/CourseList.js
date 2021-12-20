import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import CourseItem from './CourseItem';
import './CourseList.css';

const CourseList = props => {
  if (props.items.length === 0) {
    if (props.userId === props.authUserId) {
      return (
        <div className="course-list center">
          <Card>
            <h2>No courses found. Maybe create one?</h2>
            <Button to="/courses/new">Add Course</Button>
          </Card>
        </div>
      );
    } else {
      return (
        <div className="course-list center">
          <Card>
            <h2>No courses found. Login to create one.</h2>
            <Button to="/">Return</Button>
          </Card>
        </div>
      );
    }
  }

  return (
    <ul className="course-list">
      {props.items.map(course => (
        <CourseItem
          key={course.id}
          id={course.id}
          title={course.title}
          instructor={course.instructor}
          description={course.description}
          creatorId={course.creator}
          onDelete={props.onDeleteCourse}
        />
      ))}
    </ul>
  );
};

export default CourseList;
