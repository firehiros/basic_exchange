import Moment from 'moment';
import users from './data/chatUsers';
import conversationList from './data/conversationList';
import {
    FILTER_CONTACT,
    FILTER_USERS,
    ON_HIDE_LOADER,
    ON_SELECT_USER,
    ON_TOGGLE_DRAWER,
    SUBMIT_COMMENT,
    UPDATE_MESSAGE_VALUE,
    UPDATE_SEARCH_CHAT_USER,
    USER_INFO_STATE
} from "constants/ActionTypes";


const INIT_STATE = {
    loader: false,
    userNotFound: 'No user found',
    drawerState: false,
    selectedSectionId: '',
    userState: 1,
    searchChatUser: '',
    contactList: users.filter((user) => !user.recent),
    selectedUser: null,
    message: '',
    chatUsers: users.filter((user) => user.recent),
    conversationList: conversationList,
    conversation: null
};


export default (state = INIT_STATE, action) => {

    switch (action.type) {
        case FILTER_CONTACT: {
            if (action.payload === '') {
                return {
                    ...state, contactList: users.filter(user => !user.recent)
                }
            } else {
                return {
                    ...state, contactList: users.filter((user) =>
                        !user.recent && user.name.toLowerCase().indexOf(action.payload.toLowerCase()) > -1
                    )
                }
            }
        }

        case FILTER_USERS: {
            if (action.payload === '') {
                return {
                    ...state, chatUsers: users.filter(user => !user.recent)
                }
            } else {
                return {
                    ...state, chatUsers: users.filter((user) =>
                        !user.recent && user.name.toLowerCase().indexOf(action.payload.toLowerCase()) > -1
                    )
                }
            }
        }

        case ON_SELECT_USER: {
            return {
                ...state,
                loader: true,
                drawerState: false,
                selectedSectionId: action.payload.id,
                selectedUser: action.payload,
                conversation: state.conversationList.find((data) => data.id === action.payload.id)
            }
        }
        case ON_TOGGLE_DRAWER: {
            return {...state, drawerState: !state.drawerState}
        }
        case ON_HIDE_LOADER: {
            return {...state, loader: false}
        }
        case USER_INFO_STATE: {
            return {...state, userState: action.payload}
        }

        case SUBMIT_COMMENT: {
            const updatedConversation = state.conversation.conversationData.concat({
                'type': 'sent',
                'message': state.message,
                'sentAt': Moment(new Date).format('ddd DD, YYYY, hh:mm:ss A'),
            });

            return {
                ...state,
                conversation: {
                    ...state.conversation, conversationData: updatedConversation
                },
                message: '',
                conversationList: state.conversationList.map(conversationData => {
                    if (conversationData.id === state.conversation.id) {
                        return {...state.conversation, conversationData: updatedConversation};
                    } else {
                        return conversationData;
                    }
                })

            }
        }

        case UPDATE_MESSAGE_VALUE: {
            return {...state, message: action.payload}
        }

        case UPDATE_SEARCH_CHAT_USER: {
            return {...state, searchChatUser: action.payload}
        }

        default:
            return state;
    }
}
