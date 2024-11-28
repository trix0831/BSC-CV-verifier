import React from "react";
import { IoIosWarning } from "react-icons/io";
export default function Card({
    name,
    competition_name,
    award,
    description,
    honoree,
    image,
    issuer_address,
    official_web,
    organizer,
    warning,
}) {
    return (
        <div className="relative max-w-xs w-64 h-96 rounded-lg overflow-hidden shadow-lg bg-white">
            {warning? <div className="absolute left-3 top-3 p-1 bg-black rounded-lg"><IoIosWarning className="text-yellow-400 text-2xl"/></div>:<></>}
            <img
                className="w-full h-2/5  object-cover"
                src={image}
                alt={name}
            />
            <div className="h-2/5 px-6 py-4 overflow-y-scroll overflow-x-scroll">
                <h2 className="font-bold text-black text-xl mb-2">{competition_name}-{award}</h2>
                <p className="text-gray-700 text-sm mb-2">
                    <span className="font-semibold">Honoree:</span> {honoree}
                </p>
                <p className="text-gray-700 text-sm mb-2">
                    <span className="font-semibold">Description:</span>{" "}
                    {description}
                    sasidhioshih
                </p>
                <p className="text-gray-700 text-sm mb-2">
                    <span className="font-semibold">Organizer:</span> {organizer}
                </p>
                <p className="text-gray-700 text-sm mb-2">
                    <span className="font-semibold">Issuer Address:</span>{" "}
                    {issuer_address}
                </p>
                <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Official Web:</span>{" "}
                    <a
                        href={official_web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        {official_web}
                    </a>
                </p>
            </div>
            <div className="h-1/5 px-6 pt-4 pb-2">
              {['a', 'fm', 'aspo'].map((tag, index) => (
                  <span
                      key={index}
                      className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-blue-700 mr-2"
                  >
                      #{tag}
                  </span>
              ))}
          </div>
        </div>
    );
}
