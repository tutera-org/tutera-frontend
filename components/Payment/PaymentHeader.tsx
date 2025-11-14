"use client";

import Link from "next/link";
import Image from "next/image";
const PaymentHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="w-[90%] max-w-[1240px] mx-auto py-6 ">
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={120} height={36} />
        </Link>
      </div>
    </div>
  );
};

export default PaymentHeader;
