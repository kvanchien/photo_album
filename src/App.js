import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarComponent from "./components/Navbar";
import Body from "./components/Body";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserProvider } from "./UserContext";
import PhotoDetail from "./components/PhotoDetail";
import Footer from "./components/Footer";
import UpdateProfile from "./components/UpdateProfile";
import VerifyAccount from "./components/VerifyAccount";
import Manage from "./components/Manage";
import ForgotPassword from "./components/ForgotPassword";

const App = () => {
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const albumsResponse = await axios.get("http://localhost:9999/albums");
        const photosResponse = await axios.get("http://localhost:9999/photos");
        setAlbums(albumsResponse.data);
        setPhotos(photosResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <NavbarComponent />
                <Body albums={albums} photos={photos} />
                <Footer />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/photos/:id" element={<PhotoDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/profile" element={<UpdateProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/manage" element={<Manage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
