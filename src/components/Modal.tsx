import React from "react";
import { Link } from "react-router";

const styles = {
  danger:
    "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center",
  primary:
    "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center",
  secondary:
    "py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100",
} as const;

interface Props {
  children: React.ReactNode;
  onClose?: () => void;
  actions: Record<
    string,
    | {
        color: keyof typeof styles;
        onClick: () => void;
      }
    | {
        color: keyof typeof styles;
        link: string;
      }
  >;
}

const Modal: React.FC<Props> = ({ children, onClose, actions }) => {
  return (
    <div
      tabIndex={-1}
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="absolute bottom-0 p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white outline outline-black/5 rounded-lg shadow-lg">
          {onClose && (
            <button
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          )}
          <div className="p-4 md:p-5 text-center">
            <div className="mb-5 text-lg font-normal text-gray-500">
              {children}
            </div>
            {Object.entries(actions).map(([text, options]) =>
              "onClick" in options ? (
                <button
                  type="button"
                  key={text}
                  className={styles[options.color]}
                  onClick={options.onClick}
                >
                  {text}
                </button>
              ) : (
                <Link
                  key={text}
                  className={styles[options.color]}
                  to={options.link}
                >
                  {text}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
