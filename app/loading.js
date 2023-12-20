import { FaSpinner } from "react-icons/fa";

const Loading = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <FaSpinner color="red" />
    </div>
  );
};

export default Loading;
