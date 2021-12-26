import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import CourseDetails from './CourseDetails';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './CourseSummary.css';

const CourseItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const history = useHistory();

  const [showDetails, setShowDetails] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://localhost';
  const backendPort = process.env.REACT_APP_BACKEND_PORT_C || 3002;

  // const assetUrl = process.env.REACT_APP_ASSET_URL;

  const openDetailsHandler = () => setShowDetails(true);

  const closeDetailsHandler = () => setShowDetails(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${backendUrl}:${backendPort}/${props.course.id}`,
        'DELETE',
        null,
        {
          'Authorization': 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.course.id);
      history.push(`/${auth.userId}/courses`);  // send user back to courses page
    } catch (err) {
      console.log(err.message);
    }
  };

  let desc = '';
  if (props.course.description) {
    desc = props.course.description;
    if (props.course.description.length > 25) {
      desc = props.course.description.slice(0, 24) + "...";
    }
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showDetails}
        onCancel={closeDetailsHandler}
        header={props.course.title}
        contentClass="course-summary__modal-content"
        footerClass="course-summary__modal-actions center"
        footer={<Button inverse onClick={closeDetailsHandler}>CLOSE</Button>}
      >
        <div className="details-container">
          <CourseDetails
            course={props.course}
          />
        </div>
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="course-summary__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
            <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
          </React.Fragment>
        }>
        <p>Do you want to proceed and delete this course?
          Please note that it can't be undone thereafter.</p>
      </Modal>

      <li className="course-summary">
        <Card className="course-summary__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="course-summary__info">
            <h2>{props.course.title}</h2>
            <h3>{props.course.instructor}</h3>
            <p>{desc}</p>
          </div>
          <div className="course-summary__actions">
            <Button inverse onClick={openDetailsHandler}>
              DETAILS
            </Button>

            {(auth.userId === props.course.creator || auth.isAdmin) && (
              <Button to={`/courses/${props.course.id}`}>
                EDIT
              </Button>
            )}

            {(auth.userId === props.course.creator || auth.isAdmin) && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}

            <Button to={`/`} cancel>
              BACK
            </Button>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default CourseItem;
