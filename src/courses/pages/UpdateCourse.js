import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useForm } from '../../shared/hooks/form-hook';
import { CourseMetaData } from '../formData/CourseMetaData';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './CourseForm.css';

const formData = new CourseMetaData();
const formFields = formData.formFields;
const formInput = formData.formInput;
const validFormKeys = formData.validFormKeys;

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
        // TODO: could dynamically process the responseData fields to populate
        //       all formState subobjects with initial values and validity;
        //       check keys in responseData.course against validFormKeys and
        //       set values accordingly.  this would look a lot like the code
        //       used in courseUpdateSubmitHandler to build updateBody.
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
      let updateBody = {};
      // TODO: could refactor to put the whole forEach into a separate function; or
      //       just put the nested if in its own function.
      //       I have also added a field "alias" to formFields that could be used
      //       (somehow!) to handle the "n"/"purchaseSequence" case more cleanly,
      //       but the code would have to look at that variable, not just formState.
      const formEntries = Object.entries(formState.inputs);
      formEntries.forEach(([formKey, formValue]) => {
        if (validFormKeys.includes(formKey)) {
          if (formKey === 'n') {
            if (formValue['value'] !== loadedCourse['purchaseSequence']) {
              // console.log(`Key purchaseSequence: ${loadedCourse['purchaseSequence']} to ${formValue['value']}`);
              updateBody['purchaseSequence'] = formValue['value'];
            }
          } else {
            if (formValue['value'] !== loadedCourse[formKey]) {
              // console.log(`Key ${formKey}: ${loadedCourse[formKey]} to ${formValue['value']}`);
              updateBody[formKey] = formValue['value'];
            }
          }
        }
      });

      if (Object.keys(updateBody).length > 0) {
        const updateObj = { "update": updateBody };
        // console.log(updateBody);
        // console.log(updateObj);
        await sendRequest(
          `${backendUrl}:${backendPort}/${courseId}`,
          'PATCH',
          JSON.stringify(
            updateObj
          ),
          {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth.token
          }
        );
      }
      history.push(`/${auth.userId}/courses`);
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
              if (field.isUpdateable || auth.isAdmin) {
                return <Input
                  key={field.id}
                  id={field.id}
                  type={field.type}
                  element={field.element}
                  label={field.label}
                  validators={field.validators}
                  errorText={field.errorText}
                  onInput={inputHandler}
                  // eslint-disable-next-line
                  initialValue={eval(field.initialValue)}
                  initialIsValid={true}
                  formDisplay={field.formDisplay}
                />;
              } else {
                return '';
              }
            }
            )
          }
          <div className="course-item__actions center">
            <Button type="submit" disabled={!formState.isValid}>
              UPDATE COURSE
            </Button>
            <Button to={`/${auth.userId}/courses`} cancel>
              CANCEL
            </Button>
          </div>
        </form>
      }
    </React.Fragment>
  );
};

export default UpdateCourse;
