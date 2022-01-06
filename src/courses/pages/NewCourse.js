import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useForm } from '../../shared/hooks/form-hook';
import { CourseMetaData } from '../formData/CourseMetaData';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './CourseForm.css';

const formData = new CourseMetaData();
const formFields = formData.formFields;
const formInput = formData.formInput;

const NewCourse = () => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    formInput,
    false
  );

  const history = useHistory();

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://localhost';
  const backendPort = process.env.REACT_APP_BACKEND_PORT_C || 3002;

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
              Finished: formState.inputs.dateFinished.value,
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
      console.log(err.message);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="course-form" onSubmit={courseSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        {
          formFields.map(field => {
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
