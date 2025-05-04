export function userIsOwner() {
  // check if the current user role is hotel owner
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.role === "hotel_owner") {
    return true;
  }
  return false;
}

export  function userIsAdmin() {
  // check if the current user role is admin
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.role === "admin") {
    return true;
  }
  return false;
}

export function userIsCustomer() {
  // check if the current user role is customer
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.role === "customer") {
    return true;
  }
  return false;
}

export function userIsLoggedIn() {
  // check if the user is logged in
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    return true;
  }
  return false;
}
