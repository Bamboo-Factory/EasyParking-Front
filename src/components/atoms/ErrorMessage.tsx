interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="text-center text-red-600 p-4">
      {message}
    </div>
  );
};

export default ErrorMessage; 