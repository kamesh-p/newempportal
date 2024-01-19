import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import clientPromise from "../lib/mongodb";

const SidebarComponent = ({ user, chat }) => {
  const userLoggedIn = useSelector((state) => state.user);
  console.log("user", userLoggedIn?.user?.user?.name);
  const name = userLoggedIn?.user?.user?.name;
  const Id = userLoggedIn?.user?.user?.id;

  const [message, setMessage] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Load the selected user from localStorage on component mount
    const storedUser = localStorage.getItem("selectedUser");
    if (storedUser) {
      setSelectedUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      setMessage("");
    }

    console.log("chat", message);
    try {
      const timestamp = new Date().toISOString(); // Get current timestamp
      const response = await fetch("/api/chatMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatMessages: message,
          sendid: Id,
          receiveid: selectedUser?._id,
          timestamp: timestamp,
        }),
      });

      if (response.ok) {
        console.log("New questions submitted successfully.");
      } else {
        console.error("Failed to submit new questions.");
      }
    } catch (error) {
      console.error("Error submitting new questions:", error.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const searchTerm = e.target.elements["simple-search"].value;

    if (searchTerm.trim() !== "") {
      console.log("Search Term:", searchTerm);

      // Perform client-side search on the user data
      const results = user.filter((userData) =>
        userData.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults(results);
    }
  };

  const handleSelectUser = (selectedUserData) => {
    setSelectedUser(selectedUserData);

    // Store the selected user in localStorage
    localStorage.setItem("selectedUser", JSON.stringify(selectedUserData));
  };

  const sortedChat = [...chat].sort((a, b) => {
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  const filtersendchat = sortedChat.filter((e) => {
    return e.sendid === Id && e.receiveid === selectedUser?._id;
  });

  const filterreceivechat = sortedChat.filter((e) => {
    return e.sendid === selectedUser?._id && e.receiveid === Id;
  });

  const combinedChat = [...filtersendchat, ...filterreceivechat];
  //   console.log("cobined chat", combinedChat);
  const sortedChatuser = [...combinedChat].sort((a, b) => {
    return new Date(a.timestamp) - new Date(b.timestamp);
  });
  const filtersendchatuser = sortedChat.filter((e) => {
    return e.sendid === Id;
  });
  console.log(
    "Received IDs:",
    filtersendchatuser.map((e) => e.receiveid)
  );

  console.log("fil", user);
  const uniqueReceivedNamesSet = new Set();
  filtersendchatuser.forEach((e) => {
    const receivedUser = user.find((u) => u._id === e.receiveid);
    if (receivedUser) {
      uniqueReceivedNamesSet.add(receivedUser);
    }
  });

  const uniqueReceived = Array.from(uniqueReceivedNamesSet);

  console.log("Unique Received Names:", uniqueReceived);
  return (
    <div className="flex h-screen">
      <div className="bg-gray-200 w-full p-4 fixed top-0 bottom-0 right-0">
        <div className="flex flex-col h-full">
          <div className="flex h-full">
            <div className="w-1/4 h-full bg-white p-4 overflow-y-auto border-r border-gray-300">
              {/* Chat History Header */}
              <p className="text-teal-700 text-2xl font-extrabold text-center my-5">
                Chat History
              </p>

              {/* Search Form */}
              <form className="flex items-center mb-4" onSubmit={handleSearch}>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                    placeholder="Search user..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="p-2.5 ms-2 text-sm font-medium text-white bg-teal-700 rounded-lg border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span className="sr-only">Search</span>
                </button>
              </form>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <p className="text-gray-700 font-medium mb-2">
                    Search Results:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {searchResults.map((result, index) => (
                      <div key={index}>
                        <button
                          className="cursor-pointer text-left w-full py-2 px-3 mb-2 rounded-md transition duration-300 hover:bg-gray-100"
                          onClick={() => handleSelectUser(result)}
                        >
                          {result.name}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Send Section */}
              <div className="mt-4">
                <p className="text-gray-700 font-medium mb-2">Personal user</p>
                <button
                  className="cursor-pointer text-left w-full py-2 px-3 mb-2 rounded-md transition duration-300 hover:bg-gray-100"
                  onClick={() => handleSelectUser({ name })}
                >
                  {name}
                </button>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 font-medium mb-2">Recent send:</p>
                {uniqueReceived.map((e) => (
                  <div key={e._id}>
                    <button
                      className="cursor-pointer text-left w-full py-2 px-3 mb-2 rounded-md transition duration-300 hover:bg-gray-100"
                      onClick={() => handleSelectUser(e)}
                    >
                      {e.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Box */}
            <div className="flex-1 bg-white p-4 ml-4 overflow-y-auto">
              <div className="font-bold text-teal-700  text-xl mb-7 w-full border-b-2  py-2 border-teal-800">
                <p className="ml-10">
                  {selectedUser
                    ? ` ${selectedUser.name}`
                    : "Select a user to chat"}
                </p>
              </div>
              <div
                className="flex-1 overflow-y-auto h-96 mb-4"
                style={{ overflowX: "hidden" }}
              >
                {sortedChatuser.map((e) => (
                  <div
                    key={e._id}
                    className={`${
                      e.sendid === Id
                        ? "text-right text-green-500"
                        : "text-left text-blue-500"
                    } mb-2`}
                  >
                    <div
                      className={`${
                        e.sendid === Id ? "bg-green-200" : "bg-blue-200"
                      } p-2 rounded-lg inline-block`}
                    >
                      {e.chatMessages} -{" "}
                      {new Date(e.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex absolute w-3/5 bottom-7 items-center mt-4">
                <input
                  type="text"
                  placeholder="Type your message"
                  className="border w-full p-3 flex-1 rounded-l"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  className="bg-teal-500 w-40 text-white p-3 rounded-r"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Message input */}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const messages = client.db("chat");

    const product = await db.collection("users").find({}).limit(20).toArray();
    const chat = await messages
      .collection("messages")
      .find({})
      .limit(20)
      .toArray();

    return {
      props: {
        user: JSON.parse(JSON.stringify(product)),
        chat: JSON.parse(JSON.stringify(chat)),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { user: [] },
    };
  }
}

export default SidebarComponent;
