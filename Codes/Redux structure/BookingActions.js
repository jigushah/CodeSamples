import { NavigationActions } from '@expo/ex-navigation';
import axios from 'axios';
import {
  BOOKING_LIST_FETCH_SUCCESS,
  BOOKING_LIST_REFRESH,
  NEW_BOOKING_DATE_CHANGED,
  NEW_BOOKING_TIME_CHANGED,
  NEW_BOOKING_SET_INITIAL_DATE_AND_TIME,
  NEW_BOOKING_VEHICLE_CHANGED,
  NEW_BOOKING_BUNDLE_CHANGED,
  NEW_BOOKING_SERVICE_CHANGED,
  NEW_BOOKING_PAYMENT_CHANGED,
  NEW_BOOKING_REPEAT_EVERY_CHANGED,
  DATE_FETCH_SUCCESS,
  TIME_FETCH_SUCCESS,
  DATE_AND_TIME_LIST_FETCH_SUCCESS,
  NEW_BOOKING_LOCATION_VALIDATION_SUCCESS,
  NEW_BOOKING_LOCATION_VALIDATION_FAIL,
  NEW_BOOKING_SELECT_LOCATION,
  NEW_BOOKING_SET_TEMP,
  NEW_BOOKING_UNSET_TEMP,
  NEW_BOOKING_CONFIRM_TEMP,
  NOTES_CHANGED,
  NEW_BOOKING_RESET
} from './types';
import Router from '../navigation/Router';
import ApiManager from '../api/manager';

export const fetchBookings = (refresh = false) => {
    return (dispatch, getState) => {
        if (refresh === true) {
            dispatch({ type: BOOKING_LIST_REFRESH });
        }
        const path = ApiManager.buildRoute('fetchBookings', getState().user.accessToken);
        return fetch(path, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => ApiManager.checkStatus(res, 'Invalid credentials.'))
        .then(res => res.json())
        .then(json => {
            {
                return dispatch({type: BOOKING_LIST_FETCH_SUCCESS, payload: json});
            }
        })
        .catch(error => {
            throw new Error(error);
        });
    };
};

export const fetchDateAndTimes = () => {
    return (dispatch, getState) => {
        const path = ApiManager.buildRoute('fetchDateAndTimes', getState().user.accessToken);
        return fetch(path, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => ApiManager.checkStatus(res, 'Invalid credentials.'))
        .then(res => res.json())
        .then(json => {

            return dispatch({ type: DATE_AND_TIME_LIST_FETCH_SUCCESS, payload: json });
        })
        .catch(error => {
            throw new Error(error);
        });
    };
};

export const validateZipCode = (address) => {
    return (dispatch, getState) => {
        const path = ApiManager.buildRoute('validateZipcode', getState().user.accessToken).replace('{data}', address.postal_code);
        return fetch(path, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => ApiManager.checkStatus(res, 'Invalid zipcode.'))
        .then(res => res.json())
        .then(() => {
            return dispatch({ type: NEW_BOOKING_LOCATION_VALIDATION_SUCCESS, payload: address });
        })
        .catch(() => {
            dispatch({ type: NEW_BOOKING_LOCATION_VALIDATION_FAIL });
            const initialRoute = Router.getRoute('requestMynt', { address });
            const route = Router.getRoute('modal', { initialRoute });
            return dispatch(NavigationActions.push('root', route));
        });
    };
};

export const viewReceipt = (row) => {
    return (dispatch, getState) => {
      const initialRoute = Router.getRoute('receipt', row);
      const route = Router.getRoute('modal', { initialRoute });
      return dispatch(NavigationActions.push('root', route));
    };
};

export const setSelectedSavedLocation = (address) => {
    return {
        type: NEW_BOOKING_LOCATION_VALIDATION_SUCCESS,
        payload: address
    };
};

export const selectLocation = (location) => {
  return {
    type: NEW_BOOKING_SELECT_LOCATION,
    payload: location
  };
};

export const setInitialDateAndTime = () => {
    return { type: NEW_BOOKING_SET_INITIAL_DATE_AND_TIME };
};
export const setDateAndTime = () => {
    return { type: DATE_FETCH_SUCCESS};
};

export const repeatEveryChanged = (type) => {
    return {
        type: NEW_BOOKING_REPEAT_EVERY_CHANGED,
        payload: type
    };
};

export const vehicleChanged = (vehicle) => {
    return {
        type: NEW_BOOKING_VEHICLE_CHANGED,
        payload: vehicle
    };
};

export const bundleChanged = (bundle) => {
    return (dispatch, getState) => {
        dispatch({
            type: NEW_BOOKING_BUNDLE_CHANGED,
            payload: bundle
        });
       // const navigatorUID = getState().navigation.currentNavigatorUID;
       // dispatch(NavigationActions.push(navigatorUID, Router.getRoute('services')));
    };
};

export const serviceChanged = (service) => {
    return {
        type: NEW_BOOKING_SERVICE_CHANGED,
        payload: service
    };
};

export const dateChanged = (date) => {
    return {
        type: NEW_BOOKING_DATE_CHANGED,
        payload: date
    };
};

export const timeChanged = (time) => {

    return {
        type: NEW_BOOKING_TIME_CHANGED,
        payload: time
    };
};

export const paymentChanged = (payment) => {
    return {
        type: NEW_BOOKING_PAYMENT_CHANGED,
        payload: payment
    };
};

export const setTemp = (data) => {

  return {
    type: NEW_BOOKING_SET_TEMP,
    payload: data
  };
};

export const unsetTemp = (data) => {
  return {
    type: NEW_BOOKING_UNSET_TEMP,
    payload: data
  };
};

export const confirmTemp = (data) => {

  return {
    type: NEW_BOOKING_CONFIRM_TEMP,
    payload: data
  };
};
export const addedNote = (data) => {
    return {
        type: NOTES_CHANGED,
        payload: data
    };
};

export const fetchDates = (data) => {
  return (dispatch, getState) => {
    const path = ApiManager.buildRoute('gatherDates', getState().user.accessToken);
    /*
      Required params:
      {
        "location": location id,
        "details": [
          {
            "bundle": bundle id,
            "vehicle": vehicle id
          }
        ]
      }

      Example:
      {
        "location": 1,
        "details": [
          {
            "bundle": 15,
            "vehicle": 1
          }
        ]
      }
    */
    axios.post(path, {
      location: getState().booking.new.confirmed.location.id,
      details: [
        {
          bundle: getState().booking.new.confirmed.bundle.id,
          vehicle:getState().booking.new.confirmed.vehicle.id,
        }
      ]
    })
      .then(response => {
          return dispatch({ type: DATE_FETCH_SUCCESS, payload: response.data });

      })
      .catch(err => {
        console.log('error from fetchDates', err);
        // dispatch(confirmCodeFailure(err.response.data.message));
      });
  };
};

export const fetchTimes = (date) => {
  return (dispatch, getState) => {
    const path = ApiManager.buildRoute('gatherTimes', getState().user.accessToken);
    /*
      Required params:
      {
        "location": location id,
        "date": the date that we are fetching the times for
        "details": [
          {
            "bundle": bundle id,
            "vehicle": vehicle id
          }
        ]
      }

      Example:
      {
        "location": 1,
        "date": "2017-06-12"
        "details": [
          {
            "bundle": 15,
            "vehicle": 1
          }
        ]
      }
    */
      axios.post(path, {
      location: getState().booking.new.confirmed.location.id,
      date,
      details: [
        {
          bundle: getState().booking.new.confirmed.bundle.id,
          vehicle: getState().booking.new.confirmed.vehicle.id,
        }
      ]
    })
      .then(response => {
          return dispatch({ type: TIME_FETCH_SUCCESS, payload: response.data });

      })
      .catch(err => {
          // dispatch(confirmCodeFailure(err.response.data.message));
      });
  };
};

export const newBooking = (booking) => {
  return (dispatch, getState) => {
    const path = ApiManager.buildRoute('newBooking', getState().user.accessToken);
    /*
      Required params:
      {
        "location": location id,
        "date": the date that the user selected,
        "time": the time that the user selectec,
        "payment": payment id,
        "notes": any notes that the user entered,
        "details": [
          {
            "bundle": bundle id,
            "vehicle": vehicle id
          }
        ]
      }

      Example:
      {
        "location": 1,
        "date": "2017-06-12"
        "time": "1496664000_1496671200",
        "payment": "card_xsdad41423asdaxadsadx80640a6d4",
        "notes": "test note",
        "details": [
          {
            "bundle": 15,
            "vehicle": 1
          }
        ]
      }
    */
      // {
      //     location: booking.new.confirmed.location,
      //         date: booking.new.confirmed.date,
      //     time:booking.new.confirmed.time,
      //     payment: booking.new.confirmed.payment,
      //     notes: booking.new.notes,
      //
      //
      //     //services: state.booking.new.services,
      //
      //     details: [
      //     {
      //         bundle:booking.new.bundle,
      //         vehicle:booking.new.temp.vehicle,
      //     }
      // ]
      // }
      axios.post(path, booking)
        .then(response => {
            dispatch(fetchBookings(false));
            debugger;
            dispatch(setTemp({ key: 'location', value: "" }));
            dispatch(setTemp({ key: 'vehicle', value: "" }));
            dispatch(setTemp({ key: 'bundle', value: "" }));
            dispatch(setTemp({ key: 'payment', value: "" }));
            dispatch(setTemp({key:'date',value:''}));
            dispatch(setTemp({key:'time',value:''}));
            dispatch(confirmTemp('location'));
            dispatch(confirmTemp('vehicle'));
            dispatch(confirmTemp('bundle'));
            dispatch(confirmTemp('payment'));
            dispatch(confirmTemp('date'));
            dispatch(confirmTemp('time'));

            const navigatorUID = getState().navigation.currentNavigatorUID;
            dispatch(NavigationActions.push(navigatorUID, Router.getRoute('success')));
        })
        .catch(err => {
            // We need to display the validation errors for the user
            console.log('error from newBooking', err);
            console.log('error from newBooking data', err.response.data);
        });
  };
};

export const resetBooking = () => {
  return {
    type: NEW_BOOKING_RESET
  };
};
