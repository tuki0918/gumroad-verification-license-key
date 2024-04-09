const Alert = ({ message }: { message: string }) => {
  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="h-6 w-6 shrink-0 stroke-info"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  );
  return (
    <div role="alert" className="alert">
      {icon}
      <span>{message}</span>
    </div>
  );
};

const AlertInfo = ({ message }: { message: string }) => {
  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="h-6 w-6 shrink-0 stroke-current"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  );
  return (
    <div role="alert" className="alert alert-info">
      {icon}
      <span>{message}</span>
    </div>
  );
};

const AlertSuccess = ({ message }: { message: string }) => {
  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
  return (
    <div role="alert" className="alert alert-success">
      {icon}
      <span>{message}</span>
    </div>
  );
};

const AlertWarning = ({ message }: { message: string }) => {
  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
  return (
    <div role="alert" className="alert alert-warning">
      {icon}
      <span>{message}</span>
    </div>
  );
};

const AlertError = ({ message }: { message: string }) => {
  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
  return (
    <div role="alert" className="alert alert-error">
      {icon}
      <span>{message}</span>
    </div>
  );
};

const AlertMessage = ({
  mode,
  message,
}: {
  mode: "info" | "success" | "warning" | "error";
  message: string;
}) => {
  switch (mode) {
    case "info":
      return <AlertInfo message={message} />;
    case "success":
      return <AlertSuccess message={message} />;
    case "warning":
      return <AlertWarning message={message} />;
    case "error":
      return <AlertError message={message} />;
    default:
      const _: never = mode;
      return <Alert message={message} />;
  }
};

export default AlertMessage;
