import { useEffect } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { toast } from "react-hot-toast";


const NotificationToast = () => {
    useEffect(() => {
        const messaging = getMessaging();

        const unsubscribe = onMessage(messaging, (payload) => {
            console.log("Message received in foreground: ", payload);

            const { title, body } = payload.notification;

            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <img
                                    className="h-10 w-10 rounded-full"
                                    src="https://firebase.google.com/static/images/brand-guidelines/logo-vertical.png"
                                    alt="Notification icon"
                                />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">{title}</p>
                                <p className="mt-1 text-sm text-gray-500">{body}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l border-gray-200">
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            ), {
                duration: 5000, // Time to show the toast
                style: {
                    padding: "0px", // Adjust padding here if needed
                },
            });
        });

        return () => unsubscribe();
    }, []);

    return null;
};

export default NotificationToast;
