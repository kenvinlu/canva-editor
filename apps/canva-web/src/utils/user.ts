// import { getCurrentUser } from "../services/auth.service";

// const assureUser = async () => {
//     const userId = getCookie(KEYS.USER_ID_KEY, null);
    
//     if (!userId) {
//       return;
//     }
  
//     // Checked user logged from client
//     store.dispatch({
//       type: UserActionTypes.SET_USER,
//       payload: {
//         isLoggedIn: true,
//       },
//     });
  
//     store.dispatch({
//       type: CommonActionTypes.ADD_LOADING,
//       payload: {
//         currentAction: UserActionTypes.FETCH_USER,
//       },
//     });
//     const user = await getCurrentUser();
  
//   };