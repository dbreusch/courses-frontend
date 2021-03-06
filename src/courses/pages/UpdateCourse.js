import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

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

const UpdateCourse = () => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [loadedCourse, setLoadedCourse] = useState();
  const [apiMetadata, setApiMetadata] = useState();
  const [formData,] = useState(new CourseMetadata());
  const [formInput, setFormInput] = useState({});
  const [validFormKeys, setValidFormKeys] = useState([]);

  const courseId = useParams().courseId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(formInput, false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://localhost';
  const backendPort = process.env.REACT_APP_BACKEND_PORT_C || 3002;

  // get course metadata from backend
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // console.log('UpdateCourse: fetchMetadata: Fetching metadata...');
        const responseData = await sendRequest(`${backendUrl}:${backendPort}/getMetadata`);
        setApiMetadata(responseData.metadata);
      } catch (err) {
        console.log('UpdateCourse: fetchMetadata: Error fetching metadata');
        console.log(err.message);
      }
    };
    fetchMetadata();
  }, [sendRequest, backendPort, backendUrl]);

  // update formData object when metadata changes
  useEffect(() => {
    if (apiMetadata) {
      // console.log('UpdateCourse: useEffect formData: Updating full metadata...');
      formData.metadata = apiMetadata;
    }
    // eslint-disable-next-line
  }, [apiMetadata]);

  // update formInput when metadata changes
  useEffect(() => {
    // console.log('UpdateCourse: useEffect formData.formInput: Updating form input...');
    setFormInput(formData.formInput);
    // eslint-disable-next-line
  }, [apiMetadata]);

  // update validFormKeys when metadata changes
  useEffect(() => {
    // console.log('UpdateCourse: useEffect formData.validFormKeys: Updating form keys...');
    setValidFormKeys(formData.validFormKeys);
    // eslint-disable-next-line
  }, [apiMetadata]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const responseData = await sendRequest(
          `${backendUrl}:${backendPort}/${courseId}`
        );
        setLoadedCourse(responseData.course);
        // ************************************************************
        // 1/11/22
        // This TODO and the setFormData are obsolete.  Commenting out
        // the code did not affect behavior at all!
        //
        // TODO
        // dynamically process the responseData fields to populate
        // all formState subobjects with initial values and validity;
        // check keys in responseData.course against validFormKeys and
        // set values accordingly.  this would look a lot like the code
        // used in courseUpdateSubmitHandler to build updateBody.
        // setFormData(
        //   {
        //     title: {
        //       value: responseData.course.title,
        //       isValid: true
        //     },
        //     instructor: {
        //       value: responseData.course.instructor,
        //       isValid: true
        //     }
        //   },
        //   true
        // );
        // ************************************************************
      } catch (err) {
        console.log('UpdateCourse: fetchCourse: error fetching course');
        console.log(err.message);
      }
    };
    fetchCourse();
  }, [sendRequest, courseId, setFormData, backendUrl, backendPort]);

  const courseUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      let updateBody = {};
      const formEntries = Object.entries(formState.inputs);
      formEntries.forEach(([formKey, formValue]) => {
        if (validFormKeys.includes(formKey)) {
          if (formValue['value'] !== loadedCourse[formKey]) {
            // console.log(`UpdateCourse: Key ${formKey}: ${loadedCourse[formKey]} to ${formValue['value']}`);
            updateBody[formKey] = formValue['value'];
          }
        }
      });

      if (Object.keys(updateBody).length > 0) {
        const updateObj = { "update": updateBody };
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
      console.log('UpdateCourse: fetchCourse: error with course updating');
      console.log(err.message);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedCourse &&
        <form className="course-form" onSubmit={courseUpdateSubmitHandler}>
          {
            formData.metadata.map(field => {
              if (field.isUpdateable || auth.isAdmin) {
                return <Input
                  key={field.id}
                  id={field.id}
                  type={field.type}
                  element={field.element}
                  label={splitCamelCase(field.id)}
                  validators={field.validators}
                  errorText={field.errorText}
                  onInput={inputHandler}
                  initialValue={loadedCourse[field.id]}
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
