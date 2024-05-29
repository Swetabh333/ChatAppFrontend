import React, { useEffect, useState } from "react";
import "../assets/styles/chat.css";
import { useSelector } from "react-redux";
import Contact from "./Contact";
import Navleft from "./Navleft";
import { RootState } from "./state/store";
import axiosInstance from "../api/axios";
import { imageDb } from "../fireBaseConfig";
import uniqBy from "lodash-es/uniqBy";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";

const Chat: React.FC = () => {
  console.log(import.meta.env.VITE_REACT_APP_BACKEND_URL);

  type Offline = {
    _id: string;
    username: string;
  };
  type Online = {
    userId: string;
    username: string;
  };
  type message = {
    data: string;
    sender: string;
    receiver: string;
    url?: string;
    timestamp?: number;
  };

  type returnImage = {
    owner: string;
    url: string;
    timestamp: string;
  };

  const [selectedUser, setSelectedUser] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<null | Online[]>([]);
  const [offlineUsers, setOfflineUsers] = useState<null | Offline[]>();
  const [search, setSearch] = useState<string>("");
  const [inp, setInp] = useState<string>("");
  const [ws, setWS] = useState<WebSocket | null>();
  const [messages, setMessages] = useState<message[]>([]);
  const [file, setFile] = useState<File>();
  const [imageList, setImageList] = useState<returnImage[]>([]);
  const { user, id } = useSelector((state: RootState) => state.authReducer);
  const connectToSocket = async () => {
    const ws = new WebSocket("ws://localhost:5000");
    setWS(ws);
  };

  useEffect(() => {
    connectToSocket();
  }, []);

  useEffect(() => {
    //setLoading(true);
    const folderName =
      id < selectedUser ? `${id}-${selectedUser}` : `${selectedUser}-${id}`;
    //console.log(folderName)

    const folderRef = ref(imageDb, folderName);

    listAll(folderRef).then((res) => {
      res.items.forEach((item) => {
        //@ts-ignore
        const owner = item._location.path.split("@")[1].split("&")[0];
        //@ts-ignore
        const timestamp = item._location.path.split("&")[1];
        console.log(owner, timestamp);
        getDownloadURL(item).then((url: string) => {
          setImageList((prev: returnImage[]) => [
            ...prev,
            { owner, url, timestamp },
          ]);
        });
      });
    });
  }, [visible]);

  ws?.addEventListener("close", () => {
    setTimeout(() => {
      connectToSocket();
    }, 1000);
  });

  const handleMessages = (e: MessageEvent) => {
    const parsedMsg = JSON.parse(e.data);
    if (parsedMsg.usersOnline) {
      let { usersOnline } = parsedMsg;
      usersOnline = uniqBy(usersOnline, "userId");
      usersOnline = usersOnline.filter((e: Online) => {
        return e.userId != id;
      });
      setOnlineUsers(usersOnline);
    } else {
      setMessages((prev: message[]) => {
        return [
          ...prev,
          {
            data: parsedMsg.data,
            sender: parsedMsg.sender,
            receiver: parsedMsg.receiver,
            timestamp: parsedMsg.timestamp,
          },
        ];
      });
    }
  };
  ws?.addEventListener("message", handleMessages);

  useEffect(() => {
    axiosInstance.get("/getusers").then((res) => {
      const offlinePeople = res.data.users.filter((e: Offline) => {
        return e.username !== user;
      });
      setOfflineUsers(offlinePeople);
    });
  }, []);

  useEffect(() => {
    const folder =
      id < selectedUser ? `${id}-${selectedUser}` : `${selectedUser}-${id}`;

    if (file) {
      toast.info("Uploading file");
      const filev4 = v4();
      const fileRef = ref(imageDb, `${folder}/${filev4}@${id}&${Date.now()}`);
      uploadBytes(fileRef, file).then(() => {
        toast.success("File uploaded");
      });
    }
  }, [file]);

  useEffect(() => {
    setLoading(true);
    axiosInstance.post("/messages", { id, selectedUser }).then((res) => {
      if (res.data.msgs) {
        setMessages(() => [...res.data.msgs]);
      }
      setLoading(false);
    });
  }, [selectedUser]);

  const sendMessages = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (inp) {
      const addMsg: message = {
        data: inp,
        sender: id,
        receiver: selectedUser,
        timestamp: Date.now(),
      };
      setMessages((prevMessages: message[]) => {
        return [...prevMessages, addMsg];
      });
      const messageToSend: message = {
        data: inp,
        sender: id,
        receiver: selectedUser,
        timestamp: addMsg.timestamp,
      };
      ws?.send(JSON.stringify(messageToSend));
      setInp("");
    }
  };
  const uniqMessages = uniqBy(messages, "timestamp");
  const uniqImages = uniqBy(imageList, "timestamp");
  console.log(uniqImages);
  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="h-screen w-screen flex ">
        <div className="w-1/5 bg-darkBlack flex flex-col sidebar">
          <Navleft username={user} search={setSearch}></Navleft>
          {!search &&
            offlineUsers &&
            offlineUsers.map((e: Offline) => {
              return (
                <Contact
                  key={e._id}
                  id={e._id}
                  onlinePeople={onlineUsers}
                  username={e.username}
                  selected={e._id === selectedUser}
                  clickHandler={setSelectedUser}
                />
              );
            })}
          {search &&
            offlineUsers &&
            offlineUsers
              .filter((e: Offline) => {
                return e.username.toLowerCase().includes(search.toLowerCase());
              })
              .map((e: Offline) => {
                return (
                  <Contact
                    id={e._id}
                    key={e._id}
                    onlinePeople={onlineUsers}
                    username={e.username}
                    selected={e._id === selectedUser}
                    clickHandler={setSelectedUser}
                  />
                );
              })}
        </div>
        <div className="w-4/5 bg-black">
          {!selectedUser && (
            <div className="h-screen flex text-gray-500 font-bold items-center justify-center">
              <span>&#8592; Select a User to start chatting</span>
            </div>
          )}
          {selectedUser && loading && (
            <div className="h-screen flex flex-col text-gray-500 items-center justify-center">
              <span>Loading your chats. Please wait a moment...</span>
            </div>
          )}
          {selectedUser && !loading && (
            <div className="flex flex-col h-full">
              <Modal
                isOpen={visible}
                onRequestClose={() => {
                  setVisible(false);
                }}
                style={{
                  overlay: {
                    background: "#222F34",
                  },
                  content: {
                    background: "#111A20",
                    opacity: 1.0,
                    color: "white",
                    padding: "20px",
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: "700",
                  },
                }}
              >
                <h1>Chat media</h1>
                <div className="w-full flex flex-col mt-3">
                  {!imageList && <p>Loading Media wait a moment...</p>}
                  {uniqImages &&
                    uniqImages.map((e: returnImage) => {
                      return (
                        <div
                          key={e.timestamp}
                          className={
                            (e.owner === id
                              ? "self-end bg-Blue "
                              : "self-start bg-gray-500 ") + "img-cont "
                          }
                        >
                          <img
                            src={e.url}
                            className="w-{200} h-{200}"
                            alt="Loading image..."
                          />
                        </div>
                      );
                    })}
                </div>
              </Modal>
              <div className="w-full flex-grow flex flex-col chat-area overflow-y-scroll">
                {uniqMessages &&
                  uniqMessages.map((e: message) => {
                    if (e) {
                      return (
                        <div
                          className={
                            "p-3 " +
                            (e.sender == id ? "text-right" : "text-left")
                          }
                        >
                          <div
                            className={
                              "inline-block text-left messages text-white p-2 rounded-lg text-wrap " +
                              (e.sender === id ? "bg-Blue" : "bg-gray-500")
                            }
                          >
                            {e.data}
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
              <div className="w-full h-2/12 flex bg-darkBlack justify-center p-4">
                <input
                  type="text"
                  value={inp}
                  onChange={(e) => {
                    setInp(e.target.value);
                  }}
                  className="w-11/12 rounded-lg bg-black p-2 text-white border-none outline-none"
                  placeholder="Send a message..."
                />
                <label className="text-white h-12 w-12 flex items-center justify-center cursor-pointer hover:text-Blue">
                  <i className="fa-solid fa-paperclip">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          setFile(e.target.files[0]);
                        }
                      }}
                    />
                  </i>
                </label>
                <button
                  className="h-12 w-12 bg-Blue rounded-full mr-2"
                  onClick={() => {
                    setVisible(true);
                  }}
                >
                  <i className="fa-solid fa-photo-film"></i>
                </button>
                <button
                  className="h-12 w-12 send  bg-Blue"
                  onClick={sendMessages}
                >
                  <i className="fa-solid fa-paper-plane text-white"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
