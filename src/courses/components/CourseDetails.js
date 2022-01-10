import React, { useContext, useEffect, useState, useRef } from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { CourseMetadata } from '../metadata/CourseMetadata';
import Card from '../../shared/components/UIElements/Card';
import './CourseDetails.css';

const CourseDetails = props => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [apiMetadata, setApiMetadata] = useState();
  const [formData,] = useState(new CourseMetadata());
  // eslint-disable-next-line
  const [redo, setRedo] = useState(false);

  const renderItems = useRef([]);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://localhost';
  const backendPort = process.env.REACT_APP_BACKEND_PORT_C || 3002;

  // get course metadata from backend
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // console.log('CourseDetails: fetchMetadata: Fetching metadata...');
        const responseData = await sendRequest(`${backendUrl}:${backendPort}/getMetadata`);
        setApiMetadata(responseData.metadata);
      } catch (err) {
        console.log('CourseDetails: fetchMetadata: Error fetching metadata');
        console.log(err.message);
      }
    };
    fetchMetadata();
  }, [sendRequest, backendPort, backendUrl]);

  // update formData object when metadata changes
  useEffect(() => {
    if (apiMetadata) {
      // console.log('CourseDetails: useEffect formData: Updating full metadata...');
      formData.metadata = apiMetadata;
      setRedo(true);
    }
    // eslint-disable-next-line
  }, [apiMetadata]);

  // update renderItems when metadata changes
  useEffect(() => {
    if (formData.metadata && formData.metadata.length > 0) {
      renderItems.current = formData.metadata.map((field, index) => {
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
            if (fieldValue[0] === "1970-01-01") {
              fieldValue = null;
            }
          }
        } else {
          fieldLabel = null;
          fieldValue = null;
        }

        if (fieldLabel && field.isScrollable) {
          fieldValueClass = 'course-details--scrollbar';
        }
        if (fieldLabel && !fieldValue) {
          fieldValue = 'Empty';
          fieldValueClass = 'course-details--italic';
        }

        return <React.Fragment key={index}>
          <div className="course-details--container" key={index}>
            <p className="course-details--label">{fieldLabel} </p>
            <p className={`course-details--value ${fieldValueClass}`}>{fieldValue} </p>
          </div>
        </React.Fragment>;
      }
      );
      setRedo(false);
    }
  }, [formData.metadata, auth.isAdmin, auth.userId, props.course]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Card className="course-details">
        {renderItems.current}
      </Card>
    </React.Fragment>
  );
};

export default CourseDetails;
