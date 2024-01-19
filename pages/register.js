import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const generateRandomPassword = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }
    return password;
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: generateRandomPassword(),
    type: "",
    servey: false,
    trainee: "",
    mentor: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getDropdownOptions = () => {
    if (formData.type === "teamlead") {
      // Options for Trainee
      return (
        <>
          <option value="nithyaraj">Nithyaraj</option>
          <option value="kamesh">Kamesh</option>
        </>
      );
    } else if (formData.type === "teammember") {
      // Options for Mentor
      return (
        <>
          <option value="dhananjayan">Dhananjayan</option>
          <option value="lokesh">Lokesh</option>
        </>
      );
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const randomPassword = generateRandomPassword();
    console.log("Random Password:", randomPassword);
    console.log("Form Data:", formData);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: randomPassword,
          type: formData.type,
          servey: formData.servey,
          trainee: formData.trainee,
          mentor: formData.mentor,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
        toast.success("Registration successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Reset the form after successful registration
        setFormData({
          name: "",
          email: "",
          password: generateRandomPassword(),
          type: "",
          servey: false,
          trainee: "",
          mentor: "",
        });
      } else {
        console.error("Registration failed:", response.statusText);
        toast.error("Registration failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      <h2 className="text-3xl text-center font-extrabold text-teal-700  mb-10">
        Register
      </h2>
      <p className="px-10 text-justify tracking-wide leading-relaxed">
        Welcome to our exclusive HR registration page! This dedicated space is
        tailored for HR professionals to streamline the onboarding process. With
        a secure and user-friendly interface, HR members can efficiently manage
        registrations, ensuring a seamless and confidential experience. Join us
        as we prioritize privacy and efficiency for HR professionals.
      </p>
      <div className=" mt-10 ml-10 flex items-center justify-center">
        <div className="bg-white w-full p-8 rounded shadow-md">
          <form onSubmit={handleSubmit}>
            <label className="block mb-2">
              Name:
              <input
                type="text"
                name="name"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
                required
              />
            </label>
            <label className="block mb-2">
              Email:
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
                required
              />
            </label>
            <label className="block mb-2">
              Type:
              <select
                name="type"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
                required
              >
                <option value="" disabled defaultValue>
                  Select Type
                </option>
                <option value="hr">HR</option>
                <option value="teamlead">Team Lead</option>
                <option value="teammember">Team member</option>
              </select>
            </label>
            {formData.type === "teamlead" && (
              <label className="block mb-2">
                Trainee:
                <select
                  name="trainee"
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                >
                  {getDropdownOptions()}
                </select>
              </label>
            )}
            {formData.type === "teammember" && (
              <label className="block mb-2">
                Mentor:
                <select
                  name="mentor"
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                >
                  {getDropdownOptions()}
                </select>
              </label>
            )}
            <button
              type="submit"
              className="bg-teal-500 w-full text-white rounded px-4 py-2 hover:bg-blue-600"
            >
              Register
            </button>
          </form>
          <ToastContainer />
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full relative lg:pr-10 ml-20">
          <img
            src="https://www.postman.com/_wp-assets/home/homepage-footer-illustration.d3da12776e6f2f03c589282053789222.svg"
            className="btn-"
          />
        </div>
      </div>
    </>
  );
};

export default Register;
