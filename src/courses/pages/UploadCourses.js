import React, { useContext } from 'react';
// import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import { useParams } from 'react-router-dom';

// import Input from '../../shared/components/FormElements/Input';
import FileSelector from '../../shared/components/FormElements/FileSelector';
import Button from '../../shared/components/FormElements/Button';
// import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './UploadCourses.css';

const UploadCourses = () => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  // const [loadedCourse, setLoadedCourse] = useState();

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://localhost';
  const backendPort = process.env.REACT_APP_BACKEND_PORT_C || 3002;

  const history = useHistory();

  const [formState, inputHandler] = useForm(
    {
      xlsfile: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const courseUploadSubmitHandler = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('xlsfile', formState.inputs.xlsfile.value);
      await sendRequest(
        `${backendUrl}:${backendPort}/addCourses`,
        'POST',
        formData,
        {
          'Authorization': 'Bearer ' + auth.token
        }
      );
      // setTimeout(() => {
        history.push(`/${auth.userId}/courses`);
      // }, 2000);
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

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading &&
        <form className="upload-course-form" onSubmit={courseUploadSubmitHandler}>
          <FileSelector
            id="xlsfile"
            onInput={inputHandler}
            errorText="Please select an Excel file."
          />

          <div className="course-item__actions">
            <Button type="submit" disabled={!formState.isValid}>
              UPLOAD COURSES
            </Button>
            <Button to={`/`} cancel>CANCEL</Button>
          </div>
        </form>
      }
    </React.Fragment>
  );
};

export default UploadCourses;
