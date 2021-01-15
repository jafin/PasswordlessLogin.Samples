import { useStore } from "../../store";
import { Link } from "react-router-dom";

export const MyAccount = () => {
  const user = useStore((state) => state.user);

  return (
    <div>
      <h2>My Account</h2>
      <div>Username: {user.username}</div>
      <div>Email: {user.email}</div>
      <Link to="/setpassword">Set or Change Password</Link>
    </div>
  );
};
