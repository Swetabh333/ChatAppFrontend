import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import "react-toastify/dist/ReactToastify.css";
import Protector from "./components/hooks/Protector";
import Chat from "./components/Chat";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route
          path="/chat"
          element={
            <Protector>
              <Chat />
            </Protector>
          }
        ></Route>
      </Routes>
    </Router>
  );
};

export default App;
