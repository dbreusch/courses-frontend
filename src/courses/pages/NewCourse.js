import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { CourseMetadata } from '../metadata/CourseMetadata';
import { splitCamelCase } from '../../shared/util/splitCamelCase';
import './CourseForm.css';

const NewCourse = () => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const history = useHistory();

  const [apiMetadata, setApiMetadata] = useState();
  const [formData,] = useState(new CourseMetadata());
  const [formInput, setFormInput] = useState({});

  const [formState, inputHandler] = useForm(formInput, false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://localhost';
  const backendPort = process.env.REACT_APP_BACKEND_PORT_C || 3002;

  // get course metadata from backend
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // console.log('NewCourse: fetchMetadata: Fetching metadata...');
        const responseData = await sendRequest(`${backendUrl}:${backendPort}/getMetadata`);
        setApiMetadata(responseData.metadata);
      } catch (err) {
        console.log('NewCourse: fetchMetadata: Error fetching metadata');
        console.log(err.message);
      }
    };
    fetchMetadata();
  }, [sendRequest, backendPort, backendUrl]);

  // update formData object when metadata changes
  useEffect(() => {
    if (apiMetadata) {
      // console.log('NewCourse: useEffect formData: Updating full metadata...');
      formData.metadata = apiMetadata;
    }
    // eslint-disable-next-line
  }, [apiMetadata]);

  // update formInput when metadata changes
  useEffect(() => {
    // console.log('NewCourse: useEffect formData.formInput: Updating form input...');
    setFormInput(formData.formInput);
    // eslint-disable-next-line
  }, [apiMetadata]);

  const courseSubmitHandler = async event => {
    event.preventDefault();

    // TODO
    // generate dynamically from formData.metadata and formState
    try {
      await sendRequest(
        `${backendUrl}:${backendPort}/addCourse`,
        'POST',
        JSON.stringify(
          {
            course:
            {
              purchaseSequence: formState.inputs.purchaseSequence.value,
              title: formState.inputs.title.value,
              category: formState.inputs.category.value,
              tools: formState.inputs.tools.value,
              hours: formState.inputs.hours.value,
              sections: formState.inputs.sections.value,
              lectures: formState.inputs.lectures.value,
              instructor: formState.inputs.instructor.value,
              dateBought: formState.inputs.dateBought.value,
              dateCompleted: formState.inputs.dateCompleted.value,
              description: formState.inputs.description.value,
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
          formData.metadata.map(field => {
            return <Input
              key={field.id}
              id={field.id}
              type={field.type}
              element={field.element}
              label={splitCamelCase(field.id)}
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
