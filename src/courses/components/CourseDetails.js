import React, { useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-context';
import { FormData } from '../formData/FormData';
import Card from '../../shared/components/UIElements/Card';
import './CourseDetails.css';

const formData = new FormData();
const formFields = formData.formFields;

const CourseDetails = props => {
  const auth = useContext(AuthContext);

  const renderItems = formFields.map((field, index) => {
    let fieldId;
    if (field.alias) {
      fieldId = field.alias;
    } else {
      fieldId = field.id;
    }

    let fieldLabel = field.label;
    let fieldValue = props.course[fieldId];
    let fieldValueClass = null;
    if (auth.isAdmin || field.isPublic || auth.userId === props.course['creator']) {
      if (field.type === "date") {
        fieldValue = fieldValue.split('T', 1);
        console.log(fieldValue);
        if (fieldValue[0] === "1970-01-01") {
          fieldValue = null;
        }
      }
    } else {
      fieldLabel = null;
      fieldValue = null;
    }

    if (fieldLabel && !fieldValue) {
      fieldValue = 'Empty';
      fieldValueClass = 'course-details--italic';
    }

    return <React.Fragment key={index}>
      <div className="course-details--field" key={index}>
        <p className="course-details--label">{fieldLabel} </p>
        <p className={`course-details--value ${fieldValueClass}`}>{fieldValue} </p>
        {/* {field.id === "n" && <p className="course-details--value">{props.course["purchaseSequence"]} </p>}
      {field.id !== "n" && <p className="course-details--value">{props.course[field.id]} </p>} */}
      </div>
    </React.Fragment>;
  }
  );

  return (

    <Card className="course-details">

      {/* {auth.userId === props.course.creator && (
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
        } */}
      {/*
        {formFields.map(field => {
          <p> {field.id} </p>;
        })} */}

      {renderItems}

    </Card>
  );
};

export default CourseDetails;
