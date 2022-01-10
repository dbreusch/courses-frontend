import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { CourseMetadata } from '../formData/CourseMetadata';
import './CourseForm.css';

// let formData = new CourseMetadata();
// let formMetaData = formData.formMetaData;
// let formInput = formData.formInput;
// let formMetaData = [];
// let formInput = {};

const NewCourse = () => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const history = useHistory();

  const [fullMetadata, setFullMetadata] = useState();
  const [formData, ] = useState(new CourseMetadata());
  const [formInput, setFormInput] = useState({});

  const [formState, inputHandler] = useForm(
    formInput,
    false
  );

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://localhost';
  const backendPort = process.env.REACT_APP_BACKEND_PORT_C || 3002;

  // get course metadata from backend
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // console.log('Fetching metadata...');
        const responseData = await sendRequest(`${backendUrl}:${backendPort}/getMetadata`);
        setFullMetadata(responseData.metadata);
      } catch (err) {
        console.log('Error fetching metadata');
        console.log(err.message);
      }
    };
    fetchMetadata();
  }, [sendRequest, backendPort, backendUrl]);

  // update formData object when metadata changes
  useEffect(() => {
    if (fullMetadata) {
      // console.log('Updating full metadata...');
      formData.fullMetadata = fullMetadata;
    }
  // eslint-disable-next-line
  }, [fullMetadata]);

  // update formInput when metadata changes
  useEffect(() => {
    // console.log('Updating form input...');
    setFormInput(formData.formInput);
  // eslint-disable-next-line
  }, [fullMetadata]);

  const courseSubmitHandler = async event => {
    event.preventDefault();

    // Note: that the purchaseSequence field is being referred to as "n" is an artifact
    // of support for loading courses from an Excel spreadsheet, where this is the
    // column title
    try {
      await sendRequest(
        `${backendUrl}:${backendPort}/addCourse`,
        'POST',
        JSON.stringify(
          {
            course:
            {
              n: formState.inputs.n.value,
              Title: formState.inputs.title.value,
              Category: formState.inputs.category.value,
              Tools: formState.inputs.tools.value,
              Hours: formState.inputs.hours.value,
              Sections: formState.inputs.sections.value,
              Lectures: formState.inputs.lectures.value,
              Instructor: formState.inputs.instructor.value,
              Bought: formState.inputs.dateBought.value,
              Finished: formState.inputs.dateCompleted.value,
              desc: formState.inputs.description.value,
              notes: formState.inputs.notes.value,
              provider: formState.inputs.provider.value
            }
          }
        ),
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.token
        }
      );
      history.push(`/${auth.userId}/courses`); // send user back to courses page
    } catch (err) {
      // console.log(Object.keys(formState.inputs));
      console.log('NewCourse: courseSubmitHandler: Error in sendRequest');
      console.log(err.message);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="course-form" onSubmit={courseSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        {
          formData.fullMetadata.map(field => {
            return <Input
          key={field.id}
          id={field.id}
          type={field.type}
          element={field.element}
          label={field.label}
          validators={field.validators}
          errorText={field.errorText}
          onInput={inputHandler}
          initialValue=''
          initialIsValid={field.initialIsValid}
          formDisplay={field.formDisplay}
        />;
          }
        )
        }

        <div className="course-item__actions center">
          <Button type="submit" disabled={!formState.isValid}>
            ADD COURSE
          </Button>
          <Button to={`/`} cancel>
            CANCEL
          </Button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default NewCourse;
