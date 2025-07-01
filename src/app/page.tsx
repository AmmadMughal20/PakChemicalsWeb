'use client'
import AdminDashboard from "@/components/AdminDashboard";
import DistributorDashboard from "@/components/DistributorDashboard";
import LoginForm from "@/components/LoginForm";
import { RootState } from "@/store";
import { useState } from "react";
import { useSelector } from "react-redux";


export default function Home()
{
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [isRTL, setIsRTL] = useState(false);

  const toggleRTL = () =>
  {
    setIsRTL(!isRTL);
  };


  if (!isAuthenticated || !user)
  {
    return (
      <LoginForm isRTL={isRTL} />
    )
  }

  if (user.role === 'admin')
  {
    return <AdminDashboard isRTL={isRTL} toggleRTL={toggleRTL} />;
  }

  return <DistributorDashboard isRTL={isRTL} toggleRTL={toggleRTL} />;

}
