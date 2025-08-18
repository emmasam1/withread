import Link from "next/link";
import React from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BsArrowUpRight } from "react-icons/bs";
import { GoArrowLeft } from "react-icons/go";

const page = () => {
  return (
    <div className="p-6">
      <Link
        href="/dashboard/settings"
        className="flex gap-2 items-center !text-black text-xs w-20"
      >
        <GoArrowLeft size="1rem" />
        Back
      </Link>
      <div className="bg-white mt-3">
        <h2 className="text-xl font-semibold mb-4">Contact Us</h2>

        {/* Chat with us */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-100 py-4 gap-3">
          <div>
            <h3 className="font-medium text-lg">Chat with us</h3>
            <p className="text-gray-500 text-sm">
              Got a problem? Chat with our team to help you out
            </p>
          </div>
          <Link
            href="mailto:withread@mail.com"
            className="flex items-center gap-2 !text-black font-medium "
          >
            Withread@mail.com{" "}
            <BsArrowUpRight size={25} height={5} className="-mt-2" />
          </Link>
        </div>

        {/* Email Support */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-100 py-4 gap-3">
          <div>
            <h3 className="font-medium text-lg">Email Support</h3>
            <p className="text-gray-500 text-sm">
              Email us and we’ll get back to you within 24hrs
            </p>
          </div>
          <Link
            href="mailto:withread@mail.com"
            className="flex items-center gap-2 !text-black"
          >
            Withread@mail.com{" "}
            <BsArrowUpRight size={25} height={5} className="-mt-2" />
          </Link>
        </div>

        {/* Call Us */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-100 py-4 gap-3">
          <div>
            <h3 className="font-medium text-lg">Call Us</h3>
            <p className="text-gray-500 text-sm">
              Mon - Fri 9:00am - 5:00pm (UTC +10:00)
            </p>
          </div>
          <div className="flex flex-col sm:items-end">
            <Link
              href="tel:+13001321642"
              className="flex items-center !text-black text-sm relative -left-8"
            >
              +1 300 1321 642
            </Link>
            <Link
              href="tel:+614020200242"
              className="flex items-center gap-2 !text-black text-sm"
            >
              +61 402 0200 242{" "}
              <BsArrowUpRight size={25} height={5} className="-mt-2" />
            </Link>
          </div>
        </div>

        {/* San Francisco */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-100 py-4 gap-3">
          <div>
            <h3 className="font-medium text-lg">San Francisco</h3>
            <p className="text-gray-500 text-sm">
              Visit our office Mon - Fri 9:00am - 5:00pm (UTC +10:00)
            </p>
            <p className="flex items-center gap-1 text-gray-600 text-sm mt-1">
              <HiOutlineLocationMarker className="text-lg" />
              10, Great richmond ave, downtown, san francisco
            </p>
          </div>
          <Link
            href="#"
            className="flex items-center gap-2 !text-black font-medium "
          >
            Get Directions{" "}
            <BsArrowUpRight size={25} height={5} className="-mt-2" />
          </Link>
        </div>

        {/* North Carolina */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-3">
          <div>
            <h3 className="font-medium text-lg">North Carolina</h3>
            <p className="text-gray-500 text-sm">
              Visit our office Mon - Fri 9:00am - 5:00pm (UTC +10:00)
            </p>
            <p className="flex items-center gap-1 text-gray-600 text-sm mt-1">
              <HiOutlineLocationMarker className="text-lg" />
              10, Great richmond ave, downtown, san francisco
            </p>
          </div>
          <Link
            href="#"
            className="flex items-center gap-2 !text-black font-medium "
          >
            Get Directions{" "}
            <BsArrowUpRight size={25} height={5} className="-mt-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
