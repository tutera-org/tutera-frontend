"use client";
import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { toast } from "sonner";
import { api } from "@/lib/axiosClientInstance";
import TuteraLoading from "../Reuse/Loader";

interface ISubscription {
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
  trialEndDate: string;
  autoRenew: boolean;
}

interface ITenant {
  _id: string;
  name: string;
  email: string;
  type: string;
  subscription: ISubscription;
  isActive: boolean;
  isVerified: boolean;
  totalRevenue: number;
}

interface IUserData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string;
  role: string;
  isEmailVerified: boolean;
  isActive: boolean;
  tenantId: ITenant;
  tenantName: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfileInfo() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUserData | null>(null);

  // Fetch user data
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/v1/user");

      // Access the nested data: response.data.data.data
      const userData = response.data.data?.data;

      if (userData) {
        setUser(userData);
      } else {
        toast.error("No user data found");
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      const message =
        error.response?.data?.error || "Failed to fetch user data";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading state
  if (loading) {
    return <TuteraLoading />;
  }

  // No user data
  if (!user) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-16 px-4">
          <p className="text-sm sm:text-base text-gray-500">
            Unable to load user data
          </p>
        </div>
      </div>
    );
  }

  const tenant = user.tenantId;

  // Only show fields that have values
  const profileFields = [
    {
      icon: FaEnvelope,
      label: "Email",
      value: user.email,
      show: !!user.email,
    },
    {
      icon: FaUser,
      label: "First Name",
      value: user.firstName,
      show: !!user.firstName,
    },
    {
      icon: FaUser,
      label: "Last Name",
      value: user.lastName,
      show: !!user.lastName,
    },
    {
      icon: FaBuilding,
      label: "Institution Name",
      value: tenant?.name,
      show: !!tenant?.name,
    },
    {
      icon: FaBuilding,
      label: "Account Type",
      value: user.role,
      show: !!user.role,
    },
    {
      icon: FaCalendarAlt,
      label: "Member Since",
      value: formatDate(user.createdAt),
      show: !!user.createdAt,
    },
    {
      icon: FaClock,
      label: "Free Trial Ends",
      value: formatDate(tenant?.subscription?.trialEndDate),
      show:
        !!tenant?.subscription?.trialEndDate &&
        tenant?.subscription?.status === "trial",
    },
    {
      icon: FaCheckCircle,
      label: "Email Verification",
      value: user.isEmailVerified ? "Verified" : "Not Verified",
      show: user.isEmailVerified !== undefined,
      isStatus: true,
      verified: user.isEmailVerified,
    },
    {
      icon: FaCheckCircle,
      label: "Account Status",
      value: user.isActive ? "Active" : "Inactive",
      show: user.isActive !== undefined,
      isStatus: true,
      verified: user.isActive,
    },
  ];

  return (
    <div className="w-full lg:col-span-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 md:gap-8 lg:gap-10">
        {profileFields.map((field, index) => {
          if (!field.show) return null;

          const Icon = field.icon;

          return (
            <div key={index} className="flex items-start gap-3 sm:gap-4 group">
              <div className="shrink-0 mt-0.5 sm:mt-1">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </div>
              <div className="grow min-w-0">
                <p className="text-xs sm:text-sm md:text-sm font-medium text-gray-500 mb-1 sm:mb-1.5 tracking-wide uppercase">
                  {field.label}
                </p>
                <p
                  className={`text-sm sm:text-base md:text-lg leading-relaxed break-words ${
                    field.isStatus
                      ? field.verified
                        ? "text-green-600 font-semibold"
                        : "text-amber-600 font-semibold"
                      : "text-gray-900 font-medium"
                  }`}
                >
                  {field.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
