import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaFacebook, FaInstagram, FaTwitter, FaRegCalendar, FaMapMarkerAlt, FaUsers, FaLink, FaFilePdf, FaImage, FaStar } from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminEventDetailPage = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        axios.get(`${BASE_URL}/events/${eventId}`).then((res) => setEvent(res.data));
    }, [eventId]);

    if (!event) return <div className="text-center p-8">Loading event details...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            {event.title}
                            {event.isFeatured && <FaStar className="text-yellow-400" />}
                        </h1>
                        <p className="text-gray-600 mt-2">{event.description}</p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                {event.eventType}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                                {event.department}
                            </span>
                            <span className={`px-3 py-1 rounded-full ${event.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {event.status}
                            </span>
                        </div>
                    </div>
                    <img
                        src={event.image}
                        alt="Event cover"
                        className="w-32 h-32 object-cover rounded-lg"
                    />
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="flex items-center gap-2">
                        <FaRegCalendar className="text-gray-400" />
                        <span>
                            {new Date(event.date).toLocaleDateString()}
                            {event.endDate &&
                                new Date(event.endDate).toDateString() !== new Date(event.date).toDateString() &&
                                ` - ${new Date(event.endDate).toLocaleDateString()}`
                            }
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaUsers className="text-gray-400" />
                        <span>{event.participants.length}/{event.capacity} attendees</span>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                    {/* Organizer Details */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Organizer Details</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium">{event.organizer.name}</h3>
                                <p className="text-sm text-gray-600">{event.organizer.contactEmail}</p>
                                <p className="text-sm text-gray-600">{event.organizer.contactPhone}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Faculty Coordinator</p>
                                    <p className="font-medium">{event.organizer.facultyCoordinator}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Student Coordinator</p>
                                    <p className="font-medium">{event.organizer.studentCoordinator}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Details */}
                    <div className="bg-white dark:bg-gray-900  rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Registration Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Required</p>
                                <p className="font-medium">
                                    {event.registrationRequired ? 'Yes' : 'No'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Deadline</p>
                                <p className="font-medium">
                                    {event.registrationDeadline
                                        ? new Date(event.registrationDeadline).toLocaleDateString()
                                        : "No deadline"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Fee</p>
                                <p className="font-medium">
                                    {event.registrationFee ? `$${event.registrationFee}` : 'Free'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Payment Link</p>
                                <a href={event.paymentLink} className="text-blue-600 hover:underline">
                                    View Payment
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-white dark:bg-gray-900  rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Social Media</h2>
                        <div className="flex gap-4">
                            {event.socialMedia.facebook && (
                                <a href={event.socialMedia.facebook} className="text-blue-600 hover:text-blue-800">
                                    <FaFacebook size={24} />
                                </a>
                            )}
                            {event.socialMedia.instagram && (
                                <a href={event.socialMedia.instagram} className="text-pink-600 hover:text-pink-800">
                                    <FaInstagram size={24} />
                                </a>
                            )}
                            {event.socialMedia.twitter && (
                                <a href={event.socialMedia.twitter} className="text-blue-400 hover:text-blue-600">
                                    <FaTwitter size={24} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Agenda */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Event Agenda</h2>
                        <div className="space-y-4">
                            {event?.agenda?.length > 0 ? (
                                event.agenda.map((item, index) => (
                                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                                        <h3 className="font-medium">{item.title}</h3>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                        <div className="text-sm text-gray-500 mt-1">
                                            <p>{item.speaker}</p>
                                            <p>
                                                {new Date(item.startTime).toLocaleString()} - {" "}
                                                {new Date(item.endTime).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No agenda available.</p>
                            )}
                        </div>
                    </div>


                    {/* Participants */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Participants ({event.participants.length})</h2>
                        {event.participants.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Role</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Registered</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {event.participants.map((p, index) => (
                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="px-4 py-2 text-sm dark:text-gray-200">{p.name}</td>
                                                <td className="px-4 py-2 text-sm dark:text-gray-200">{p.email}</td>
                                                <td className="px-4 py-2 text-sm">
                                                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 text-xs">
                                                        {p.role}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(p.updatedAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                No participants registered yet.
                            </div>
                        )}
                    </div>

                    {/* Attachments & Gallery */}
                    <div className="space-y-8">
                        {event.attachments.length > 0 && (
                            <div className="bg-white dark:bg-gray-900  rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">Attachments</h2>
                                <div className="space-y-2">
                                    {event.attachments.map((file, index) => (
                                        <a
                                            key={index}
                                            href={file.url}
                                            target="_blank"
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                        >
                                            <FaFilePdf />
                                            {file.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {event.gallery.length > 0 && (
                            <div className="bg-white dark:bg-gray-900  rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">Gallery</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {event.gallery.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`Gallery ${index + 1}`}
                                            className="h-32 w-full object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Eligibility */}
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Eligibility</p>
                        <p className="font-medium dark:text-gray-200">
                            {event.eligibility || "Not specified"}
                        </p>
                    </div>

                    {/* Target Audience */}
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Target Audience</p>
                        <p className="font-medium dark:text-gray-200">
                            {event.targetAudience || "Not specified"}
                        </p>
                    </div>

                    {/* Prerequisites */}
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Prerequisites</p>
                        <p className="font-medium dark:text-gray-200">
                            {event.prerequisites || "Not specified"}
                        </p>
                    </div>

                    {/* Virtual Event */}
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Virtual Event</p>
                        <p className="font-medium dark:text-gray-200">
                            {event.virtualEventLink ? (
                                <a
                                    href={event.virtualEventLink}
                                    className="text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Join Online
                                </a>
                            ) : (
                                "No"
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Metadata */}
            <div className="text-sm text-gray-500 text-center">
                Created by {event.createdBy.name} on {new Date(event.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
};

export default AdminEventDetailPage;