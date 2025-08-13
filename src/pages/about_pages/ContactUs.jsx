import React from "react";
import Footer from "../../reusable_components/Footer";
import { Button, Input } from "@heroui/react";
import NavBar from "../../reusable_components/NavBar";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    // const errors = {};
    // if (!formData.name) errors.name = "Name is required";
    // if (!formData.email) {
    //   errors.email = "Email is required";
    // } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    //   errors.email = "Email is invalid";
    // }
    // if (!formData.phoneNumber) {
    //   errors.phoneNumber = "Phone number is required";
    // } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
    //   errors.phoneNumber = "Phone number must be 10 digits";
    // }
    // if (!formData.message) errors.service = "Message is required";

    // setFormErrors(errors);
    // return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    // const { name, value } = e.target;
    // setFormData((prev) => ({
    //   ...prev,
    //   [name]: value,
    // }));
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // if (!validateForm()) return;

    // setLoading(true);
    // try {
    //   await createContactFormApi(formData);
    //   toast.success("Form submitted successfully!");
    //   setFormData({
    //     name: "",
    //     email: "",
    //     phoneNumber: "",
    //     message: "",
    //   });
    //   setFormErrors({});
    // } catch (error) {
    //   toast.error("Error submitting form. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div>
      <NavBar index={0} />
      <div className="mx-0 lg:mx-20">
        <div className="flex flex-col lg:flex-row overflow-hidden">
          <div className="flex flex-col w-full lg:w-1/2 m-6 justify-center items-center">
            {/* <div className="text-2xl lg:text-3xl font-semibold text-[#23b5b5]">
                  Contact Us
                </div> */}
            <div className="text-4xl lg:text-5xl mt-5 mb-10 font-bold text-center">
              GET IN TOUCH WITH US
            </div>
            <img
              src={images.contact_us_illustrator}
              className="w-2/3 lg:w-1/2 h-auto my-10"
              alt="Contact Us Illustration"
            ></img>
            <div className="w-full text-xl lg:text-3xl text-center font-bold text-white my-5">
              Let's Make Magic Happen Together!
            </div>
            <div className="w-full text-sm lg:text-medium text-center font-light text-white my-5">
              We're excited to hear about your ideas! Book an appointment with
              our digital marketing team today, and let's start crafting
              strategies that turn your dreams into reality.
            </div>
          </div>

          <div className="flex flex-col w-full lg:w-[45%] mx-0 lg:mx-8 my-6 justify-self-end">
            <div className="bg-zinc-900 w-full h-full rounded-3xl flex flex-col justify-between shadow-lg shadow-black border-2 border-gray-500">
              <div className="w-full text-xl lg:text-3xl text-center font-bold text-[#23b5b5] my-5">
                Request a Callback
              </div>
              <form
                onSubmit={handleSubmit}
                className="h-auto lg:h-4/5 m-6 lg:m-8 flex flex-col justify-around"
              >
                <div className="flex flex-col lg:flex-row gap-5">
                  <div className="w-full">
                    <Input
                      name="name"
                      isClearable
                      type="text"
                      label="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full my-3"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm">{formErrors.name}</p>
                    )}
                  </div>
                </div>
                <Input
                  name="email"
                  isClearable
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full my-3"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm">{formErrors.email}</p>
                )}
                <Input
                  name="phoneNumber"
                  isClearable
                  type="tel"
                  label="Contact Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full my-3"
                />
                {formErrors.phoneNumber && (
                  <p className="text-red-500 text-sm">
                    {formErrors.phoneNumber}
                  </p>
                )}
                <Input
                  name="message"
                  isClearable
                  type="tel"
                  label="Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full my-3"
                />
                {formErrors.message && (
                  <p className="text-red-500 text-sm">{formErrors.message}</p>
                )}

                <div className="my-6 h-12 lg:h-14">
                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full ${
                      loading ? "bg-gray-400" : "bg-[#23b5b5]"
                    } font-bold text-lg lg:text-xl`}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
