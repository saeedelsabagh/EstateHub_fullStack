import { initialState } from "./arrays";

export default function estateReducer(state, action) {
  switch (action.type) {
    // case "TOGGLE_FAVORITE": {
    //   const isFavorite = state.favorites.some(
    //     (item) =>
    //       item.id === action.payload.id && item.userId === state.user?.id,
    //   );

    //   return {
    //     ...state,
    //     favorites: isFavorite
    //       ? state.favorites.filter(
    //           (item) =>
    //             !(
    //               item.id === action.payload.id &&
    //               item.userId === state.user?.id
    //             ),
    //         )
    //       : [
    //           ...state.favorites,
    //           {
    //             ...action.payload,
    //             userId: state.user?.id,
    //           },
    //         ],
    //   };
    // }
    case "SET_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.title]: action.payload.value,
        },
      };

    case "RESET_FILTERS":
      return {
        ...state,
        filters: initialState.filters,
      };
    case "SET_PROPERTY":
      return {
        ...state,
        newProperty: {
          ...state.newProperty,
          [action.payload.title]: action.payload.value,
        },
      };
    // case "ADD_PROPERTY":
    //   return {
    //     ...state,

    //     properties: [
    //       ...state.properties,
    //       {
    //         ...action.payload,
    //         agentId: state.user?.id,
    //         status: "Pending",
    //       },
    //     ],

    //     rows: [
    //       ...state.rows,
    //       {
    //         id: action.payload.id,
    //         agentId: state.user?.id,
    //         title: action.payload.title,
    //         location: action.payload.location,
    //         price: `$${action.payload.price}`,
    //         status: "Pending",
    //         image: action.payload.image,
    //         beds: action.payload.beds,
    //         baths: action.payload.baths,
    //         area: action.payload.area,
    //       },
    //     ],
    //   };
    // case "EDIT_PROPERTY":
    //   return {
    //     ...state,

    //     properties: state.properties.map((property) =>
    //       property.id === action.payload.id
    //         ? {
    //             ...property,
    //             ...action.payload,
    //           }
    //         : property,
    //     ),

    //     rows: state.rows.map((row) =>
    //       row.id === action.payload.id
    //         ? {
    //             ...row,
    //             title: action.payload.title,
    //             location: action.payload.location,
    //             price: `$${action.payload.price}`,
    //             image: action.payload.image,
    //             beds: action.payload.beds,
    //             baths: action.payload.baths,
    //             area: action.payload.area,
    //           }
    //         : row,
    //     ),
    //   };
    // case "DELETE_PROPERTY":
    //   return {
    //     ...state,

    //     properties: state.properties.filter(
    //       (property) => property.id !== action.payload.id,
    //     ),

    //     rows: state.rows.filter((row) => row.id !== action.payload.id),
    //   };
    // case "DELETE_PROPERTY_fromTable":
    //   return {
    //     ...state,
    //     properties: state.properties.filter(
    //       (property) => property.id !== action.payload,
    //     ),
    //     rows: state.rows.filter((row) => row.id !== action.payload),
    //   };
    case "SET_INQUIRY":
      return {
        ...state,
        inquiry: {
          ...state.inquiry,
          [action.payload.name]: action.payload.value,
        },
      };

    case "RESET_INQUIRY":
      return {
        ...state,
        inquiry: {
          name: "",
          phone: "",
          message: "",
        },
      };
    // case "ADD_INQUIRY":
    //   return {
    //     ...state,
    //     messages: [
    //       ...state.messages,
    //       {
    //         ...action.payload,
    //         userId: state.user?.id,

    //         conversation: [
    //           {
    //             sender: "user",
    //             text: action.payload.message,
    //           },
    //         ],

    //         replyInput: "",
    //         status: "pending",
    //       },
    //     ],
    //   };

    case "SET_REPLY_INPUT":
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === action.payload.id
            ? {
                ...message,
                replyInput: action.payload.value,
              }
            : message,
        ),
      };

    // case "SEND_MESSAGE":
    //   return {
    //     ...state,
    //     messages: state.messages.map((message) =>
    //       message.id === action.payload.id
    //         ? {
    //             ...message,
    //             conversation: [
    //               ...(message.conversation || []),
    //               {
    //                 sender: action.payload.sender,
    //                 text: message.replyInput,
    //               },
    //             ],
    //             replyInput: "",
    //             status:
    //               action.payload.sender === "agent" ? "replied" : "pending",
    //           }
    //         : message,
    //     ),
    //   };
    // case "DELETE_INQUIRY":
    //   return {
    //     ...state,
    //     messages: state.messages.filter(
    //       (message) => message.id !== action.payload.id,
    //     ),
    //   };
    case "SET_REGISTER":
      return {
        ...state,
        register: {
          ...state.register,
          [action.payload.name]: action.payload.value,
        },
      };

    // case "REGISTER": {
    //   const newAccount = {
    //     id: Date.now(),
    //     name: action.payload.name,
    //     email: action.payload.email,
    //     password: action.payload.password,
    //     role: action.payload.role,
    //   };
    //   console.log("NEW ACCOUNT:", newAccount);
    //   return {
    //     ...state,
    //     accounts: [...state.accounts, newAccount],
    //     user: newAccount,
    //     isAuthenticated: true,
    //     register: {
    //       name: "",
    //       email: "",
    //       password: "",
    //       confirmPassword: "",
    //       role: "user",
    //     },
    //   };
    // }

    // case "LOGIN":
    //   return {
    //     ...state,
    //     user: action.payload,
    //     isAuthenticated: true,
    //     login: {
    //       email: "",
    //       password: "",
    //     },
    //   };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case "SET_LOGIN":
      return {
        ...state,
        login: {
          ...state.login,
          [action.payload.name]: action.payload.value,
        },
      };
    case "SET_Action_MESSAGE":
      return {
        ...state,
        actionmessages: {
          ...state.actionmessages,
          [action.payload.type]: action.payload.text,
        },
      };
    //   case "APPROVE_PROPERTY":
    //     return {
    //       ...state,
    //       properties: state.properties.map((property) =>
    //         property.id === action.payload
    //           ? { ...property, status: "Approved" }
    //           : property,
    //       ),
    //       rows: state.rows.map((row) =>
    //         row.id === action.payload ? { ...row, status: "Approved" } : row,
    //       ),
    //     };

    //   case "REJECT_PROPERTY":
    //     return {
    //       ...state,

    //       properties: state.properties.map((property) =>
    //         property.id === action.payload
    //           ? { ...property, status: "Rejected" }
    //           : property,
    //       ),

    //       rows: state.rows.map((row) =>
    //         row.id === action.payload ? { ...row, status: "Rejected" } : row,
    //       ),
    //     };
      default:
        return state;
  }
}
