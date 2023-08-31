import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile/Profile";
import jwtDecode from "jwt-decode";
import Admin from "./components/Admin/Admin";
import Services from "./components/Admin/Services";
import Languages from "./components/Admin/Languages";
import People from "./components/People/People";
import Movies from "./components/Movies/Movies";
import Genres from "./components/Admin/Genres";
import ManagePeople from "./components/Admin/ManagePeople";
import ManageMovies from "./components/Admin/ManageMovies";
import OneMovie from "./components/Movies/OneMovie";
import OnePerson from "./components/People/OnePerson";
import List from "./components/List/List";

function App() {
  const [hasToken, setHasToken] = useState(null);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    setHasToken(localStorage.getItem("token") ? true : false);
    if (localStorage.getItem("token")) {
      setUserData(jwtDecode(localStorage.getItem("token")));
    }
  }, [hasToken]);
  return (
    <BrowserRouter>
      {hasToken == true
        ? userData && (
            <>
              <Navbar setHasToken={setHasToken} userData={userData} />
              <div
                style={{
                  paddingTop: 70,
                  paddingBottom: 30,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  minHeight: "100%",
                }}
              >
                <Routes>
                  <Route path="" element={<Movies />} />
                  <Route
                    exact
                    path="user/:user_id"
                    element={
                      <Profile setHasToken={setHasToken} userData={userData} />
                    }
                  />
                  <Route exact path="people" element={<People />} />
                  <Route exact path="movie/:movie_id" element={<OneMovie />} />
                  <Route
                    exact
                    path="people/:person_id"
                    element={<OnePerson />}
                  />
                  <Route exact path="list/:list_id" element={<List />} />
                  {userData.usr_role == 1 && (
                    <>
                      <Route exact path="admin" element={<Admin />} />
                      <Route
                        exact
                        path="admin/movies"
                        element={<ManageMovies />}
                      />
                      <Route
                        exact
                        path="admin/people"
                        element={<ManagePeople />}
                      />
                      <Route
                        exact
                        path="admin/services"
                        element={<Services />}
                      />
                      <Route
                        exact
                        path="admin/languages"
                        element={<Languages />}
                      />
                      <Route exact path="admin/genres" element={<Genres />} />
                    </>
                  )}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </>
          )
        : hasToken == false && (
            <Routes>
              <Route path="" element={<Login setHasToken={setHasToken} />} />
              <Route
                path="register"
                element={<Register setHasToken={setHasToken} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
    </BrowserRouter>
  );
}

export default App;
