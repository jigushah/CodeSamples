import _ from 'lodash';
//const merge = require('deepmerge');
//import merge from 'deepmerge'
import {
    BOOKING_LIST_FETCH_SUCCESS,
    BOOKING_LIST_REFRESH,
    NEW_BOOKING_DATE_CHANGED,
    NEW_BOOKING_TIME_CHANGED,
    NEW_BOOKING_SET_INITIAL_DATE_AND_TIME,
    NEW_BOOKING_VEHICLE_CHANGED,
    NEW_BOOKING_BUNDLE_CHANGED,
    NEW_BOOKING_SERVICE_CHANGED,
    NEW_BOOKING_REPEAT_EVERY_CHANGED,
    NEW_BOOKING_PAYMENT_CHANGED,
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
} from '../actions/types';

const INITIAL_STATE = {
    datesList:{},
    timeList:{},
    dateAndTimes: {},
    new: {
        temp: {
            location: {},
            payment: {
                id: ''
            },
            date: '',
            time: '',
            bundle: {
                id: ''
            },
            vehicle: {
                id: ''
            },
            services: {},
        },
        confirmed: {
            location: {},
            payment: {
                id: ''
            },
            date: '',
            time: '',
            bundle: {
                id: ''
            },
            vehicle: {
                id: ''
            },
            services: {},
        },
        date: '',
        time: '',
        repeatEvery: 0,
        vehicle: {
            id: ''
        },
        bundle: {
            id: ''
        },
        services: {},
        notes: '',

        payment: {
            id: ''
        },
        address: {
            alreadyExists: false,
            valid: false,
            error: '',
            full: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            zipcode: '',
            lat: '',
            long: ''
        }
    },
    list: {
        upcomingIsLoading: false,
        pastIsLoading: false,
        upcoming: [],
        past: [],
        count: 0,
        lastBookedAgo: ''
    },
    isLoading: true
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case NEW_BOOKING_RESET:
          return {
            ...state
          };
        case NEW_BOOKING_SET_TEMP: {
            const temp = { ...state.new.temp };
            temp[action.payload.key] = action.payload.value;
            return {
                ...state,
                new: {
                    ...state.new,
                    temp
                }
            };
        }
        case NEW_BOOKING_UNSET_TEMP: {
            const newState = { ...state };
            newState.new.temp[action.payload] = newState.new.confirmed[action.payload];
            return newState;
        }
        case NEW_BOOKING_CONFIRM_TEMP: {

            const newState = { ...state };
            const temp = { ...state.new.temp };
            newState.new.confirmed[action.payload] = temp[action.payload];
            return newState;
        }
        case NEW_BOOKING_SELECT_LOCATION: {
            return {
                ...state,
                new: {
                    ...state.new,
                    address: action.payload
                }
            };
        }
        case NEW_BOOKING_LOCATION_VALIDATION_SUCCESS: {
            const a = action.payload;
            const temp = { ...state.new.temp };
            temp['location'] = a;
            return {
                ...state,
                new: {
                    ...state.new,
                    temp:{
                        ...state.new.temp,
                        location:{
                            valid: true,
                            error: '',
                            alreadyExists: !!a.id,
                            full: a.full,
                            address1: a.street_number,
                            address2: a.route,
                            city: a.locality,
                            state: a.administrative_area_level_1,
                            zipcode: a.postal_code,
                            lat: a.lat,
                            long: a.long
                        }
                    },
                    address: {
                        valid: true,
                        error: '',
                        alreadyExists: !!a.id,
                        full: a.full,
                        address1: a.street_number,
                        address2: a.route,
                        city: a.locality,
                        state: a.administrative_area_level_1,
                        zipcode: a.postal_code,
                        lat: a.lat,
                        long: a.long
                    }
                }
            };
        }

        case NEW_BOOKING_LOCATION_VALIDATION_FAIL: {
            return {
                ...state,
                new: {
                    ...state.new,

                    address: {
                        valid: false,
                        error: 'Sorry, we do not service that zipcode.'
                    }
                }
            };
        }
        case NEW_BOOKING_PAYMENT_CHANGED: {
            return {

                ...state,
                new: {
                    ...state.new,
                    temp: {
                        ...state.new.temp,
                        payment: action.payload
                    },
                    payment: action.payload
                }
            };
        }
        case NEW_BOOKING_REPEAT_EVERY_CHANGED:
            return {
                ...state,
                new: {
                    ...state.new,
                    repeatEvery: action.payload
                }
            };
        case NEW_BOOKING_VEHICLE_CHANGED:
            return {
                ...state,
                new: {
                    ...state.new,
                    vehicle: action.payload,
                    temp:{
                        ...state.new.temp,
                        vehicle:action.payload
                    },
                }
            };
        case NEW_BOOKING_BUNDLE_CHANGED:
            return {
                ...state,
                new: {
                    ...state.new,
                    temp:{
                        ...state.new.temp,
                        bundle:action.payload
                    },
                    bundle: action.payload
                }
            };
        case NEW_BOOKING_SERVICE_CHANGED: {
            const service = action.payload;
            const services = {
                ...state.new.services
            };
            if (_.find(state.new.services, { id: service.id })) {
                delete services[service.id];
            } else {
                services[service.id] = service;
            }
            return {
                ...state,
                new: {
                    ...state.new,
                    temp:{
                        ...state.new.temp,
                        services:services
                    },
                    services
                }
            };
        }
        case DATE_FETCH_SUCCESS: {
            const date = action.payload[0];
            return {
                ...state,
                datesList: action.payload,
                new: {
                    ...state.new,
                    temp:{
                        ...state.new.temp,
                        date:date
                    },
                    date: date,
                    //time
                }
            };
        }
        case TIME_FETCH_SUCCESS: {
            const tempTime =Object.keys(action.payload).map(function (key,index) {
                return key
                });

            const time = tempTime[0];
            return {
                ...state,
                timeList: action.payload,
                isLoading: false,
                new: {
                    ...state.new,
                    temp:{
                        ...state.new.temp,
                        time:time
                    },
                    time: time,

                }

            };
        }

        case DATE_AND_TIME_LIST_FETCH_SUCCESS:
            return {
                ...state,
                dateAndTimes: action.payload
            };
        case NEW_BOOKING_SET_INITIAL_DATE_AND_TIME: {
            const date = Object.keys(state.dateAndTimes)[0];
            const time = Object.keys(state.dateAndTimes[date])[0];
            return {
                ...state,
                new: {
                    ...state.new,
                    date,
                    time
                }
            };
        }

        case NEW_BOOKING_DATE_CHANGED: {
            return {
                ...state,
                isLoading: true,
                new: {
                    ...state.new,
                    temp:{
                        ...state.new.temp,
                        date:action.payload
                    },
                    date: action.payload,

                    //time
                }
            };
        }
        case NEW_BOOKING_TIME_CHANGED: {
            return {
                ...state,
                new: {
                    ...state.new,
                    time: action.payload,
                    temp: {
                        ...state.new.temp,
                        time: action.payload
                    },
                    //time: action.payload
                }
            };
        }

        case NOTES_CHANGED:
            return {
                ...state,
                new: {
                    ...state.new,
                    notes: action.payload,
                }
            };

        case BOOKING_LIST_REFRESH:
            return {
                ...state,
                list: {
                    ...state.list,
                    upcomingIsLoading: true,
                    pastIsLoading: true,
                    count: action.payload.count,
                    lastBookedAgo: action.payload.lastBookedAgo
                }
            };
        case BOOKING_LIST_FETCH_SUCCESS:
            return {
                ...state,
                list: {
                    upcoming: action.payload.upcoming,
                    past: action.payload.past,
                    upcomingIsLoading: false,
                    pastIsLoading: false,
                    count: action.payload.count || INITIAL_STATE.list.count,
                    lastBookedAgo: action.payload.lastBookedAgo || INITIAL_STATE.list.lastBookedAgo
                }
            };
        default: return state;
    }
};
