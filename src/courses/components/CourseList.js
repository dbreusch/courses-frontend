import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import CourseItem from './CourseItem';
import './CourseList.css';

const CourseList = props => {
  if (props.items.length === 0) {
    if (props.userId === props.authUserId) {
      return (
        <div className="place-list center">
          <Card>
            <h2>No places found. Maybe create one?</h2>
            <Button to="/places/new">Share Place</Button>
          </Card>
        </div>
      );
    } else {
      return (
        <div className="place-list center">
          <Card>
            <h2>No places found. Login to create one.</h2>
            <Button to="/">Return</Button>
          </Card>
        </div>
      );
    }
  }

  return (
    <ul className="place-list">
      {props.items.map(place => (
        <CourseItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default CourseList;
