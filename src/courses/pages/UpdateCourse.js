import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useForm } from '../../shared/hooks/form-hook';
import { formInput } from '../formData/formInput';
import { formFields } from '../formData/formFields';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './CourseForm.css';


const UpdateCourse = () => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCourse, setLoadedCourse] = useState();

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://localhost';
  const backendPort = process.env.REACT_APP_BACKEND_PORT_C || 3002;

  const courseId = useParams().courseId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    formInput,
    false
  );

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const responseData = await sendRequest(
          `${backendUrl}:${backendPort}/${courseId}`
        );
        setLoadedCourse(responseData.course);
        setFormData(
          {
            title: {
              value: responseData.course.title,
              isValid: true
            },
            instructor: {
              value: responseData.course.instructor,
              isValid: true
            }
          },
          true
        );
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchCourse();
  }, [sendRequest, courseId, setFormData, backendUrl, backendPort]);

  const courseUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `${backendUrl}:${backendPort}/${courseId}`,
        'PATCH',
        JSON.stringify(
          {
            title: formState.inputs.title.value,
            instructor: formState.inputs.instructor.value
          }
        ),
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.token
        }
      );
      history.push(`/${auth.userId}`);
    } catch (err) {
      // console.log(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedCourse && !error) {
    return (
      <div className="center">
        <Card>
          <h2>UpdateCourse: Could not find course!</h2>
        </Card>
      </div>
    );
  }

  // 12/13/21
  // There is NO WAY around using eval in the code below.  I tried using Function
  // but it gave the same warnings about eval and then failed because the variable
  // was not in scope.  I also tried moving evaluation into the Input component but
  // that just moves the problem -- still can't do a "double interpolation" without
  // using the unsafe eval function!  At least the eslint directive turns off the
  // warning about it.
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedCourse &&
        <form className="course-form" onSubmit={courseUpdateSubmitHandler}>
          {
            formFields.map(field => {
              if (field.updateable) {
                return <Input
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  validators={field.validators}
                  errorText={field.errorText}
                  onInput={inputHandler}
                  // eslint-disable-next-line
                  initialValue={eval(field.initialValue)}
                  initialIsValid={true}
                />;
              } else {
                return '';
              }
            }
            )
          }
          <div className="course-item__actions">
            <Button type="submit" disabled={!formState.isValid}>
              UPDATE COURSE
            </Button>
            <Button to={`/`} cancel>CANCEL</Button>
          </div>
        </form>
      }
    </React.Fragment>
  );
};

export default UpdateCourse;
