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
        <div 
            className="relative max-w-xs w-64 h-96 rounded-lg overflow-hidden shadow-lg"
            style={{background: '#545361', border: '1.5px solid #6EACDA'}}
        >
            {warning? <div className="absolute left-3 top-3 p-1 bg-black rounded-lg"><IoIosWarning className="text-yellow-400 text-2xl"/></div>:<></>}
            <img
                className="w-full h-2/5  object-cover"
                src={image}
                alt={name}
            />
            <div className="h-3/5 px-6 py-4 overflow-y-scroll overflow-x-scroll">
                <h2 className="font-bold text-xl mb-2 text-[#6EACDA]">
                    {competition_name}-{award}
                </h2>
                <p className="text-sm mb-2" style={{color: '#e7dfdd'}}>
                    <span className="font-semibold">Honoree:</span> {honoree}
                </p>
                <p className="text-sm mb-2" style={{color: '#e7dfdd'}}>
                    <span className="font-semibold">Description:</span>{" "}
                    {description}
                </p>
                <p className="text-sm mb-2" style={{color: '#e7dfdd'}}>
                    <span className="font-semibold">Organizer:</span> {organizer}
                </p>
                <p className="text-sm mb-2" style={{color: '#e7dfdd'}}>
                    <span className="font-semibold">Issuer Address:</span>{" "}
                    {issuer_address}
                </p>
                <p className="text-sm" style={{color: '#e7dfdd'}}>
                    <span className="font-semibold">Official Web:</span>{" "}
                    <a
                        href={official_web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{color: '#e7dfdd'}}
                    >
                        {official_web}
                    </a>
                </p>
            </div>
        </div>
    );
}
