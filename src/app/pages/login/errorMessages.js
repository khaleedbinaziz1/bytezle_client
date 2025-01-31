// errorMessages.js

export const errorMessages = {
    'auth/email-already-in-use': 'The email address is already in use by another account.',
    'auth/invalid-email': 'The email address is not valid.',
    'auth/operation-not-allowed': 'Operation not allowed. Please contact support.',
    'auth/weak-password': 'The password is too weak.',
    'auth/user-disabled': 'The user account has been disabled by an administrator.',
    'auth/user-not-found': 'There is no user record corresponding to this identifier. The user may have been deleted.',
    'auth/wrong-password': 'The password is invalid or the user does not have a password.',
  };
  
  export const getErrorMessage = (errorCode) => {
    return errorMessages[errorCode] || 'An unknown error occurred. Please try again.';
  };
  