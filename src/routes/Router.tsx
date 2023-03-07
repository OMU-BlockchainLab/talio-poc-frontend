import Organizations from 'pages/Organizations';
import SysMan from 'pages/SysMan';
import CreateCertificate from 'pages/Users/CreateCertificate';
import CreateCV from 'pages/Users/CreateCV';
import { Route, Routes } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Users from '../pages/Users';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Users />} />
      <Route path="/create-cv" element={<CreateCV />} />
      <Route path="/create-certificate" element={<CreateCertificate />} />
      <Route path="/organizations" element={<Organizations />} />
      <Route path="/sysman" element={<SysMan />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
}

export default Router;
