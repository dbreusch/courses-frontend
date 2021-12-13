import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
// import { VALIDATOR_MINLENGTH } from '../../shared/util/validators';

export const formFields = [
  {
    "id": "purchaseSequence",
    "label": "Purchase Sequence",
    "validators": [VALIDATOR_REQUIRE()],
    "errorText": "Please enter a valid purchase sequence.",
    "initialValue": "loadedCourse.purchaseSequence"
  },
  {
    "id": "title",
    "label": "Title",
    "validators": [VALIDATOR_REQUIRE()],
    "errorText": "Please enter a valid title.",
    "initialValue": "loadedCourse.title",
    "updateable": "true"
  },
  {
    "id": "category",
    "label": "Category",
    "validators": [VALIDATOR_REQUIRE()],
    "errorText": "Please enter a valid category value.",
    "initialValue": "loadedCourse.category",
    "updateable": "true"
  },
  {
    "id": "tools",
    "label": "Tools",
    "validators": [VALIDATOR_REQUIRE()],
    "errorText": "Please enter a valid tools value.",
    "initialValue": "loadedCourse.tools",
    "updateable": "true"
  },
  {
    "id": "hours",
    "label": "Hours",
    "validators": [VALIDATOR_REQUIRE()],
    "errorText": "Please enter a valid hours value.",
    "initialValue": "loadedCourse.hours",
    "updateable": "true"
  },
  {
    "id": "sections",
    "label": "Sections",
    "validators": [VALIDATOR_REQUIRE()],
    "errorText": "Please enter a valid sections value.",
    "initialValue": "loadedCourse.sections",
    "updateable": "true"
  },
  {
    "id": "lectures",
    "label": "Lectures",
    "validators": [VALIDATOR_REQUIRE()],
    "errorText": "Please enter a valid lectures value.",
    "initialValue": "loadedCourse.lectures",
    "updateable": "true"
  },
  {
    "id": "instructor",
    "label": "Instructor",
    "validators": [VALIDATOR_REQUIRE()],
    "errorText": "Please enter a valid instructor.",
    "initialValue": "loadedCourse.instructor",
    "updateable": "true"
  },
  {
    "id": "dateBought",
    "label": "Date Bought",
    "validators": [VALIDATOR_REQUIRE()],
    "errorText": "Please enter a valid bought date.",
    "initialValue": "loadedCourse.dateBought",
    "updateable": "true"
  },
  {
    "id": "dateFinished",
    "label": "Date Finished",
    "validators": [VALIDATOR_REQUIRE()],
    "errorText": "Please enter a valid finished date.",
    "initialValue": "loadedCourse.dateFinished",
    "updateable": "true"
  },
]
