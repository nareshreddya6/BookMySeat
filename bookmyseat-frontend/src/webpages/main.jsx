import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegistrationPage from "./register/components/registrationForm.component";
import { LoginForm } from "./login/components/loginForm.component";
import { ForgotPassword } from "./forgotPassword/components/forgotPassword.component";
import { HomePage } from "./home/components/homePage.component";
import ResetPassword from "./forgotPassword/components/resetPassword.component";
import MessageHandle from "./register/components/messageHandling.component";
import AdminMain from "./admin/adminPages/adminMain";
import UserMain from "./user/userPages/userMain.component";
import ReceptionMain from "./reception/receptionPages/receptionMain.component";
import { GroundFloorMap } from "./floorMap/components/groundFloorMap.component";
import { MezzanineFloor } from "./floorMap/components/mezzanineFloorMap.component";
import { FirstFloor } from "./floorMap/components/firstFloor.component";
import { SecondFloor } from "./floorMap/components/secondFloor.component";
import { ThirdFloorMap } from "./floorMap/components/thirdFloor.component";
import { TerraceTrainingRoom } from "./floorMap/components/terraceTrainingRoom.module";
import { useState } from "react";
import Toaster from "./toaster/components/toaster.component";

export default function Main() {
  const [userRole, setUserRole] = useState(null);

  const GuardedRoute = ({ role, element }) => {
    if (!userRole) {
      return <Navigate to="/login" />;
    } else {
      return element;
    }
  };

  const handleLogin = (role) => {
    setUserRole(role);
  };
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/bookmyseat" />} />
          <Route exact path="/bookmyseat" element={<HomePage />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route exact path="/forgot" element={<ForgotPassword />} />
          <Route exact path="/register" element={<RegistrationPage />} />
          <Route exact path="/groundFloor" element={<GroundFloorMap />} />
          <Route exact path="/mezzanine" element={<MezzanineFloor />} />
          <Route exact path="/firstFloor" element={<FirstFloor />} />
          <Route exact path="/secondFloor" element={<SecondFloor />} />
          <Route exact path="/thirdFloor" element={<ThirdFloorMap />} />
          <Route exact path="/terrace" element={<TerraceTrainingRoom />} />
          <Route exact path="/toaster" element={<Toaster />} />
          <Route
            exact
            path="/bookmyseat/resetPassword/:token"
            element={<ResetPassword />}
          />
          <Route exact path="/message" element={<MessageHandle />} />
          <Route
            path="/admin"
            element={<GuardedRoute element={<AdminMain />} />}
          />
          <Route
            path="/reception"
            element={<GuardedRoute element={<ReceptionMain />} />}
          />
          <Route
            path="/user"
            element={<GuardedRoute element={<UserMain />} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
